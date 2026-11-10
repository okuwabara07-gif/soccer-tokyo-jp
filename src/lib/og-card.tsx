// 告知画像の共通レイアウト（next/og の JSX。flex のみ使える）
import type { ReactNode } from "react";

export const COLORS = { primary: "#168342", dark: "#0F6A34", soft: "#E7F4EC", accent: "#F5C542", text: "#111827", muted: "#6B7280", bg: "#F7F8F5" };

export type Size = "feed" | "story";
export const SIZES: Record<Size, { width: number; height: number }> = { feed: { width: 1080, height: 1350 }, story: { width: 1080, height: 1920 } };

export function md(d: string | null | undefined) {
  if (!d) return "";
  const w = "日月火水木金土"[new Date(`${d.slice(0, 10)}T00:00:00Z`).getUTCDay()];
  return `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}（${w}）`;
}

export function Frame({ size, children, brand = "site", logoUrl }: { size: Size; children: ReactNode; brand?: "site" | "club"; logoUrl?: string | null }) {
  const story = size === "story";
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: COLORS.bg, fontFamily: "NotoSansJP", color: COLORS.text }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.primary, color: "#fff", padding: story ? "120px 72px 48px" : "48px 64px" }}>
        <div style={{ display: "flex", fontSize: brand === "site" ? 46 : 34, fontWeight: 900, letterSpacing: 1 }}>soccer-selection.jp</div>
        {brand === "club" && logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} width={110} height={110} style={{ borderRadius: 999, background: "#fff", objectFit: "contain" }} alt="" />
        ) : (
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, background: COLORS.accent, color: COLORS.text, padding: "8px 20px", borderRadius: 999 }}>セレクション情報</div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: story ? "64px 72px" : "56px 64px" }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "center", fontSize: 26, color: COLORS.muted, padding: story ? "0 0 140px" : "0 0 40px" }}>
        詳しくは soccer-selection.jp で
      </div>
    </div>
  );
}
