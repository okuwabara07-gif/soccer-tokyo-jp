import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { GOODS_CATEGORIES } from "@/lib/goodsCategories";
import GoodsCatImage from "@/components/GoodsCatImage";

export const metadata = {
  title: "準備物・グッズガイド | サッカーセレクション",
  alternates: { canonical: "https://soccer-selection.jp/goods" },
};

export default function GoodsPage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 1180 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>準備物・グッズガイド</h1>
          <span className="kf-pr-label">PR</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "6px 0 20px" }}>入団・遠征・季節対策の必需品を、選び方とあわせて解説します。</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {GOODS_CATEGORIES.map(c => (
            <Link key={c.no} href={`/goods/c/${encodeURIComponent(c.key)}`} className="kf-card" style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "var(--kf-text)", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 8px" }}>
                <span style={{ background: "var(--kf-primary)", color: "#fff", borderRadius: 6, fontWeight: 800, fontSize: 12, padding: "2px 7px" }}>{c.no}</span>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{c.title}</span>
              </div>
<GoodsCatImage no={c.no} title={c.title} emoji={c.emoji} />
              <div style={{ padding: 14 }}>
                <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "0 0 10px", lineHeight: 1.6 }}>{c.desc}</p>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--kf-primary)", marginBottom: 4 }}>チェックポイント</div>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 4 }}>
                  {c.points.map((p, i) => <li key={i} style={{ fontSize: 12, paddingLeft: 18, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--kf-primary)" }}>✓</span>{p}</li>)}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        <div className="kf-card" style={{ padding: 18, marginTop: 24, background: "var(--kf-primary-soft)", border: "none" }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>💡 準備のポイント</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>自分に合ったアイテムを選び、日々の準備をしっかり行うことが、パフォーマンス向上につながります。季節や環境に合わせて見直し、常にベストな状態でプレーできるようにしましょう。</p>
        </div>

        <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 16 }}>※本ページはアフィリエイトプログラムを利用した商品紹介を含みます。価格・在庫は各販売サイトでご確認ください。※掲載画像はイメージです。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
