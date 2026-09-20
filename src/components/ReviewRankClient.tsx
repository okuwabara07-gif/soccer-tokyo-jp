import Link from "next/link";

type R = { id: string; team_name: string; nickname: string; axis: string; rating: number; body: string };

function Stars({ value }: { value: number }) {
  return <span style={{ display: "inline-flex", gap: 1 }}>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= value ? "#F5B400" : "#D8D8D2", fontSize: 16 }}>★</span>)}</span>;
}

export default function ReviewRankClient({ reviews }: { reviews: R[] }) {
  const rows = reviews || [];
  if (rows.length === 0) return (
    <div className="kf-empty">
      <div className="kf-empty__title">口コミ募集中</div>
      <div className="kf-empty__hint">保護者の口コミが集まり次第ランキングを公開します（個人の感想です）。</div>
      <Link href="/reviews" className="kf-btn kf-btn--ghost" style={{ marginTop: 8, padding: "10px 18px", fontSize: 13 }}>口コミを見る・投稿する</Link>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map((r, i) => (
        <Link key={r.id} href="/reviews" className="kf-card" style={{ padding: 16, textDecoration: "none", color: "var(--kf-text)", display: "block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: 999, background: ["#C9A84C","#9AA0A6","#B0764A","#ccc","#ccc"][i], color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>{i+1}</span>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{r.team_name}</span>
            </div>
            <span className="kf-badge">{r.axis}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Stars value={r.rating} /><span style={{ fontWeight: 800, color: "#F5B400" }}>{r.rating.toFixed(1)}</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "8px 0 0", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.body}</p>
        </Link>
      ))}
      <Link href="/reviews" className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px", fontSize: 13, justifySelf: "center" }}>すべての口コミを見る・投稿する</Link>
    </div>
  );
}
