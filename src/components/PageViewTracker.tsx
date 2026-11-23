"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ページ閲覧を数える(全サイト共通の集計先へ送信)。
// 送るのはパスと参照元だけ。Cookie・IP・クエリ文字列など個人を特定する情報は送らない。
const ENDPOINT = "https://bhgvpikwhbphodswzfip.supabase.co/functions/v1/pv";

export default function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || process.env.NODE_ENV !== "production") return;
    try {
      const body = JSON.stringify({ p: pathname, r: document.referrer || "" });
      if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }));
      else fetch(ENDPOINT, { method: "POST", body, keepalive: true, mode: "no-cors" });
    } catch { /* 計測の失敗は無視 */ }
  }, [pathname]);
  return null;
}
