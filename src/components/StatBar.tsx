type Stat = { value: string; label: string };

const DEFAULTS: Stat[] = [
  { value: "6,000+", label: "掲載チーム" },
  { value: "4都県", label: "対応エリア" },
  { value: "無料", label: "基本機能" },
  { value: "—", label: "口コミ件数" },
];

export default function StatBar({ stats = DEFAULTS }: { stats?: Stat[] }) {
  return (
    <div className="kf-card" style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, padding: "16px 8px" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ textAlign: "center", borderLeft: i ? "1px solid var(--kf-border)" : "none", padding: "0 8px" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--kf-primary)" }}>{s.value}</div>
          <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
