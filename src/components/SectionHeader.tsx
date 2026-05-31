import Link from "next/link";

export default function SectionHeader({
  title, subtitle, moreHref, moreLabel = "すべて見る",
}: { title: string; subtitle?: string; moreHref?: string; moreLabel?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: "0 0 16px" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--kf-text)" }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--kf-muted)" }}>{subtitle}</p>}
      </div>
      {moreHref && (
        <Link href={moreHref} style={{ fontSize: 13, fontWeight: 700, color: "var(--kf-primary)", textDecoration: "none", whiteSpace: "nowrap" }}>
          {moreLabel} ›
        </Link>
      )}
    </div>
  );
}
