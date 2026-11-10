import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/partner";

// クラブページの閲覧・ボタンのクリックを数える（月1レポート用）。個人を特定する情報は保存しない。
const KINDS = new Set(["view", "official_click", "instagram_click", "line_click", "contact_click", "apply_click"]);
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i;

export async function POST(req: NextRequest) {
  if (BOT.test(req.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
  let b: { club_id?: string; kind?: string };
  try { b = JSON.parse(await req.text()); } catch { return new NextResponse(null, { status: 204 }); }
  if (!b.club_id || !/^[0-9a-f-]{36}$/.test(b.club_id) || !KINDS.has(String(b.kind))) return new NextResponse(null, { status: 204 });
  try {
    await admin().from("club_events").insert({ club_id: b.club_id, kind: b.kind });
  } catch { /* 計測の失敗は無視 */ }
  return new NextResponse(null, { status: 204 });
}
