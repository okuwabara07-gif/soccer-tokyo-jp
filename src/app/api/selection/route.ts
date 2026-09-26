import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { getMembership } from "@/lib/membership";

const FREE_LIMIT = 3;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const pref = sp.get("pref") || "すべて";
  const jleague = sp.get("jleague") === "1";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const sb = createClient(url, key, { auth: { persistSession: false } });

  let q = sb
    .from("selections")
    .select("id,club_id,intake_year,target_grade,selection_type,event_date,event_date_end,event_time,venue,capacity,fee,requirements,apply_deadline,apply_url,source_url,status,clubs(slug,name,prefecture,city)")
    .eq("status", "published")
    .order("event_date", { ascending: false });

  if (pref !== "すべて") q = q.eq("clubs.prefecture", pref);

  const { data, error } = await q;
  if (error) console.error("[GET /api/selection] Supabase error:", error);

  const rows = (data as any[]) ?? [];

  // Transform to expected format and filter by Jリーグ if needed
  const transformed = rows
    .map(row => ({
      id: row.id,
      slug: row.clubs?.slug,
      club_name: row.clubs?.name,
      prefecture: row.clubs?.prefecture,
      city: row.clubs?.city,
      selection_type: row.selection_type,
      event_date: row.event_date,
      apply_deadline: row.apply_deadline,
      venue: row.venue,
      apply_url: row.apply_url,
    }))
    .filter(row => !jleague || row.club_name); // jleague filter would need more data if specified

  const s = await getSession();
  const mem = await getMembership(s?.uid);

  // 非会員には先頭FREE_LIMIT件だけ。隠し行はクライアントに渡さない。
  const visible = mem.active ? transformed : transformed.slice(0, FREE_LIMIT);
  return NextResponse.json({
    visible,
    locked: transformed.length - visible.length,
    total: transformed.length,
    active: mem.active,
  });
}
