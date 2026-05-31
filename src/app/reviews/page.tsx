// 配置先: src/app/reviews/page.tsx （新規）
// 口コミは承認制・個人の感想。星評価ランキングUIは作らない（全社ルール）。
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

const AXES = ["コーチ", "保護者負担", "送迎", "雰囲気", "育成", "費用感"];
type Review = { id: string; team: string; author: string; date: string; body: string };
const REVIEWS: Review[] = []; // 実投稿が貯まるまで空（架空レビューを出さない）

export default function ReviewsPage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "28px 16px 56px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>保護者の口コミ</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 16px" }}>
          チーム選びの参考になる、保護者のリアルな声。次の6つの観点で投稿できます。
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {AXES.map((a) => <span key={a} className="kf-chip" style={{ fontSize: 13 }}>{a}</span>)}
        </div>

        {REVIEWS.length === 0 ? (
          <div className="kf-empty">
            <div className="kf-empty__title">口コミ募集中</div>
            <div className="kf-empty__hint">まだ口コミがありません。あなたのチームの最初の声を投稿できます。</div>
            <button className="kf-btn kf-btn--primary" style={{ marginTop: 10, padding: "12px 22px", fontSize: 14 }}>口コミを投稿する</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {REVIEWS.map((r) => (
              <div key={r.id} className="kf-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--kf-muted)" }}>
                  <span>{r.author}</span><span>{r.date}</span>
                </div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>{r.team}</div>
                <p style={{ fontSize: 14, margin: "8px 0 0", lineHeight: 1.7 }}>{r.body}</p>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 24 }}>
          ※口コミは投稿者個人の感想です。掲載は承認制とし、不適切な内容は通報・削除の対象となります。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
