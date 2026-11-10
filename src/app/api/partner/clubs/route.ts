import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 登録フォームで「すでに掲載されているクラブ」を名前で探す（公開中のクラブのみ）
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 40);
  if (q.length < 2) return NextResponse.json({ clubs: [] });
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const like = `%${q.replace(/[%_\\,()*]/g, "")}%`;
  const { data } = await sb
    .from("clubs")
    .select("id,slug,name,prefecture,city")
    .eq("is_published", true)
    .or(`name.ilike.${like},name_kana.ilike.${like}`)
    .limit(10);
  return NextResponse.json({ clubs: data ?? [] });
}
