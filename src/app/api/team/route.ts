import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { getMembership } from "@/lib/membership";

// 非会員に渡さない有料フィールド
const PREMIUM = ["apply_url", "website", "instagram", "twitter", "facebook", "selection_start", "selection_end"];

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ team: null, has_selection: false, active: false });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const { data } = await sb.from("teams").select("*").eq("id", id).single();
  if (!data) return NextResponse.json({ team: null, has_selection: false, active: false });

  const s = await getSession();
  const mem = await getMembership(s?.uid);

  const has_selection = !!(data as any).selection_start; // 存在の有無だけは非会員にも見せる
  const team: any = { ...data };
  if (!mem.active) {
    for (const f of PREMIUM) team[f] = null; // 有料情報は物理的に渡さない
  }
  return NextResponse.json({ team, has_selection, active: mem.active });
}
