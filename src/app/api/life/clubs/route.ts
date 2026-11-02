import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { todayJst } from "@/lib/club-quality";
// クラブページは未公開だが、各都県のU-15リーグ編成に載っている実在クラブ（名前・所属リーグ・市区町村の推定のみ）。
// ゲームの「近くのクラブ」にだけ、リンクなしで表示する（2026-11-02 決定）。更新は DB から再生成する。
import LEAGUE_CLUBS from "@/data/life-league-clubs.json";

// サッカー人生シミュレーターの結末画面で「住んでいる市区町村から通えるクラブ」を出すためのAPI。
// 掲載中（is_published）のクラブだけを返す。市区町村は「区・市・町・村」を外した名前で照合する（表記ゆれ対策）。
export const revalidate = 3600;

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const base = (s: string | null | undefined) => (s || "").replace(/\s/g, "").replace(/(市|区|町|村)$/, "");

type ClubRow = { id: string; slug: string; name: string; city: string | null; city_norm: string | null; city_norm_source: string | null; club_type: string | null; strength_rank_pref: number | null };
type SelRow = { club_id: string; title: string | null; event_date: string | null; event_date_end: string | null; apply_deadline: string | null; selection_type: string | null };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pref = (url.searchParams.get("pref") || "").slice(0, 10);
  const city = base(url.searchParams.get("city")).slice(0, 20);
  // 女子版のゲームからは gender=girls が来る。女子チーム（team_gender=girls）だけを返し、リーグ登録のみのクラブ（男子）は出さない
  const girls = url.searchParams.get("gender") === "girls";
  if (!pref) return NextResponse.json({ clubs: [], scope: "none" });

  const { data, error } = await supabase
    .from("clubs")
    .select("id,slug,name,city,city_norm,city_norm_source,club_type,strength_rank_pref")
    .eq("is_published", true)
    .eq("prefecture", pref)
    .eq("team_gender", girls ? "girls" : "boys");
  if (error || !data) return NextResponse.json({ clubs: [], scope: "error" });

  const rows = data as ClubRow[];
  // city_norm（照合用に整えた市区町村）を優先し、無ければ city を整えて照合する。確認済み（city）を推定（estimated）より先に並べる
  // 政令市は「横浜市港北区」と「横浜」のように粒度が違うので、2文字以上なら前方一致でも拾う
  const hit = (n: string) => !!n && (n === city || (n.length >= 2 && city.length >= 2 && (n.startsWith(city) || city.startsWith(n))));
  let picked = city ? rows.filter((c) => hit(c.city_norm || base(c.city))).sort((a, b) => (a.city_norm_source === "city" ? 0 : 1) - (b.city_norm_source === "city" ? 0 : 1)) : [];
  let scope: "city" | "pref" = "city";
  if (picked.length === 0) {
    scope = "pref";
    picked = [...rows].sort((a, b) => (a.strength_rank_pref ?? 999) - (b.strength_rank_pref ?? 999));
  }
  picked = picked.slice(0, 6);

  type LC = { n: string; p: string; c?: string; e?: boolean; l?: string };
  const leagueOnly = city && !girls
    ? (LEAGUE_CLUBS as LC[]).filter((x) => x.p === pref && x.c && hit(x.c)).slice(0, 6)
    : [];

  const today = todayJst();
  const ids = picked.map((c) => c.id);
  const sels: SelRow[] = [];
  if (ids.length) {
    const { data: s } = await supabase
      .from("selections")
      .select("club_id,title,event_date,event_date_end,apply_deadline,selection_type")
      .eq("status", "published")
      .in("club_id", ids);
    for (const r of (s || []) as SelRow[]) {
      const end = r.event_date_end || r.event_date;
      if (!end || end >= today) sels.push(r);
    }
  }

  const clubs = picked.map((c) => {
    const next = sels
      .filter((s) => s.club_id === c.id)
      .sort((a, b) => (a.event_date || "9999").localeCompare(b.event_date || "9999"))[0];
    return {
      slug: c.slug,
      name: c.name,
      city: c.city || (c.city_norm ? c.city_norm : null),
      estimated: c.city_norm_source === "estimated",
      jleague: c.club_type === "j_academy",
      next: next ? { date: next.event_date, deadline: next.apply_deadline, type: next.selection_type } : null,
    };
  });

  const more = leagueOnly.map((x) => ({ name: x.n, city: x.c || null, estimated: !!x.e, league: x.l || null }));

  return NextResponse.json({ clubs, more, scope }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
