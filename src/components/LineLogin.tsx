"use client";
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
