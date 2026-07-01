#!/usr/bin/env python3
# Phase 3c: LINEログインを access token 方式に切替（idToken/openid非依存・外部ブラウザで安定）
#  - LineLogin.tsx : access token(+id token) をサーバーへ送る
#  - api/auth/line : access token を LINE に照合(client_id一致確認)→/v2/profileでuserId取得→セッション発行
# 使い方: リポジトリ直下で  python3 phase3c_setup.py  → npm run build
import pathlib
ROOT = pathlib.Path.cwd()
FILES = {}

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
          const accessToken = liff.getAccessToken();
          const idToken = liff.getIDToken();
          if (accessToken || idToken) {
            await fetch("/api/auth/line", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken, idToken }),
            });
          }
        }
        await refresh();
      } catch (e) {
        console.error("liff init error", e);
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

FILES["src/app/api/auth/line/route.ts"] = r'''import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, idToken } = await req.json();
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    if (!channelId) {
      return NextResponse.json({ ok: false, error: "LINE_LOGIN_CHANNEL_ID unset" }, { status: 500 });
    }

    // 優先: access token を LINE に照合（profileスコープで必ず取得可・openid不要）
    if (accessToken) {
      const v = await fetch(`https://api.line.me/oauth2/v2.1/verify?access_token=${encodeURIComponent(accessToken)}`);
      const vd = await v.json();
      if (!v.ok || String(vd.client_id) !== String(channelId)) {
        return NextResponse.json({ ok: false, error: "access token verify failed", detail: vd }, { status: 401 });
      }
      const p = await fetch("https://api.line.me/v2/profile", { headers: { Authorization: `Bearer ${accessToken}` } });
      const pd = await p.json();
      if (!p.ok || !pd.userId) {
        return NextResponse.json({ ok: false, error: "profile fetch failed", detail: pd }, { status: 401 });
      }
      await createSession({ uid: pd.userId, name: pd.displayName });
      return NextResponse.json({ ok: true, name: pd.displayName ?? null });
    }

    // フォールバック: id token 検証
    if (idToken) {
      const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
      });
      const data = await res.json();
      if (!res.ok || !data.sub) {
        return NextResponse.json({ ok: false, error: "id token verify failed", detail: data }, { status: 401 });
      }
      await createSession({ uid: data.sub, name: data.name });
      return NextResponse.json({ ok: true, name: data.name ?? null });
    }

    return NextResponse.json({ ok: false, error: "no token" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
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
print("OK: Phase3c files written (", len(written), "files )")
