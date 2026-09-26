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
    .from("v_upcoming_selections")
    .select("id,slug,club_name,prefecture,city,selection_type,event_date,apply_deadline,venue,apply_url,days_left")
    .order("event_date");
  if (pref !== "すべて") q = q.eq("prefecture", pref);
  if (jleague) q = q.lte("tier", 2);

  const { data, error } = await q;
  if (error) console.error("[GET /api/selection] Supabase error:", error);
  const rows = (data as any[]) ?? [];

  const s = await getSession();
  const mem = await getMembership(s?.uid);

  // 非会員には先頭FREE_LIMIT件だけ。隠し行はクライアントに渡さない。
  const visible = mem.active ? rows : rows.slice(0, FREE_LIMIT);
  return NextResponse.json({
    visible,
    locked: rows.length - visible.length,
    total: rows.length,
    active: mem.active,
  });
}
