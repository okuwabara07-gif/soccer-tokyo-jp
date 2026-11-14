import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// サッカー人生ゲーム（/life・/life/play・/life/ikusei・/life/world）の「ページを開いた」「遊び始め」「最後まで遊んだ」を数えるためのAPI。
// 個人を特定する情報は受け取らない（モード・男女・国・結果・流入元だけ）。書き込みは service role で行い、テーブルは RLS で外から読めない。
const MODES = new Set(["lp", "play", "ikusei", "world"]);
const EVENTS = new Set(["view", "start", "end"]);
const cut = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : null);

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { console.error("[life/log] Supabase の環境変数が無いため記録できません"); return new NextResponse(null, { status: 503 }); }
  let b: Record<string, unknown>;
  try { const t = await req.text(); if (t.length > 2000) return new NextResponse(null, { status: 413 }); b = JSON.parse(t); } catch { return new NextResponse(null, { status: 400 }); }
  const e = cut(b.e, 10), m = cut(b.m, 10);
  if (!e || !m || !EVENTS.has(e) || !MODES.has(m)) return new NextResponse(null, { status: 400 });
  let refHost: string | null = null;
  try { const r = cut(b.ref, 200); if (r) refHost = new URL(r).hostname.slice(0, 80); } catch { refHost = null; }
  const row = { event: e, mode: m, girl: b.g === true, country: cut(b.c, 40), result: cut(b.r, 80), utm_source: cut(b.utm, 40), ref_host: refHost };
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("life_plays").insert(row);
  if (error) { console.error("[life/log] 記録に失敗:", error.message, { event: e, mode: m }); return new NextResponse(null, { status: 500 }); }
  return new NextResponse(null, { status: 204 });
}
