import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ogFonts } from "@/lib/og-font";
import { COLORS } from "@/lib/og-card";

// 「掲載クラブ」バッジ（1080x1080）。チームのプロフィールや投稿に使ってもらう。
export const revalidate = 86400;

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const { data: c } = await sb.from("clubs").select("name,prefecture,city").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!c) return new Response("not found", { status: 404 });
  const year = new Date(Date.now() + 9 * 3600000).getUTCFullYear() + 1;
  const text = `${c.name}${c.prefecture}${c.city ?? ""}soccer-selection.jp 掲載クラブ${year}年度 セレクション情報はこちら`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.primary, fontFamily: "NotoSansJP" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 900, height: 900, borderRadius: 999, background: "#fff", border: `24px solid ${COLORS.accent}` }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 900, color: COLORS.primary }}>soccer-selection.jp</div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 900, color: COLORS.text, marginTop: 18 }}>掲載クラブ</div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: COLORS.muted, marginTop: 10 }}>{year}年度</div>
          <div style={{ display: "flex", maxWidth: 700, textAlign: "center", justifyContent: "center", fontSize: c.name.length > 12 ? 44 : 56, fontWeight: 900, color: COLORS.text, marginTop: 40, lineHeight: 1.25 }}>{c.name}</div>
          <div style={{ display: "flex", fontSize: 30, color: COLORS.muted, marginTop: 14 }}>{[c.prefecture, c.city].filter(Boolean).join("・")}</div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#fff", background: COLORS.primary, borderRadius: 999, padding: "12px 32px", marginTop: 40 }}>セレクション情報はこちら</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080, fonts: await ogFonts(text), headers: { "Cache-Control": "public, max-age=86400" } }
  );
}
