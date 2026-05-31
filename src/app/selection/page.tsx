// 配置先: src/app/selection/page.tsx （新規）
// 「対策センター」ではなく「情報センター」。合格傾向は断定しない。
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

const FIELDS = ["募集開始", "締切", "開催日", "対象学年", "会場", "募集人数", "参加費", "申込URL"];
type Selection = { id: string; team: string; category: string; date: string; deadline: string };
const SELECTIONS: Selection[] = []; // 実データ確定まで空

export default function SelectionPage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "28px 16px 56px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>セレクション情報センター</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 20px" }}>
          各チームの募集・締切・会場などの事実情報をまとめます。合否の傾向や合格基準は扱いません。
        </p>

        {SELECTIONS.length === 0 ? (
          <div className="kf-empty">
            <div className="kf-empty__title">掲載準備中です</div>
            <div className="kf-empty__hint">チーム公式の募集情報が確定次第、以下の項目で掲載します。</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
              {FIELDS.map((f) => <span key={f} className="kf-chip" style={{ fontSize: 12 }}>{f}</span>)}
            </div>
            <Link href="/calendar" className="kf-btn kf-btn--ghost" style={{ marginTop: 12, padding: "10px 18px", fontSize: 13 }}>カレンダーで見る</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {SELECTIONS.map((s) => (
              <div key={s.id} className="kf-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.team}</div>
                  <div style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 4 }}>{s.category}／{s.date}</div>
                </div>
                <span className="kf-badge kf-badge--deadline">{s.deadline}</span>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 24 }}>
          ※掲載情報は各チーム公式・保護者投稿に基づきます。最新の募集要項は必ず公式でご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
