/* ============================================================
   app/company/page.tsx
   運営者情報
   ============================================================ */

import type { Metadata } from "next";
import {
  LegalShell,
  LegalPageHeader,
  LegalSectionHead,
  LegalBody,
  LegalRow,
  LegalTable,
  LegalList,
  LegalNote,
  LegalCTA,
  LegalRevisedAt,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "運営者情報 | サッカーセレクション",
  description:
    "AOKAE合同会社が運営する、関東4都県のジュニアサッカー保護者向け情報プラットフォーム「サッカーセレクション」の運営者情報。",
  openGraph: {
    title: "運営者情報 | サッカーセレクション",
    description:
      "ジュニアサッカー保護者向けの独立系情報プラットフォーム運営者情報。",
    type: "article",
  },
};

export default function CompanyPage() {
  return (
    <LegalShell>
      <LegalPageHeader
        kicker="ABOUT"
        title="運営者情報"
        sub="サッカーセレクションは、関東圏のジュニアサッカー保護者と子どもたちのために運営される、独立系の情報プラットフォームです。"
      />

      <LegalSectionHead
        num="01"
        label="MISSION"
        title="子どもの未来を、ピッチで描く。"
        fig="01.A"
      />
      <LegalBody>
        関東(東京・神奈川・埼玉・千葉)で活動する小中学生のサッカー選手、その保護者・指導者に向けて、セレクション情報・チーム情報・育成コンテンツを横断的に届けることを目的としています。
      </LegalBody>
      <LegalBody>
        競合の少ない領域に特化し、保護者目線のキュレーション・データベース運営・LINE通知・AI診断を組み合わせることで、ジュニアサッカー界の情報格差を縮めることを使命としています。
      </LegalBody>

      <LegalSectionHead num="02" label="COMPANY" title="会社情報" fig="02.A" />
      <LegalTable>
        <LegalRow label="商号">AOKAE 合同会社</LegalRow>
        <LegalRow label="所在地">{`{本社所在地を記載}`}</LegalRow>
        <LegalRow label="代表者">
          代表社員 {`{代表者氏名を記載}`}
        </LegalRow>
        <LegalRow label="設立">{`{設立年月日を記載}`}</LegalRow>
        <LegalRow label="事業内容">
          ジュニアサッカー情報プラットフォーム運営 / 美容関連SaaS開発・運営 /
          コンテンツメディア運営
        </LegalRow>
        <LegalRow label="ウェブサイト">https://soccer-selection.jp</LegalRow>
        <LegalRow label="メール">contact@soccer-selection.jp</LegalRow>
      </LegalTable>

      <LegalSectionHead
        num="03"
        label="SERVICES"
        title="提供サービス"
        fig="03.A"
      />
      <LegalList
        items={[
          "セレクションカレンダー · 締切URL・チーム詳細・ブロック別順位表",
          "チーム検索 · 関東4都県6,000以上の登録チームをマップで検索",
          "AI診断ツール · 足型診断 / 体格診断 / スパイク選び / 栄養ガイド",
          "LINE公式アカウント · エリア別新着 / 締切リマインダー / 速報配信",
          "コラム・比較記事 · スパイク / プロテイン / セレクション対策",
        ]}
      />

      <LegalSectionHead
        num="04"
        label="CONTACT"
        title="お問合せ"
        fig="04.A"
      />
      <LegalBody>
        取材・広告掲載・提携・記事修正のご依頼は、下記までご連絡ください。返信に2〜3営業日いただく場合があります。
      </LegalBody>
      <LegalNote tone="navy">
        Email · contact@soccer-selection.jp
        <br />
        Form · soccer-selection.jp/contact
        <br />
        LINE · @soccer_selection_jp
      </LegalNote>

      <LegalCTA
        primary="お問合せフォームへ"
        primaryHref="/contact"
        secondary="特定商取引法に基づく表記を見る"
        secondaryHref="/tokushoho"
      />

      <LegalRevisedAt date="2026.05.21" />
    </LegalShell>
  );
}
