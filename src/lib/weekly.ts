// 週1回のまとめ投稿（運営インスタ）用のデータ。from から14日以内に開催される公開中の募集。
import { createClient } from "@supabase/supabase-js";

export type WeeklyItem = {
  id: string; event_date: string | null; event_date_end: string | null; selection_type: string | null; venue: string | null;
  club: { name: string; slug: string; prefecture: string; city: string | null; instagram: string | null; partner_plan: string };
};

export const PER_SLIDE = 4;

export function addDays(d: string, n: number) {
  return new Date(Date.parse(`${d}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
}

export async function weeklyItems(from: string, limit = 24): Promise<WeeklyItem[]> {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const to = addDays(from, 13);
  const { data } = await sb
    .from("selections")
    .select("id,event_date,event_date_end,selection_type,venue,clubs!inner(name,slug,prefecture,city,instagram,partner_plan,is_published)")
    .eq("status", "published")
    .eq("clubs.is_published", true)
    .gte("event_date", from)
    .lte("event_date", to)
    .order("event_date", { ascending: true })
    .limit(80);
  const rows = (data ?? []).map((r) => ({ ...r, club: (Array.isArray(r.clubs) ? r.clubs[0] : r.clubs) })) as unknown as WeeklyItem[];
  // 並びは日付順のまま（お金で順番は変えない）。枠が足りないときだけ有料プランを優先して残す。PRの表示はキャプション側。
  const paid = rows.filter((r) => r.club.partner_plan === "standard" || r.club.partner_plan === "premium");
  const free = rows.filter((r) => !paid.includes(r));
  return [...paid, ...free].slice(0, limit).sort((a, b) => String(a.event_date).localeCompare(String(b.event_date)));
}
