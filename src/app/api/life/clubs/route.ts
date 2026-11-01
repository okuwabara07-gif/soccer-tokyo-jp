import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { todayJst } from "@/lib/club-quality";

// サッカー人生シミュレーターの結末画面で「住んでいる市区町村から通えるクラブ」を出すためのAPI。
// 掲載中（is_published）のクラブだけを返す。市区町村は「区・市・町・村」を外した名前で照合する（表記ゆれ対策）。
export const revalidate = 3600;

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const base = (s: string | null | undefined) => (s || "").replace(/\s/g, "").replace(/(市|区|町|村)$/, "");

type ClubRow = { id: string; slug: string; name: string; city: string | null; club_type: string | null; strength_rank_pref: number | null };
type SelRow = { club_id: string; title: string | null; event_date: string | null; event_date_end: string | null; apply_deadline: string | null; selection_type: string | null };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pref = (url.searchParams.get("pref") || "").slice(0, 10);
  const city = base(url.searchParams.get("city")).slice(0, 20);
  if (!pref) return NextResponse.json({ clubs: [], scope: "none" });

  const { data, error } = await supabase
    .from("clubs")
    .select("id,slug,name,city,club_type,strength_rank_pref")
    .eq("is_published", true)
    .eq("prefecture", pref);
  if (error || !data) return NextResponse.json({ clubs: [], scope: "error" });

  const rows = data as ClubRow[];
  let picked = city ? rows.filter((c) => base(c.city) === city) : [];
  let scope: "city" | "pref" = "city";
  if (picked.length === 0) {
    scope = "pref";
    picked = [...rows].sort((a, b) => (a.strength_rank_pref ?? 999) - (b.strength_rank_pref ?? 999));
  }
  picked = picked.slice(0, 6);

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
      city: c.city,
      jleague: c.club_type === "j_academy",
      next: next ? { date: next.event_date, deadline: next.apply_deadline, type: next.selection_type } : null,
    };
  });

  return NextResponse.json({ clubs, scope }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
