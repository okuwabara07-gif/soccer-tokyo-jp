const AXES = ["コーチ", "保護者負担", "送迎", "雰囲気", "育成", "費用感"] as const;
type Axis = (typeof AXES)[number];
type Scores = Partial<Record<Axis, number>>;

export default function ReviewScoreCard({
  scores, total, count = 0,
}: { scores?: Scores; total?: number; count?: number }) {
  const hasData = count > 0 && scores;

  if (!hasData) {
    return (
      <div className="kf-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--kf-muted)" strokeWidth="1.6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        <div className="kf-empty__title">口コミ募集中</div>
        <div className="kf-empty__hint">このチームの口コミはまだありません。最初のレビューを投稿できます。</div>
      </div>
    );
  }

  return (
    <div className="kf-card" style={{ padding: 18 }}>
      {typeof total === "number" && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: "var(--kf-text)" }}>{total.toFixed(1)}</span>
          <span style={{ color: "var(--kf-muted)", fontSize: 13 }}>/ 5.0（{count}件）</span>
        </div>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {AXES.map((ax) => {
          const v = scores?.[ax];
          const pct = typeof v === "number" ? (v / 5) * 100 : 0;
          return (
            <div key={ax} style={{ display: "grid", gridTemplateColumns: "84px 1fr 32px", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "var(--kf-muted)" }}>{ax}</span>
              <span style={{ height: 8, borderRadius: 999, background: "var(--kf-border)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${pct}%`, background: "var(--kf-primary)" }} />
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, textAlign: "right", color: "var(--kf-text)" }}>
                {typeof v === "number" ? v.toFixed(1) : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
