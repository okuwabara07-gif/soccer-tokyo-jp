import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { admin, lineReply, manageUrl, signLineUser, SITE } from "@/lib/partner";

// サッカーセレクションのLINE公式アカウント（保護者・チーム共用）の Webhook。
// ・友だち追加 → 保護者向けの案内＋「クラブ・チームの方」ボタン
// ・「チーム」「掲載」→ 登録フォームのリンク（LINEのユーザーIDを署名付きで渡し、登録後の通知をLINEで送れるようにする）
// ・登録済みのチームが「募集」「管理」など → 管理ページのリンク
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
  if (!verify(body, req.headers.get("x-line-signature"))) {
    console.warn("[partner-webhook] signature mismatch", { hasSecret: !!process.env.LINE_PARTNER_CHANNEL_SECRET });
    return NextResponse.json({ error: "signature" }, { status: 401 });
  }
  const events: LineEvent[] = JSON.parse(body).events ?? [];
  console.log("[partner-webhook] events", events.map((e) => `${e.type}:${e.message?.type ?? ""}`).join(","), { hasToken: !!process.env.LINE_PARTNER_CHANNEL_ACCESS_TOKEN });
  const sb = admin();

  for (const ev of events) {
    const uid = ev.source?.userId;
    if (!uid || !ev.replyToken) continue;
    const { data: acc } = await sb.from("club_accounts").select("manage_token,status").eq("line_user_id", uid).maybeSingle();
    const registerUrl = `${SITE}/partner/register?lu=${encodeURIComponent(await signLineUser(uid))}`;

    // 保護者とチームが同じアカウントを使うので、友だち追加では両方向けに案内し、チームの方はボタンで登録へ進む
    const teamButton = { type: "action", action: { type: "message", label: "クラブ・チームの方", text: "チーム掲載の登録" } };
    if (ev.type === "follow") {
      const text = acc?.manage_token
        ? `友だち追加ありがとうございます。チームの管理ページはこちらです。\n${manageUrl(acc.manage_token)}`
        : `友だち追加ありがとうございます。関東・関西のセレクション・練習会は ${SITE}/selection で探せます。\n\nクラブ・チームの方は、下のボタンから無料で掲載の登録ができます。`;
      await lineReply(ev.replyToken, [{ type: "text", text, ...(acc ? {} : { quickReply: { items: [teamButton] } }) }]);
      continue;
    }
    if (ev.type === "message" && ev.message?.type === "text") {
      const t = ev.message.text ?? "";
      if (acc?.manage_token && /募集|管理|更新|掲載|チーム/.test(t)) {
        await lineReply(ev.replyToken, [{ type: "text", text: `管理ページから、チーム情報の更新とセレクション・練習会の登録ができます。\n${manageUrl(acc.manage_token)}` }]);
      } else if (!acc && /チーム|掲載/.test(t)) {
        await lineReply(ev.replyToken, [{ type: "text", text: `チーム責任者の方は、こちらから登録してください（3分ほど）。運営が確認してから掲載します。掲載は無料です。\n${registerUrl}` }]);
      }
      // それ以外（保護者からの質問など）には自動で返さない。運営がチャットで返信する。
    }
  }
  return NextResponse.json({ ok: true });
}
