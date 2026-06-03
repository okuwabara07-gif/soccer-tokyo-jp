import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, error: "not logged in" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "no service key" }, { status: 500 });
  const sb = createClient(url, key, { auth: { persistSession: false } });
  // 既にあれば二重開始しない
  await sb.from("trials").upsert({ line_user_id: s.uid }, { onConflict: "line_user_id", ignoreDuplicates: true });
  return NextResponse.json({ ok: true });
}
