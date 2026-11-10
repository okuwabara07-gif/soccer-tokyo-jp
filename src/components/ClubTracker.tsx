"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";

// クラブページの閲覧とボタンのクリックを数える（掲載チームへの月1レポート用）。個人を特定する情報は送らない。
function send(clubId: string, kind: string) {
  try {
    const body = JSON.stringify({ club_id: clubId, kind });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/club-event", new Blob([body], { type: "text/plain" }));
    else fetch("/api/club-event", { method: "POST", body, keepalive: true });
  } catch { /* 計測の失敗は無視 */ }
}

export default function ClubTracker({ clubId }: { clubId: string }) {
  useEffect(() => {
    const key = `cv:${clubId}`;
    try {
      if (sessionStorage.getItem(key)) return; // 同じタブでの再読み込みは1回と数える
      sessionStorage.setItem(key, "1");
    } catch { /* storage が使えない環境 */ }
    send(clubId, "view");
  }, [clubId]);
  return null;
}

export function TrackedLink({ clubId, kind, href, className, style, children }: { clubId?: string; kind: string; href: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style} onClick={() => clubId && send(clubId, kind)}>
      {children}
    </a>
  );
}
