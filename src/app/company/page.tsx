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
    "AOKAE合同会社が運営する、関東8都県・関西6府県のジュニアサッカー保護者向け情報プラットフォーム「サッカーセレクション」の運営者情報。",
  alternates: { canonical: "https://soccer-selection.jp/company" },
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
        sub="サッカーセレクションは、関東・関西のジュニアサッカー保護者と子どもたちのために運営される、独立系の情報プラットフォームです。"
      />

      <LegalSectionHead
        num="01"
        label="MISSION"
        title="子どもの未来を、ピッチで描く。"
        fig="01.A"
      />
      <LegalBody>
        関東・関西で活動する小中学生のサッカー選手、その保護者・指導者に向けて、セレクション情報・チーム情報・育成コンテンツを横断的に届けることを目的としています。
      </LegalBody>
      <LegalBody>
        競合の少ない領域に特化し、保護者目線のキュレーション・データベース運営・LINE通知・AI診断を組み合わせることで、ジュニアサッカー界の情報格差を縮めることを使命としています。
      </LegalBody>

      <LegalSectionHead num="02" label="COMPANY" title="会社情報" fig="02.A" />
      <LegalTable>
        <LegalRow label="商号">AOKAE 合同会社</LegalRow>
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
          "セレクション情報 · 日程・会場・申込先を、各クラブ公式の告知へのリンクつきで掲載",
          "クラブ検索 · 関東8都県・関西6府県のクラブを、所属リーグ・練習場所・費用から検索",
          "AI診断ツール · 足型診断 / 体格診断 / スパイク選び / 栄養ガイド",
          "LINE公式アカウント · エリア別新着 / 締切リマインダー / 速報配信",
          "コラム・比較記事 · スパイク / プロテイン / セレクション対策",
        ]}
      />

      <LegalSectionHead
        num="04"
        label="EDITORIAL"
        title="編集方針と情報の出典"
        fig="04.A"
      />
      <LegalBody>
        掲載するクラブは、各都府県サッカー協会・クラブユース連盟が公表しているリーグ編成で実在を確認できたものに限っています。所属リーグは協会・連盟の発表、練習日・練習場所・費用は各クラブの公式サイトをもとに記載し、確認できなかった項目は空欄のままにしています。推定で補った項目は、画面上に「推定」と表示します。
      </LegalBody>
      <LegalBody>
        セレクション・練習会の情報は、各クラブの公式サイトまたは公式SNSの告知を確認したうえで掲載し、情報元へのリンクを付けています。情報元が月までしか示していない募集は、日付ではなく月で表示します。合否の傾向や合格率は扱いません。
      </LegalBody>
      <LegalList
        items={[
          "更新 · 募集情報は公式の告知を定期的に確認して追加・修正しています。受付が終わった募集は「過去の実施例」に移します",
          "順位表 · シーズン中の順位は自サイトで再掲せず、各協会・連盟の公式ページへリンクしています",
          "コラム · 公的機関・競技団体・学会の資料を出典として示し、ケガや体調に関する記事には受診の目安を添えています",
          "広告 · 商品紹介にはアフィリエイトリンクを含みます。掲載クラブの並び順を広告料で変えることはありません",
          "訂正 · 誤りのご指摘やクラブ関係者からの修正依頼は、お問合せフォームで受け付け、確認のうえ反映します",
        ]}
      />

      <LegalSectionHead
        num="05"
        label="CONTACT"
        title="お問合せ"
        fig="05.A"
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

      <LegalRevisedAt date="2026.11.19" />
    </LegalShell>
  );
}
