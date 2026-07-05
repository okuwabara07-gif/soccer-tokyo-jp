/* ============================================================
   app/terms/page.tsx
   利用規約
   ============================================================ */

import type { Metadata } from "next";
import {
  LegalShell,
  LegalPageHeader,
  LegalSectionHead,
  LegalBody,
  LegalList,
  LegalCTA,
  LegalRevisedAt,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "利用規約 | サッカーセレクション",
  description:
    "サッカーセレクション(AOKAE合同会社)が提供する全サービスに適用される利用規約。",
  alternates: { canonical: "https://soccer-selection.jp/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell>
      <LegalPageHeader
        kicker="TERMS"
        title="利用規約"
        sub="サッカーセレクション(以下「当サイト」)が提供するサービス(以下「本サービス」)を利用する全ての方(以下「利用者」)は、本規約に同意したものとみなされます。"
      />

      <LegalSectionHead
        num="01"
        label="SCOPE"
        title="第1条 適用範囲"
        fig="01.C"
      />
      <LegalBody>
        本規約は、当サイトが提供する全てのサービス・コンテンツ・有料プランに適用されます。当サイトと利用者の間の本サービス利用に関する一切の関係に、本規約が適用されます。
      </LegalBody>

      <LegalSectionHead
        num="02"
        label="REGISTRATION"
        title="第2条 利用登録"
        fig="02.C"
      />
      <LegalList
        items={[
          "利用者は、当サイトが定める方法で利用登録を申請するものとします。",
          "当サイトは、申請者に登録の不備・虚偽・過去の規約違反等がある場合、登録を拒否することがあります。",
          "登録した情報に変更があった場合、利用者は速やかに登録情報を更新する必要があります。",
        ]}
      />

      <LegalSectionHead
        num="03"
        label="ACCOUNT"
        title="第3条 アカウント管理"
        fig="03.C"
      />
      <LegalBody>
        利用者は、自己のアカウント情報(ID・パスワード)を厳重に管理する責任を負います。第三者による不正利用が生じた場合、当サイトは責任を負いません。
      </LegalBody>

      <LegalSectionHead
        num="04"
        label="PROHIBITED"
        title="第4条 禁止事項"
        fig="04.C"
      />
      <LegalBody>
        利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。
      </LegalBody>
      <LegalList
        items={[
          "法令または公序良俗に違反する行為",
          "犯罪行為に関連する行為・他者の人権を侵害する行為",
          "当サイトのサーバー・ネットワーク機能を破壊・妨害する行為",
          "本サービスの運営を妨害する行為",
          "他の利用者・第三者になりすます行為",
          "リバースエンジニアリング・スクレイピング・自動取得",
          "当サイトの掲載情報の無断複製・転載・商用利用",
        ]}
      />

      <LegalSectionHead
        num="05"
        label="PAID PLAN"
        title="第5条 有料プラン"
        fig="05.C"
      />
      <LegalBody>
        当サイトは、月額・期間限定の有料プランを提供します。料金・支払方法・解約条件は、料金プランページおよび特定商取引法に基づく表記に従います。
      </LegalBody>
      <LegalList
        items={[
          "月額プランは、解約しない限り自動更新されます。",
          "6ヶ月一括プラン(パパママ応援プラン)は購入後180日間有効です。",
          "無料トライアル期間中の解約は、料金は発生しません。",
          "クーリングオフは、デジタルサービスの性質上、適用されません。",
        ]}
      />

      <LegalSectionHead
        num="06"
        label="IP"
        title="第6条 知的財産権"
        fig="06.C"
      />
      <LegalBody>
        本サービス上の全てのコンテンツ(文章・画像・ロゴ・データベース等)の著作権その他の知的財産権は、当サイトまたは正当な権利者に帰属します。利用者は私的利用の範囲を超えてこれらを使用することはできません。
      </LegalBody>

      <LegalSectionHead
        num="07"
        label="DISCLAIMER"
        title="第7条 免責事項"
        fig="07.C"
      />
      <LegalList
        items={[
          "セレクション情報・チーム情報の正確性は、各団体・チームの公式発表をご確認ください。",
          "当サイトは、掲載情報の完全性・正確性・有用性を保証しません。",
          "本サービス利用により生じた利用者の損害について、当サイトは責任を負いません。",
          "システム障害・メンテナンス等によるサービス中断について、当サイトは責任を負いません。",
        ]}
      />

      <LegalSectionHead
        num="08"
        label="CHANGES"
        title="第8条 規約変更"
        fig="08.C"
      />
      <LegalBody>
        当サイトは、必要と判断した場合、利用者に通知することなく本規約を変更できるものとします。変更後の規約は、当サイト上に掲示した時点から効力を生じます。
      </LegalBody>

      <LegalSectionHead
        num="09"
        label="LAW"
        title="第9条 準拠法・管轄"
        fig="09.C"
      />
      <LegalBody>
        本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合、当サイト本店所在地を管轄する裁判所を専属的合意管轄とします。
      </LegalBody>

      <LegalCTA
        primary="プライバシーポリシーを見る"
        primaryHref="/privacy"
        secondary="お問合せ"
        secondaryHref="/contact"
      />

      <LegalRevisedAt date="2026.05.21" />
    </LegalShell>
  );
}
