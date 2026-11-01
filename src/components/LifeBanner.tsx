import Link from "next/link";

/** サッカー人生シミュレーター（/life）への導線。トップとセレクション一覧に置く。 */
export default function LifeBanner({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/life"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) auto",
        alignItems: "center",
        gap: 14,
        padding: compact ? "14px 16px" : "20px 22px",
        borderRadius: 16,
        textDecoration: "none",
        color: "#ffffff",
        backgroundColor: "#14213a",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,.10) 1.2px, transparent 1.6px)",
        backgroundSize: "14px 14px",
      }}
    >
      <span style={{ display: "grid", gap: 4, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#9aa7bc" }}>新しく公開・無料</span>
        <span style={{ fontSize: compact ? 17 : 22, fontWeight: 800, lineHeight: 1.3 }}>
          45,000<span style={{ color: "#8ab8f0" }}>分の、あなた。</span>
        </span>
        <span style={{ fontSize: 13, color: "#c9d4e6", lineHeight: 1.6 }}>
          年長から70歳まで、サッカー人生を5分で生きるシミュレーター
        </span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 16px", borderRadius: 999, background: "#e8590c", fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>
        遊ぶ ›
      </span>
    </Link>
  );
}
