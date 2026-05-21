/* ============================================================
   app/contact/page.tsx
   お問合せ(Server Component)
   フォーム本体は ContactForm.tsx (Client) で実装
   ============================================================ */

import type { Metadata } from "next";
import {
  LegalShell,
  LegalPageHeader,
  LegalSectionHead,
  LegalBody,
  LegalList,
  LegalNote,
  LegalRevisedAt,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
} from "@/components/legal";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問合せ | サッカーセレクション",
  description:
    "サッカーセレクションへのお問合せフォーム。サービス・料金・取材・不具合等のご連絡をお待ちしています。",
};

export default function ContactPage() {
  return (
    <LegalShell>
      <LegalPageHeader
        kicker="CONTACT"
        title="お問合せ"
        sub="ご質問・ご要望・取材依頼など、お気軽にお寄せください。原則として2〜3営業日以内にご返信いたします。"
      />

      <LegalSectionHead
        num="01"
        label="CHANNELS"
        title="連絡手段"
        fig="01.E"
      />
      <LegalBody>
        以下のいずれかの方法でご連絡いただけます。緊急性の高いお問合せには、フォーム送信を推奨します。
      </LegalBody>

      <div className="my-2 grid grid-cols-1 gap-2.5">
        <div className="border border-[#0B1F3A]/20 bg-white px-3.5 py-3">
          <div
            className="mb-1 text-[10px] tracking-[0.08em] text-[#c8392b]"
            style={{ fontFamily: FONT_MONO }}
          >
            FORM
          </div>
          <div
            className="text-[14px] font-bold text-[#0B1F3A]"
            style={{ fontFamily: FONT_SANS }}
          >
            お問合せフォーム(推奨)
          </div>
          <div
            className="mt-1 text-[12px] text-[#0B1F3A]/70"
            style={{ fontFamily: FONT_SANS }}
          >
            下記フォームよりご送信ください。
          </div>
        </div>
        <div className="border border-[#0B1F3A]/20 bg-white px-3.5 py-3">
          <div
            className="mb-1 text-[10px] tracking-[0.08em] text-[#c8392b]"
            style={{ fontFamily: FONT_MONO }}
          >
            EMAIL
          </div>
          <div
            className="text-[14px] font-bold text-[#0B1F3A]"
            style={{ fontFamily: FONT_SANS }}
          >
            contact@soccer-selection.jp
          </div>
          <div
            className="mt-1 text-[12px] text-[#0B1F3A]/70"
            style={{ fontFamily: FONT_SANS }}
          >
            直接メールも受け付けています。
          </div>
        </div>
        <div className="border border-[#06C755] bg-white px-3.5 py-3">
          <div
            className="mb-1 text-[10px] tracking-[0.08em] text-[#06C755]"
            style={{ fontFamily: FONT_MONO }}
          >
            LINE
          </div>
          <div
            className="text-[14px] font-bold text-[#0B1F3A]"
            style={{ fontFamily: FONT_SANS }}
          >
            @soccer_selection_jp
          </div>
          <div
            className="mt-1 text-[12px] text-[#0B1F3A]/70"
            style={{ fontFamily: FONT_SANS }}
          >
            LINE公式アカウントからもご連絡いただけます。
          </div>
        </div>
      </div>

      <LegalSectionHead
        num="02"
        label="FORM"
        title="お問合せフォーム"
        fig="02.E"
      />

      <ContactForm />

      <LegalNote tone="navy">
        個人情報の取扱いについてはプライバシーポリシーをご確認ください。営業・売込み目的のお問合せには返信しない場合があります。
      </LegalNote>

      <LegalSectionHead
        num="03"
        label="FAQ"
        title="よくいただくお問合せ"
        fig="03.E"
      />
      <LegalList
        items={[
          "料金プランの変更 · マイページから随時可能です。",
          "解約手続き · 月額プランは次回更新日前日まで、6ヶ月一括は購入後返金不可です。",
          "掲載情報の修正依頼 · 公式情報源の併記いただければ、3営業日以内に対応します。",
          "LINE通知の停止 · リッチメニュー「通知停止」または設定画面から可能です。",
        ]}
      />

      <LegalRevisedAt date="2026.05.21" />
    </LegalShell>
  );
}
