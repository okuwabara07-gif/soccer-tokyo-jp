"use client";
import Link from "next/link";
import { useState } from "react";
const NAV = [
  { label: "チームを探す", href: "/teams" },
  { label: "セレクション", href: "/selection" },
  { label: "口コミ", href: "/reviews" },
  { label: "学ぶ・楽しむ", href: "/performance" },
  { label: "育成コラム", href: "/column" },
  { label: "準備・グッズ", href: "/goods" },
  { label: "プレミアム", href: "/member" },
];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--kf-surface)", borderBottom: "1px solid var(--kf-border)" }}>
      <div className="kf-container" style={{ display: "flex", alignItems: "center", gap: 24, height: 68 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/images/kf/logo.png" alt="サッカーセレクション" style={{ height: 44, width: "auto", objectFit: "contain" }} />
          <span style={{ lineHeight: 1.1, color: "var(--kf-primary)", fontWeight: 800, fontSize: 15 }}>サッカー<br/>セレクション</span>
        </Link>
        <nav className="kf-nav-pc" style={{ display: "flex", gap: 20, marginLeft: 8 }}>
          {NAV.map((n) => (<Link key={n.href} href={n.href} style={{ color: "var(--kf-text)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>{n.label}</Link>))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/mypage" className="kf-btn kf-btn--ghost kf-nav-pc" style={{ padding: "8px 14px", fontSize: 13 }}>ログイン</Link>
          <Link href="/member" className="kf-btn kf-btn--primary" style={{ padding: "8px 14px", fontSize: 13 }}>会員登録</Link>
          <button aria-label="メニュー" onClick={() => setOpen(v=>!v)} className="kf-nav-mobile" style={{ display: "none", background: "none", border: "none", padding: 6, cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--kf-text)" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </div>
      {open && (<nav className="kf-nav-mobile" style={{ borderTop: "1px solid var(--kf-border)", padding: "8px 16px 14px", display: "grid", gap: 4 }}>
        {NAV.map((n) => (<Link key={n.href} href={n.href} onClick={()=>setOpen(false)} style={{ color: "var(--kf-text)", textDecoration: "none", fontSize: 15, fontWeight: 600, padding: "10px 4px" }}>{n.label}</Link>))}
      </nav>)}
      <style>{`@media (max-width:860px){.kf-nav-pc{display:none !important}.kf-nav-mobile{display:flex !important}}@media (min-width:861px){.kf-nav-mobile{display:none !important}}`}</style>
    </header>
  );
}
