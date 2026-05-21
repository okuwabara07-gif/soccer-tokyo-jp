/* ============================================================
   app/privacy/page.tsx
   プライバシーポリシー
   ============================================================ */

import type { Metadata } from "next";
import {
  LegalShell,
  LegalPageHeader,
  LegalSectionHead,
  LegalBody,
  LegalList,
  LegalNote,
  LegalCTA,
  LegalRevisedAt,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "プライバシーポリシー | サッカーセレクション",
  description:
    "サッカーセレクション(AOKAE合同会社)が定める、利用者の個人情報の取扱いに関する方針。",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalShell>
      <LegalPageHeader
        kicker="PRIVACY"
        title="プライバシーポリシー"
        sub="サッカーセレクション(以下「当サイト」)は、利用者の個人情報を尊重し、個人情報の保護に関する法律・関連法令を遵守します。"
      />

      <LegalSectionHead
        num="01"
        label="COLLECT"
        title="取得する個人情報"
        fig="01.B"
      />
      <LegalBody>当サイトは、以下の情報を取得することがあります。</LegalBody>
      <LegalList
        items={[
          "会員登録時にご提供いただく情報(氏名・メールアドレス等)",
          "決済時の情報(クレジットカード番号は Stripe が直接処理し、当サイトは保持しません)",
          "LINE連携時に取得するLINEユーザーID・プロフィール情報",
          "アクセスログ・Cookie・閲覧履歴・端末情報",
          "お問合せフォーム経由でご提供いただく情報",
        ]}
      />

      <LegalSectionHead
        num="02"
        label="PURPOSE"
        title="利用目的"
        fig="02.B"
      />
      <LegalList
        items={[
          "本サービスの提供・運営・改善",
          "会員プランの提供・課金処理・解約手続き",
          "LINE経由のセレクション情報・締切通知の配信",
          "お問合せ・サポート対応",
          "統計データ作成・サービス改善・新機能開発",
          "広告配信(Google AdSense等)の最適化",
        ]}
      />

      <LegalSectionHead
        num="03"
        label="THIRD PARTY"
        title="第三者提供"
        fig="03.B"
      />
      <LegalBody>
        当サイトは、以下の場合を除き、取得した個人情報を第三者に提供しません。
      </LegalBody>
      <LegalList
        items={[
          "利用者本人の同意がある場合",
          "法令に基づき開示が必要な場合",
          "業務委託先(決済・配信・分析等)に必要範囲で開示する場合",
          "統計化・匿名化された情報を集計データとして提供する場合",
        ]}
      />

      <LegalSectionHead
        num="04"
        label="COOKIE & ADS"
        title="Cookie・広告配信"
        fig="04.B"
      />
      <LegalBody>
        当サイトは、第三者配信事業者(Google
        AdSense・Google Analytics・Amazon Associates・楽天アフィリエイト等)を利用しています。これらの事業者はCookieを使用して、利用者の興味に基づく広告を表示することがあります。
      </LegalBody>
      <LegalNote tone="navy">
        Cookieの無効化は、お使いのブラウザの設定から可能です。Google広告設定ページ(https://adssettings.google.com/)からも、パーソナライズド広告を無効化できます。
      </LegalNote>

      <LegalSectionHead
        num="05"
        label="LINE"
        title="LINE連携に関する取扱い"
        fig="05.B"
      />
      <LegalBody>
        LINE連携機能を利用される場合、LINEヤフー株式会社が定める利用規約・プライバシーポリシーに従い、LINEユーザーID・表示名・プロフィール画像を取得します。配信停止はLINE公式アカウントのリッチメニュー「通知停止」または当サイトの設定画面からいつでも行えます。
      </LegalBody>

      <LegalSectionHead
        num="06"
        label="SECURITY"
        title="安全管理"
        fig="06.B"
      />
      <LegalBody>
        当サイトは、個人情報の漏洩・滅失・毀損を防止するため、必要かつ適切な安全管理措置を講じます。データはSSL/TLSで暗号化通信され、パスワードは一方向ハッシュで保管されます。
      </LegalBody>

      <LegalSectionHead
        num="07"
        label="RIGHTS"
        title="開示・訂正・削除"
        fig="07.B"
      />
      <LegalBody>
        利用者は、自己の個人情報について、開示・訂正・削除を請求する権利を有します。請求はお問合せフォームまたは contact@soccer-selection.jp 宛にご連絡ください。本人確認の上、合理的な期間内に対応します。
      </LegalBody>

      <LegalSectionHead
        num="08"
        label="REVISION"
        title="本ポリシーの改定"
        fig="08.B"
      />
      <LegalBody>
        本ポリシーの内容は、法令変更・サービス改善等に応じて見直し・改定することがあります。重要な変更がある場合は、当サイト上で告知します。
      </LegalBody>

      <LegalCTA
        primary="お問合せ・開示請求"
        primaryHref="/contact"
        secondary="利用規約を見る"
        secondaryHref="/terms"
      />

      <LegalRevisedAt date="2026.05.21" />
    </LegalShell>
  );
}
