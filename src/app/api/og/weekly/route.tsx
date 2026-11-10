import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { ogFonts } from "@/lib/og-font";
import { COLORS, md } from "@/lib/og-card";
import { addDays, PER_SLIDE, weeklyItems } from "@/lib/weekly";

// 週1まとめ投稿の画像（1080x1350）。/api/og/weekly?from=YYYY-MM-DD&page=0（0=表紙, 1〜=一覧）
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const from = /^\d{4}-\d{2}-\d{2}$/.test(sp.get("from") || "") ? sp.get("from")! : new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
  const page = Math.max(0, Math.min(10, Number(sp.get("page")) || 0));
  const items = await weeklyItems(from);
  const slides = Math.ceil(items.length / PER_SLIDE);
  const range = `${md(from)} 〜 ${md(addDays(from, 13))}`;

  let body;
  let text = `soccer-selection.jp 関東・関西 これからのセレクション・練習会 ${range} ${items.length}件 スワイプして見る 保存して見返す`;
  if (page === 0 || page > slides) {
    body = (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", padding: "0 80px" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: COLORS.soft }}>関東・関西</div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginTop: 16 }}>これからの</div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>セレクション・練習会</div>
        <div style={{ display: "flex", fontSize: 48, fontWeight: 700, color: COLORS.accent, marginTop: 40 }}>{range}</div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#fff", marginTop: 16 }}>{items.length}件</div>
        <div style={{ display: "flex", fontSize: 34, color: COLORS.soft, marginTop: 80 }}>スワイプして見る → 保存して見返す</div>
      </div>
    );
  } else {
    const list = items.slice((page - 1) * PER_SLIDE, page * PER_SLIDE);
    text += list.map((i) => `${i.club.name}${i.club.prefecture}${i.club.city ?? ""}${i.selection_type}${i.venue ?? ""}${md(i.event_date)}${md(i.event_date_end)}`).join("");
    body = (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "48px 56px", gap: 28 }}>
        {list.map((i) => (
          <div key={i.id} style={{ display: "flex", flexDirection: "column", background: "#fff", borderRadius: 28, padding: "28px 36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, color: COLORS.primary }}>
              <div style={{ display: "flex" }}>{md(i.event_date)}{i.event_date_end && i.event_date_end !== i.event_date ? ` 〜 ${md(i.event_date_end)}` : ""}</div>
              <div style={{ display: "flex" }}>{i.selection_type}</div>
            </div>
            <div style={{ display: "flex", fontSize: i.club.name.length > 14 ? 40 : 48, fontWeight: 900, color: COLORS.text, marginTop: 8 }}>{i.club.name}</div>
            <div style={{ display: "flex", fontSize: 28, color: COLORS.muted, marginTop: 6 }}>{[i.club.prefecture, i.club.city].filter(Boolean).join("・")}{i.venue ? `　会場：${i.venue.slice(0, 22)}` : ""}</div>
          </div>
        ))}
      </div>
    );
  }
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: page === 0 || page > slides ? COLORS.primary : COLORS.bg, fontFamily: "NotoSansJP" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "44px 56px 0", fontSize: 34, fontWeight: 900, color: page === 0 || page > slides ? "#fff" : COLORS.primary }}>
          <div style={{ display: "flex" }}>soccer-selection.jp</div>
          {page > 0 && page <= slides && <div style={{ display: "flex", fontSize: 28, color: COLORS.muted }}>{page} / {slides}</div>}
        </div>
        {body}
      </div>
    ),
    { width: 1080, height: 1350, fonts: await ogFonts(text), headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
