import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

const IMAGES = Array.from({ length: 9 }, (_, i) => `/images/kf/performance/${String(i + 1).padStart(2, "0")}.jpg`);

export default function PerformancePage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "28px 16px 56px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>ゴールパフォーマンス図鑑</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 20px" }}>
          みんなのゴールパフォーマンスを紹介します。
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {IMAGES.map((src) => (
            <div key={src} className="kf-card" style={{ overflow: "hidden", padding: 0 }}>
              <img src={src} alt="ゴールパフォーマンス" loading="lazy" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
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
