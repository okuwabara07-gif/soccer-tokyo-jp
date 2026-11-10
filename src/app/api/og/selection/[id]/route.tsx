import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ogFonts } from "@/lib/og-font";
import { COLORS, Frame, md, SIZES, type Size } from "@/lib/og-card";

// 募集の告知画像。/api/og/selection/<selection_id>?size=feed（1080x1350）| story（1080x1920）
// 無料プランはサイト名を大きく、有料プランはクラブのロゴを主役にする。
export const revalidate = 3600;

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const size: Size = req.nextUrl.searchParams.get("size") === "story" ? "story" : "feed";
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const { data: s } = await sb
    .from("selections")
    .select("id,title,selection_type,intake_year,target_grade,event_date,event_date_end,event_time,venue,apply_deadline,notes,clubs!inner(name,slug,prefecture,city,logo_url,partner_plan)")
    .eq("id", id).eq("status", "published").maybeSingle();
  if (!s) return new Response("not found", { status: 404 });
  const club = (Array.isArray(s.clubs) ? s.clubs[0] : s.clubs) as { name: string; slug: string; prefecture: string; city: string | null; logo_url: string | null; partner_plan: string };
  const paid = club.partner_plan === "standard" || club.partner_plan === "premium";

  const when = s.event_date
    ? s.event_date_end && s.event_date_end !== s.event_date ? `${md(s.event_date)} 〜 ${md(s.event_date_end)}` : md(s.event_date)
    : "随時受付";
  const heading = s.title || [s.intake_year ? `${s.intake_year}年度` : "", s.target_grade, s.selection_type].filter(Boolean).join(" ");
  const rows: [string, string][] = [
    ["日程", when + (s.event_time ? `  ${s.event_time}` : "")],
    ...(s.venue ? [["会場", s.venue] as [string, string]] : []),
    ...(s.target_grade ? [["対象", s.target_grade] as [string, string]] : []),
    ...(s.apply_deadline ? [["締切", md(s.apply_deadline)] as [string, string]] : []),
  ];
  const url = `soccer-selection.jp/clubs/${club.slug}`;
  const text = [club.name, club.prefecture, club.city ?? "", heading, s.selection_type, ...rows.flat(), url, "詳しくは soccer-selection.jp で セレクション情報 募集中"].join("");
  const story = size === "story";

  return new ImageResponse(
    (
      <Frame size={size} brand={paid ? "club" : "site"} logoUrl={club.logo_url}>
        <div style={{ display: "flex", fontSize: 30, color: COLORS.muted, fontWeight: 700 }}>{[club.prefecture, club.city].filter(Boolean).join("・")}</div>
        <div style={{ display: "flex", fontSize: club.name.length > 14 ? 64 : 80, fontWeight: 900, lineHeight: 1.2, marginTop: 8 }}>{club.name}</div>
        <div style={{ display: "flex", alignSelf: "flex-start", marginTop: 28, fontSize: 40, fontWeight: 900, color: "#fff", background: COLORS.primary, padding: "10px 28px", borderRadius: 16 }}>
          {s.selection_type || "セレクション"}
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, marginTop: 24, lineHeight: 1.35 }}>{heading}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: story ? 64 : 40, background: "#fff", borderRadius: 28, padding: "36px 40px", gap: 22 }}>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", fontSize: 38, lineHeight: 1.35 }}>
              <div style={{ display: "flex", width: 120, color: COLORS.primary, fontWeight: 900 }}>{k}</div>
              <div style={{ display: "flex", flex: 1, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "center", fontSize: 30, fontWeight: 700, color: COLORS.dark, background: COLORS.soft, borderRadius: 999, padding: "16px 24px" }}>
          {url}
        </div>
      </Frame>
    ),
    { ...SIZES[size], fonts: await ogFonts(text), headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } }
  );
}
