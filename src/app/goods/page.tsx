// 配置先: src/app/goods/page.tsx （新規）
// アフィリエイト収益の柱。記事は順次追加。PR表記は必須。
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

const CATEGORIES = [
  "入団準備", "遠征準備", "夏対策", "冬対策", "雨の日対策",
  "GK専用", "ジュニアユース準備", "補食・栄養", "スパイク", "バッグ", "水筒", "インナー", "レガース",
];

// 記事が増えたらここに { title, href } を足すだけ
const ARTICLES: { title: string; href: string }[] = [];

export default function GoodsPage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "28px 16px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>準備物・グッズガイド</h1>
          <span className="kf-pr-label">PR</span>
        </div>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 20px" }}>
          入団・遠征・季節対策の必需品を、選び方とあわせて解説します。
        </p>

        {/* カテゴリチップ */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {CATEGORIES.map((c) => <span key={c} className="kf-chip" style={{ fontSize: 13 }}>{c}</span>)}
        </div>

        {ARTICLES.length === 0 ? (
          <div className="kf-empty">
            <div className="kf-empty__title">ガイド記事は順次公開します</div>
            <div className="kf-empty__hint">入団準備・遠征・季節対策などから掲載していきます。</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {ARTICLES.map((a) => (
              <Link key={a.href} href={a.href} className="kf-card" style={{ padding: 18, textDecoration: "none", color: "var(--kf-text)", fontWeight: 700 }}>
                {a.title}
              </Link>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 24 }}>
          ※本ページはアフィリエイトプログラムを利用した商品紹介を含みます。価格・在庫は各販売サイトでご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
