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
    .from("teams")
    .select("id,name,category,prefecture,area,selection_start,selection_end,apply_url,is_jleague")
    .not("selection_start", "is", null)
    .order("selection_start");
  if (pref !== "すべて") q = q.eq("prefecture", pref);
  if (jleague) q = q.eq("is_jleague", true);

  const { data } = await q;
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
