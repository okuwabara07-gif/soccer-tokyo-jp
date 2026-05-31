// 配置先: src/app/performance/page.tsx （新規）
// 子どもの顔出しを避けるため、初期はテキスト＋イラスト風サムネのみ。
// 画像/動画の実写投稿は承認フロー実装まで不可（児童保護）。
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Perf = { id: string; name: string; difficulty: number; emoji: string };
// 著名選手の実名・実写は使わず、動作名の一般名称＋抽象アイコンで掲載
const PERFS: Perf[] = [
  { id: "knee-slide", name: "ニースライド", difficulty: 2, emoji: "🛝" },
  { id: "double-step", name: "ダブルステップ", difficulty: 3, emoji: "👟" },
  { id: "team-circle", name: "チーム円陣", difficulty: 1, emoji: "🟢" },
  { id: "pose", name: "ゴールポーズ", difficulty: 1, emoji: "🙌" },
];

function stars(n: number) { return "★".repeat(n) + "☆".repeat(5 - n); }

export default function PerformancePage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "28px 16px 56px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>ゴールパフォーマンス図鑑</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 20px" }}>
          みんなのゴールパフォーマンスを名前・難易度・やり方で紹介します。
        </p>

        {/* 検索 */}
        <div className="kf-card" style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--kf-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
          <input placeholder="パフォーマンス名で検索" style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
          {PERFS.map((p) => (
            <div key={p.id} className="kf-card" style={{ padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 40, lineHeight: 1 }}>{p.emoji}</div>
              <div style={{ fontWeight: 700, marginTop: 10 }}>{p.name}</div>
              <div style={{ color: "var(--kf-accent-dark)", fontSize: 13, marginTop: 4 }}>難易度 {stars(p.difficulty)}</div>
            </div>
          ))}
        </div>

        {/* 投稿導線（実写不可の明記） */}
        <div className="kf-card" style={{ padding: 20, marginTop: 24, textAlign: "center" }}>
          <div style={{ fontWeight: 800 }}>パフォーマンスを投稿する</div>
          <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "8px 0 12px" }}>
            初期はパフォーマンス名・難易度・やり方の<strong>テキスト投稿</strong>のみ受け付けます。<br />
            お子さまの安全のため、顔が写る写真・動画の投稿は受け付けていません。
          </p>
          <button className="kf-btn kf-btn--primary" style={{ padding: "12px 22px", fontSize: 14 }}>テキストで投稿する</button>
        </div>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
