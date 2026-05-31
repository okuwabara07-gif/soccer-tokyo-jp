// 配置先: src/app/teams/[id]/page.tsx （新規）
// Next.js 16: params は Promise。await して取り出す。
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import ReviewScoreCard from "@/components/ReviewScoreCard";

const TABS = ["基本情報", "口コミ", "セレクション", "写真・動画", "ブログ"];

const INFO_ROWS = [
  ["対象学年", "—"], ["月謝", "—"], ["活動日", "—"], ["活動場所", "—"],
  ["送迎可否", "—"], ["保護者負担", "—"], ["体験会", "—"], ["公式リンク", "—"],
];

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px" }}>
        {/* 上部 */}
        <div className="kf-card" style={{ overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: 200, background: "var(--kf-primary-soft)", display: "grid", placeItems: "center" }}>
            <span style={{ color: "var(--kf-muted)", fontSize: 13 }}>メイン画像（準備中）</span>
          </div>
          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--kf-primary-soft)", display: "grid", placeItems: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--kf-primary)" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7l4 3-1.5 5h-5L8 10z" /></svg>
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>チーム情報 準備中</h1>
                <div style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 2 }}>ID: {id}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button className="kf-btn kf-btn--primary" style={{ padding: "10px 18px", fontSize: 14 }}>体験申込</button>
              <button className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px", fontSize: 14 }}>お気に入り</button>
              <button className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px", fontSize: 14 }}>比較する</button>
              <button className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px", fontSize: 14 }}>シェア</button>
            </div>
          </div>
        </div>

        {/* タブ（リンクなしの見出し表示・段階実装） */}
        <div style={{ display: "flex", gap: 18, borderBottom: "1px solid var(--kf-border)", marginBottom: 18, overflowX: "auto" }}>
          {TABS.map((t, i) => (
            <span key={t} style={{ padding: "10px 2px", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", color: i === 0 ? "var(--kf-primary)" : "var(--kf-muted)", borderBottom: i === 0 ? "2px solid var(--kf-primary)" : "2px solid transparent" }}>{t}</span>
          ))}
        </div>

        {/* 基本情報 */}
        <section className="kf-card" style={{ padding: 18, marginBottom: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>基本情報</h2>
          <div style={{ display: "grid", gap: 0 }}>
            {INFO_ROWS.map(([k, v], i) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10, padding: "10px 0", borderTop: i ? "1px solid var(--kf-border)" : "none" }}>
                <span style={{ fontSize: 13, color: "var(--kf-muted)" }}>{k}</span>
                <span style={{ fontSize: 14 }}>{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 口コミ（6軸・募集中） */}
        <section style={{ marginBottom: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>口コミ・評価</h2>
          <ReviewScoreCard count={0} />
          <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 8 }}>※口コミは投稿者個人の感想です。掲載は承認制です。</p>
        </section>

        {/* チーム公式メッセージ枠 */}
        <section className="kf-card" style={{ padding: 18 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800 }}>チームからのメッセージ</h2>
          <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: 0 }}>このチームからの公式メッセージはまだありません。</p>
          <div style={{ marginTop: 14 }}>
            <Link href="/contact" className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px", fontSize: 13 }}>掲載・更新のお問い合わせ</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
