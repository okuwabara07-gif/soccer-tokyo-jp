#!/usr/bin/env python3
# Phase 3d: LIFFリダイレクトログインを廃止し、標準のサーバーサイド LINEログイン(OAuth)に切替。
#  - /api/auth/line/login    : LINE認可URLへリダイレクト(stateをCookieに保存)
#  - /api/auth/line/callback : code->token交換->profile取得->セッションCookie発行->元ページへ
#  - lib/session.ts          : signSession を追加(レスポンスにCookieを直接付与するため)
#  - components/LineLogin.tsx : LIFF依存を撤廃。login()は /api/auth/line/login へ遷移するだけ
# 使い方: リポジトリ直下で  python3 phase3d_setup.py  → npm run build
import pathlib
ROOT = pathlib.Path.cwd()
FILES = {}

FILES["src/lib/session.ts"] = r'''import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "kf_sess";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30日

function secret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "dev-insecure-secret-change-me"
  );
}

export type Session = { uid: string; name?: string };

// JWT文字列を返す（Route Handlerでレスポンスに直接Cookieを付与する用途）
export async function signSession(s: Session) {
  return await new SignJWT({ uid: s.uid, name: s.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

// cookies() 経由でCookieを書く（Server Action等）
export async function createSession(s: Session) {
  const token = await signSession(s);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  try {
    const jar = await cookies();
    const t = jar.get(SESSION_COOKIE)?.value;
    if (!t) return null;
    const { payload } = await jwtVerify(t, secret());
    return { uid: String(payload.uid), name: payload.name as string | undefined };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
'''

FILES["src/app/api/auth/line/login/route.ts"] = r'''import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) return NextResponse.json({ error: "LINE_LOGIN_CHANNEL_ID unset" }, { status: 500 });

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/line/callback`;
  const state = crypto.randomUUID();
  const dest = req.nextUrl.searchParams.get("redirect") || "/mypage";

  const authUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", channelId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", "profile openid");

  const res = NextResponse.redirect(authUrl.toString());
  const opt = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 600 };
  res.cookies.set("line_oauth_state", state, opt);
  res.cookies.set("line_oauth_dest", dest, opt);
  return res;
}
'''

FILES["src/app/api/auth/line/callback/route.ts"] = r'''import { NextRequest, NextResponse } from "next/server";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const origin = req.nextUrl.origin;
  const code = sp.get("code");
  const state = sp.get("state");
  const oauthError = sp.get("error");

  const cookieState = req.cookies.get("line_oauth_state")?.value;
  const destRaw = req.cookies.get("line_oauth_dest")?.value || "/mypage";
  const dest = destRaw.startsWith("/") ? destRaw : "/" + destRaw;

  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/auth-test?login=error&reason=${encodeURIComponent(reason)}`);

  if (oauthError) return fail(oauthError);
  if (!code || !state || !cookieState || state !== cookieState) return fail("state");

  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
  if (!channelId || !channelSecret) return fail("config");

  const redirectUri = `${origin}/api/auth/line/callback`;

  // code -> token
  const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });
  const token = await tokenRes.json();
  if (!tokenRes.ok || !token.access_token) return fail("token");

  // access_token -> profile (userId)
  const pRes = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const profile = await pRes.json();
  if (!pRes.ok || !profile.userId) return fail("profile");

  // セッションCookieをレスポンスに直接付与
  const jwt = await signSession({ uid: profile.userId, name: profile.displayName });
  const res = NextResponse.redirect(`${origin}${dest}`);
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE,
  });
  res.cookies.set("line_oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("line_oauth_dest", "", { path: "/", maxAge: 0 });
  return res;
}
'''

FILES["src/components/LineLogin.tsx"] = r'''"use client";
import { useCallback, useEffect, useState } from "react";

// サーバーサイド LINEログイン(OAuth)。LIFF非依存・ループしない。
export function useLineAuth() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      const d = await r.json();
      setLoggedIn(!!d.loggedIn);
      setName(d.name ?? null);
    } catch {
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(() => {
    const dest = window.location.pathname + window.location.search;
    window.location.href = `/api/auth/line/login?redirect=${encodeURIComponent(dest)}`;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
  }, [refresh]);

  return { ready, loggedIn, name, login, logout, refresh };
}
'''

written = []
for rel, content in FILES.items():
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    written.append(rel)
for w in written:
    print("OK:", w)
print("OK: Phase3d files written (", len(written), "files )")
