import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Perf = { id: string; name: string; difficulty: number; image: string };
const PERFS: Perf[] = [
  { id: "knee-slide", name: "ニースライド", difficulty: 2, image: "/images/kf/performance/01.jpg" },
  { id: "double-step", name: "ダブルステップ", difficulty: 3, image: "/images/kf/performance/02.jpg" },
  { id: "team-circle", name: "チーム円陣", difficulty: 1, image: "/images/kf/performance/03.jpg" },
  { id: "goal-pose", name: "ゴールポーズ", difficulty: 1, image: "/images/kf/performance/04.jpg" },
  { id: "sky-point", name: "スカイポイント", difficulty: 1, image: "/images/kf/performance/05.jpg" },
  { id: "heart-sign", name: "ハートサイン", difficulty: 1, image: "/images/kf/performance/06.jpg" },
  { id: "point-goal", name: "指さしゴール", difficulty: 1, image: "/images/kf/performance/07.jpg" },
  { id: "kneel-guts", name: "ひざまずきガッツポーズ", difficulty: 2, image: "/images/kf/performance/08.jpg" },
  { id: "clap", name: "手拍子", difficulty: 1, image: "/images/kf/performance/09.jpg" },
  { id: "bow", name: "お辞儀パフォーマンス", difficulty: 1, image: "/images/kf/performance/10.jpg" },
  { id: "banzai-jump", name: "バンザイジャンプ", difficulty: 2, image: "/images/kf/performance/11.jpg" },
  { id: "cool-arms", name: "腕組みクールポーズ", difficulty: 1, image: "/images/kf/performance/12.jpg" },
  { id: "dash-supporter", name: "サポーターへダッシュ", difficulty: 2, image: "/images/kf/performance/13.jpg" },
  { id: "camera-appeal", name: "カメラアピール", difficulty: 1, image: "/images/kf/performance/14.jpg" },
  { id: "balloon-kick", name: "バルーンキック", difficulty: 3, image: "/images/kf/performance/15.jpg" },
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {PERFS.map((p) => (
            <div key={p.id} className="kf-card" style={{ overflow: "hidden", padding: 0 }}>
              <img src={p.image} alt={p.name} loading="lazy" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "10px 12px 14px", textAlign: "center" }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: "var(--kf-accent-dark)", fontSize: 13, marginTop: 4 }}>難易度 {stars(p.difficulty)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="kf-card" style={{ padding: 20, marginTop: 24, textAlign: "center" }}>
          <div style={{ fontWeight: 800 }}>パフォーマンスを投稿する</div>
          <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "8px 0 12px" }}>
            初期はパフォーマンス名・難易度・やり方の<strong>テキスト投稿</strong>のみ受け付けます。<br />
            お子さまの安全のため、顔が写る写真・動画の投稿は受け付けていません。
          </p>
          <button className="kf-btn kf-btn--primary" style={{ padding: "12px 22px", fontSize: 14 }}>テキストで投稿する</button>
        </div>
        <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 16, textAlign: "center" }}>※画像はAIで生成したイメージです。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
