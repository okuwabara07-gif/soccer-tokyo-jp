import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { admin, lineReply, manageUrl, signLineUser, SITE } from "@/lib/partner";

// 運営のパートナー向け LINE公式アカウントの Webhook。
// ・友だち追加 → 登録フォームのリンクを返す（LINEのユーザーIDを署名付きでフォームに渡し、登録後の通知をLINEで送れるようにする）
// ・「登録」「掲載」→ 同上 / 「募集」「管理」→ 登録済みなら管理ページのリンク
// ・それ以外の文面には自動では返さない（運営が手で返す）
export const dynamic = "force-dynamic";

function verify(body: string, sig: string | null) {
  const secret = process.env.LINE_PARTNER_CHANNEL_SECRET;
  if (!secret || !sig) return false;
  const mac = createHmac("sha256", secret).update(body).digest();
  const given = Buffer.from(sig, "base64");
  return given.length === mac.length && timingSafeEqual(mac, given);
}

type LineEvent = { type: string; replyToken?: string; source?: { userId?: string }; message?: { type: string; text?: string } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  if (!verify(body, req.headers.get("x-line-signature"))) return NextResponse.json({ error: "signature" }, { status: 401 });
  const events: LineEvent[] = JSON.parse(body).events ?? [];
  const sb = admin();

  for (const ev of events) {
    const uid = ev.source?.userId;
    if (!uid || !ev.replyToken) continue;
    const { data: acc } = await sb.from("club_accounts").select("manage_token,status").eq("line_user_id", uid).maybeSingle();
    const registerUrl = `${SITE}/partner/register?lu=${encodeURIComponent(await signLineUser(uid))}`;

    if (ev.type === "follow") {
      const text = acc?.manage_token
        ? `友だち追加ありがとうございます。チームの管理ページはこちらです。\n${manageUrl(acc.manage_token)}`
        : `友だち追加ありがとうございます。soccer-selection.jp への掲載は無料です。\n\n下のリンクから、チーム責任者の方が登録してください（3分ほど）。内容を確認して掲載します。\n${registerUrl}`;
      await lineReply(ev.replyToken, [{ type: "text", text }]);
      continue;
    }
    if (ev.type === "message" && ev.message?.type === "text") {
      const t = ev.message.text ?? "";
      if (/登録|掲載/.test(t) && !acc) {
        await lineReply(ev.replyToken, [{ type: "text", text: `登録フォームはこちらです。\n${registerUrl}` }]);
      } else if (/募集|管理|更新|登録|掲載/.test(t) && acc?.manage_token) {
        await lineReply(ev.replyToken, [{ type: "text", text: `管理ページから、チーム情報の更新とセレクション・練習会の登録ができます。\n${manageUrl(acc.manage_token)}` }]);
      }
    }
  }
  return NextResponse.json({ ok: true });
}
