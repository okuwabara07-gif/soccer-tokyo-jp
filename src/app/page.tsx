// 配置先: src/app/page.tsx
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import StatBar from "@/components/StatBar";
import SectionHeader from "@/components/SectionHeader";
import SiteFooter from "@/components/SiteFooter";

const HERO_IMG = "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1000&q=80";

const CONTENTS = [
  { label: "チームを探す", href: "/teams", icon: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3" },
  { label: "セレクション情報", href: "/selection", icon: "M8 2v4M16 2v4M3 9h18M5 5h14v15H5z" },
  { label: "口コミランキング", href: "/reviews", icon: "M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.7L12 17l-6.2 3.8 1.6-6.7L2.2 9.5l6.9-.6z" },
  { label: "準備物・グッズ", href: "/goods", icon: "M6 2l1.5 4h9L18 2M3 6h18l-1.6 13.4A2 2 0 0117.4 21H6.6a2 2 0 01-2-1.6z" },
  { label: "スパイク診断", href: "/shoes", icon: "M2 17h13l5-3 .5-2-9-3-2-3H4z" },
  { label: "ゴールパフォーマンス図鑑", href: "/performance", icon: "M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.7L12 17l-6.2 3.8 1.6-6.7L2.2 9.5l6.9-.6z" },
  { label: "栄養・補食ガイド", href: "/nutrition", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20" },
  { label: "体格診断", href: "/body-check", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0" },
  { label: "AI足型診断", href: "/foot-check", icon: "M2 17h13l5-3 .5-2-9-3-2-3H4z" },
  { label: "ポジション別資料", href: "/position", icon: "M4 4h16v16H4zM4 9h16M9 9v11" },
  { label: "新ルール・用語", href: "/rules", icon: "M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z" },
  { label: "サッカー漫画", href: "/manga", icon: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" },
  { label: "チームマッチング", href: "/matching", icon: "M16 11a4 4 0 10-8 0M2 21a7 7 0 0120 0" },
];

const AREAS = [
  { label: "東京エリア", href: "/teams?area=tokyo" },
  { label: "神奈川エリア", href: "/teams?area=kanagawa" },
  { label: "埼玉エリア", href: "/teams?area=saitama" },
  { label: "千葉エリア", href: "/teams?area=chiba" },
];

const GOODS = [
  { label: "入団準備ガイド", href: "/goods" },
  { label: "遠征準備ガイド", href: "/goods" },
  { label: "夏の暑さ対策ガイド", href: "/goods" },
  { label: "冬の寒さ対策ガイド", href: "/goods" },
  { label: "GK専用ガイド", href: "/goods" },
  { label: "ジュニアユース準備", href: "/goods" },
];

const SELECTIONS: { id: string; team: string; category: string; date: string; target: string; deadline: string }[] = [];

export default function HomePage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />

      <section style={{ background: "var(--kf-surface)", borderBottom: "1px solid var(--kf-border)" }}>
        <div className="kf-container kf-hero" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 32, alignItems: "center", padding: "48px 16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.2, fontWeight: 800 }}>
              子どもに合う<br />サッカーチームを探そう
            </h1>
            <p style={{ margin: "16px 0 8px", fontSize: 18, fontWeight: 700, color: "var(--kf-primary)" }}>
              関東 6,000チーム掲載
            </p>
            <p style={{ margin: 0, color: "var(--kf-muted)", fontSize: 14, lineHeight: 1.7 }}>
              東京・神奈川・埼玉・千葉のジュニアサッカー・ジュニアユース・スクールまで完全網羅
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <Link href="/teams" className="kf-btn kf-btn--primary" style={{ padding: "14px 24px" }}>チームを探す</Link>
              <Link href="/teams#area" className="kf-btn kf-btn--ghost" style={{ padding: "14px 24px" }}>エリアから探す</Link>
            </div>
          </div>
          <div style={{ borderRadius: "var(--kf-radius-lg)", overflow: "hidden", aspectRatio: "4/3", background: "var(--kf-primary-soft)" }}>
            <img src={HERO_IMG} alt="サッカーボールを持つ子ども" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <section className="kf-container" style={{ padding: "24px 16px 0" }}>
        <StatBar />
      </section>

      <section className="kf-container" style={{ padding: "40px 16px 0" }}>
        <SectionHeader title="今月のセレクション情報" moreHref="/selection" />
        {SELECTIONS.length === 0 ? (
          <div className="kf-empty">
            <div className="kf-empty__title">セレクション情報は準備中です</div>
            <div className="kf-empty__hint">各チームの募集・締切・会場が確定次第ここに掲載します。</div>
            <Link href="/selection" className="kf-btn kf-btn--ghost" style={{ marginTop: 8, padding: "10px 18px", fontSize: 13 }}>セレクション情報を見る</Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
            {SELECTIONS.map((s) => (
              <div key={s.id} className="kf-card" style={{ minWidth: 200, padding: 16 }}>
                <div style={{ fontWeight: 700 }}>{s.team}</div>
                <span className="kf-badge" style={{ marginTop: 6 }}>{s.category}</span>
                <div style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 8 }}>{s.date}／{s.target}</div>
                <span className="kf-badge kf-badge--deadline" style={{ marginTop: 8 }}>{s.deadline}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="kf-container" style={{ padding: "40px 16px 0" }}>
        <SectionHeader title="人気コンテンツ" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
          {CONTENTS.map((c) => (
            <Link key={c.label} href={c.href} className="kf-card" style={{ textDecoration: "none", color: "var(--kf-text)", padding: 18, display: "grid", gap: 10, justifyItems: "center", textAlign: "center" }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: "var(--kf-primary-soft)", display: "grid", placeItems: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--kf-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon} /></svg>
              </span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="area" className="kf-container" style={{ padding: "40px 16px 0" }}>
        <SectionHeader title="エリアから人気チームを探す" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {AREAS.map((a) => (
            <Link key={a.label} href={a.href} className="kf-card" style={{ textDecoration: "none", color: "var(--kf-text)", padding: "22px 18px", fontWeight: 800, fontSize: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {a.label}<span style={{ color: "var(--kf-primary)" }}>›</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="kf-container" style={{ padding: "40px 16px 0" }}>
        <SectionHeader title="保護者口コミランキング" subtitle="送迎負担・雰囲気・育成・費用感などで比較" moreHref="/reviews" />
        <div className="kf-empty">
          <div className="kf-empty__title">口コミ募集中</div>
          <div className="kf-empty__hint">保護者の口コミが集まり次第ランキングを公開します（個人の感想です）。</div>
          <Link href="/reviews" className="kf-btn kf-btn--ghost" style={{ marginTop: 8, padding: "10px 18px", fontSize: 13 }}>口コミを見る・投稿する</Link>
        </div>
      </section>

      <section className="kf-container" style={{ padding: "40px 16px 0" }}>
        <SectionHeader title="準備物・グッズガイド" subtitle="入団・遠征・季節対策の必需品を解説" moreHref="/goods" />
        <div style={{ marginBottom: 10 }}><span className="kf-pr-label">PR</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
          {GOODS.map((g) => (
            <Link key={g.label} href={g.href} className="kf-card" style={{ textDecoration: "none", color: "var(--kf-text)", padding: 18, fontWeight: 700, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {g.label}<span style={{ color: "var(--kf-primary)" }}>›</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="kf-container" style={{ padding: "40px 16px 56px" }}>
        <div className="kf-card" style={{ padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", background: "var(--kf-primary-soft)", border: "none" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>プレミアム会員</h2>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--kf-muted)" }}>地図検索・お気に入り無制限・締切通知・PDF保存・AI診断</p>
          </div>
          <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "14px 28px", fontSize: 15 }}>月額 ¥500 ではじめる</Link>
        </div>
      </section>

      <SiteFooter />
      <BottomNav />

      <style>{`
        @media (max-width: 760px){
          .kf-hero{ grid-template-columns: 1fr !important; }
          .kf-hero h1{ font-size: 30px !important; }
        }
      `}</style>
    </div>
  );
}
