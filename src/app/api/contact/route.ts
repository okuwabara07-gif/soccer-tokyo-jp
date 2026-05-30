/* ============================================================
   app/api/contact/route.ts
   お問合せ送信エンドポイント

   ・Resend経由で contact@soccer-selection.jp に送信
   ・自動返信メールも送信(送信者のメールアドレスへ)
   ・必要な環境変数:
     - RESEND_API_KEY    (Vercel環境変数で設定済み想定)
     - CONTACT_TO_EMAIL  (既定: contact@soccer-selection.jp)
     - CONTACT_FROM_EMAIL(既定: noreply@soccer-selection.jp · Resend認証済みドメイン)
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contact@soccer-selection.jp";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "noreply@soccer-selection.jp";

const CATEGORY_LABELS: Record<string, string> = {
  general: "サービスについて",
  billing: "料金・解約について",
  partner: "提携・広告掲載のご依頼",
  press: "取材・メディア掲載",
  bug: "不具合・改善要望",
  privacy: "個人情報・開示請求",
  other: "その他",
};

type ContactPayload = {
  category?: string;
  name?: string;
  email?: string;
  subject?: string;
  body?: string;
};

/* シンプルなメールアドレス検証 */
function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/* HTMLエスケープ */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエスト形式が不正です" },
      { status: 400 }
    );
  }

  const { category, name, email, subject, body } = payload;

  /* バリデーション */
  if (!category || !name || !email || !subject || !body) {
    return NextResponse.json(
      { error: "必須項目が入力されていません" },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "メールアドレスの形式が正しくありません" },
      { status: 400 }
    );
  }
  if (body.length > 5000) {
    return NextResponse.json(
      { error: "お問合せ内容が長すぎます(5000文字以内)" },
      { status: 400 }
    );
  }

  /* スパム簡易フィルタ(本番では reCAPTCHA / hCaptcha 連携推奨) */
  if (/<script|javascript:|href=/i.test(body) || /<script|javascript:|href=/i.test(subject)) {
    return NextResponse.json(
      { error: "不正な内容が含まれています" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "サーバー設定エラー。時間を置いて再度お試しください。" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const submittedAt = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  try {
    /* 1. 運営宛て通知メール */
    await resend.emails.send({
      from: `サッカーセレクション <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[お問合せ/${categoryLabel}] ${subject}`,
      html: `
        <div style="font-family: 'Noto Sans JP', sans-serif; max-width: 600px; padding: 24px; color: #0B1F3A;">
          <h1 style="font-family: 'Noto Serif JP', serif; font-size: 20px; border-bottom: 2px solid #c8392b; padding-bottom: 12px; margin-bottom: 16px;">
            サッカーセレクション · お問合せ
          </h1>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7; width: 100px;">受付日時</td><td style="padding: 8px 0;">${esc(submittedAt)}</td></tr>
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7;">種別</td><td style="padding: 8px 0;">${esc(categoryLabel)}</td></tr>
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7;">お名前</td><td style="padding: 8px 0;">${esc(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7;">メール</td><td style="padding: 8px 0;"><a href="mailto:${esc(email)}" style="color: #0B1F3A;">${esc(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7;">件名</td><td style="padding: 8px 0; font-weight: bold;">${esc(subject)}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f4f1ea; border-left: 4px solid #0B1F3A; white-space: pre-wrap; font-size: 13px; line-height: 1.85;">
            ${esc(body)}
          </div>
          <p style="margin-top: 24px; font-size: 11px; color: #0B1F3A; opacity: 0.5;">
            このメールは soccer-selection.jp/contact フォームから自動送信されています。
          </p>
        </div>
      `,
    });

    /* 2. 送信者宛て自動返信メール(同期処理しなくてもOKだが確実性のため待機) */
    await resend.emails.send({
      from: `サッカーセレクション <${FROM_EMAIL}>`,
      to: [email],
      subject: `[サッカーセレクション] お問合せありがとうございます`,
      html: `
        <div style="font-family: 'Noto Sans JP', sans-serif; max-width: 600px; padding: 24px; color: #0B1F3A;">
          <h1 style="font-family: 'Noto Serif JP', serif; font-size: 20px; border-bottom: 2px solid #c8392b; padding-bottom: 12px; margin-bottom: 16px;">
            お問合せありがとうございます
          </h1>
          <p style="font-size: 14px; line-height: 1.85;">
            ${esc(name)} 様
          </p>
          <p style="font-size: 13px; line-height: 1.85;">
            サッカーセレクションへのお問合せありがとうございます。<br>
            以下の内容で承りました。担当者より2〜3営業日以内にご返信いたします。
          </p>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7; width: 100px;">受付日時</td><td style="padding: 8px 0;">${esc(submittedAt)}</td></tr>
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7;">種別</td><td style="padding: 8px 0;">${esc(categoryLabel)}</td></tr>
            <tr><td style="padding: 8px 0; color: #0B1F3A; opacity: 0.7;">件名</td><td style="padding: 8px 0; font-weight: bold;">${esc(subject)}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f4f1ea; border-left: 4px solid #0B1F3A; white-space: pre-wrap; font-size: 13px; line-height: 1.85;">
            ${esc(body)}
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #0B1F3A; opacity: 0.7; line-height: 1.85;">
            このメールに直接ご返信いただいても問題ありません。<br>
            お急ぎの場合はLINE公式アカウント <a href="https://line.me/R/ti/p/@soccer_selection_jp" style="color: #06C755;">@soccer_selection_jp</a> よりご連絡ください。
          </p>
          <hr style="margin-top: 24px; border: none; border-top: 1px solid #0B1F3A; opacity: 0.2;">
          <p style="margin-top: 16px; font-size: 11px; color: #0B1F3A; opacity: 0.5; line-height: 1.7;">
            サッカーセレクション · 運営: AOKAE 合同会社<br>
            https://soccer-selection.jp
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send error:", err);
    return NextResponse.json(
      { error: "送信処理中にエラーが発生しました。時間を置いて再度お試しください。" },
      { status: 500 }
    );
  }
}
