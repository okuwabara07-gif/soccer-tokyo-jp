import Link from "next/link";

type Sel = { id: string; name: string; category: string; prefecture: string; area: string; selection_start: string; selection_end: string; is_jleague: boolean; };

function fmt(d: string) { if (!d) return ""; const p = d.split("-"); return `${p[1]}/${p[2]}`; }

export default function JleagueRailClient({ selections }: { selections: Sel[] }) {
  const rows = selections || [];
  if (rows.length === 0) return (
    <div className="kf-empty"><div className="kf-empty__title">現在掲載中のJリーグセレクションはありません</div><div className="kf-empty__hint">確定次第ここに掲載します。</div></div>
  );

  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, scrollSnapType: "x mandatory" }}>
      {rows.map(s => (
        <Link key={s.id} href={`/teams/${s.id}`} className="kf-card"
          style={{ minWidth: 240, maxWidth: 240, padding: 16, textDecoration: "none", color: "var(--kf-text)", scrollSnapAlign: "start", flexShrink: 0 }}>
          <span className="kf-badge" style={{ background: "var(--kf-accent)", color: "#3a2e0a" }}>Jリーグ系</span>
          <div style={{ fontWeight: 800, fontSize: 15, marginTop: 8 }}>{s.name}</div>
          <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 6, lineHeight: 1.7 }}>
            {s.category}／{s.prefecture} {s.area}
          </div>
          <div style={{ fontSize: 13, color: "var(--kf-primary)", fontWeight: 700, marginTop: 8 }}>
            締切 〜{fmt(s.selection_end)}
          </div>
        </Link>
      ))}
    </div>
  );
}
