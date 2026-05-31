"use client";
import Link from "next/link";

const TABS = [
  { label: "ホーム", href: "/", icon: "M3 11l9-8 9 8M5 10v10h14V10" },
  { label: "探す", href: "/teams", icon: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3" },
  { label: "セレクション", href: "/selection", icon: "M8 2v4M16 2v4M3 9h18M5 5h14v15H5z" },
  { label: "口コミ", href: "/reviews", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { label: "マイページ", href: "/mypage", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0" },
];

export default function BottomNav() {
  return (
    <nav className="kf-bottomnav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 60,
      background: "var(--kf-surface)", borderTop: "1px solid var(--kf-border)",
      display: "none", justifyContent: "space-around", padding: "6px 4px",
    }}>
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} style={{ flex: 1, display: "grid", placeItems: "center", gap: 2, textDecoration: "none", color: "var(--kf-muted)", padding: "4px 0" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
          <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
        </Link>
      ))}
      <style>{`
        @media (max-width: 860px){ .kf-bottomnav{ display:flex !important; } body{ padding-bottom:64px; } }
      `}</style>
    </nav>
  );
}
