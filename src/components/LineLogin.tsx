"use client";
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
