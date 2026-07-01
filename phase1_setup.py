#!/usr/bin/env python3
# Phase 1: LINEログイン + 署名付きセッションCookie の土台を生成する。
# 使い方: リポジトリ直下(~/Documents/soccer-tokyo-jp)で
#   npm i jose @line/liff
#   python3 phase1_setup.py
#   npm run build
import os, pathlib

ROOT = pathlib.Path.cwd()

FILES = {}

FILES["src/lib/session.ts"] = r'''import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "kf_sess";
const MAX_AGE = 60 * 60 * 24 * 30; // 30日

function secret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "dev-insecure-secret-change-me"
  );
}

export type Session = { uid: string; name?: string };

// Route Handler / Server Action からのみ呼ぶ（Cookieを書く）
export async function createSession(s: Session) {
  const token = await new SignJWT({ uid: s.uid, name: s.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

// Server Component / Route Handler どちらからでも読める
export async function getSession(): Promise<Session | null> {
  try {
    const jar = await cookies();
    const t = jar.get(COOKIE)?.value;
    if (!t) return null;
    const { payload } = await jwtVerify(t, secret());
    return { uid: String(payload.uid), name: payload.name as string | undefined };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
'''

FILES["src/app/api/auth/line/route.ts"] = r'''import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

// クライアントから受け取った LINE idToken を LINE 側で検証し、
// 検証OKなら署名付きセッションCookieを発行する。
export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ ok: false, error: "no idToken" }, { status: 400 });
    }
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    if (!channelId) {
      return NextResponse.json({ ok: false, error: "LINE_LOGIN_CHANNEL_ID unset" }, { status: 500 });
    }
    const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
    });
    const data = await res.json();
    if (!res.ok || !data.sub) {
      return NextResponse.json(
        { ok: false, error: data.error_description || "verify failed" },
        { status: 401 }
      );
    }
    await createSession({ uid: data.sub, name: data.name });
    return NextResponse.json({ ok: true, name: data.name ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
'''

FILES["src/app/api/auth/logout/route.ts"] = r'''import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
'''

FILES["src/app/api/me/route.ts"] = r'''import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const s = await getSession();
  return NextResponse.json({ loggedIn: !!s, name: s?.name ?? null });
}
'''

FILES["src/components/LineLogin.tsx"] = r'''"use client";
import { useCallback, useEffect, useState } from "react";

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
    } catch {}
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          if (mounted) setReady(true);
          return;
        }
        const liff = (await import("@line/liff")).default;
        await liff.init({ liffId });
        if (liff.isLoggedIn()) {
          const idToken = liff.getIDToken();
          if (idToken) {
            await fetch("/api/auth/line", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            });
          }
        }
        await refresh();
      } catch {
        // LIFF未設定/初期化失敗時も画面は壊さない
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const login = useCallback(async () => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      alert("LIFF未設定です（NEXT_PUBLIC_LIFF_ID）");
      return;
    }
    const liff = (await import("@line/liff")).default;
    if (!liff.isLoggedIn()) liff.login({ redirectUri: window.location.href });
  }, []);

  const logout = useCallback(async () => {
    try {
      const liff = (await import("@line/liff")).default;
      if (liff.isLoggedIn()) liff.logout();
    } catch {}
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
  }, [refresh]);

  return { ready, loggedIn, name, login, logout, refresh };
}
'''

FILES["src/app/auth-test/page.tsx"] = r'''"use client";
import { useLineAuth } from "@/components/LineLogin";

export default function AuthTest() {
  const { ready, loggedIn, name, login, logout } = useLineAuth();
  if (!ready) return <main style={{ padding: 24, fontFamily: "system-ui" }}>読み込み中…</main>;
  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 480 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>LINEログイン テスト</h1>
      <p style={{ margin: "12px 0" }}>
        状態: {loggedIn ? `ログイン中（${name ?? "名前なし"}）` : "未ログイン"}
      </p>
      {loggedIn ? (
        <button onClick={logout} style={btn}>ログアウト</button>
      ) : (
        <button onClick={login} style={btn}>LINEでログイン</button>
      )}
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#06c755",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
'''

written = []
for rel, content in FILES.items():
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    written.append(rel)

for w in written:
    print("OK:", w)
print("OK: Phase1 files written (", len(written), "files )")
