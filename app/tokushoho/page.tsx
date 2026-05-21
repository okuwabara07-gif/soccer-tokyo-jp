/* ============================================================
   app/tokushoho/page.tsx
   特定商取引法に基づく表記
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
  FONT_SANS,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | サッカーセレクション",
  description:
    "特定商取引に関する法律第11条に基づき、サッカーセレクションの販売事業者・販売価格・支払方法・解約等を表示しています。",
};

export default function TokushohoPage() {
  return (
    <LegalShell>
      <LegalPageHeader
        kicker="LEGAL"
        title="特定商取引法に基づく表記"
        sub="特定商取引に関する法律第11条(通信販売についての広告)に基づき、本サービスに関する以下の事項を表示します。"
      />

      <LegalSectionHead
        num="01"
        label="SELLER"
        title="販売事業者"
        fig="01.D"
      />
      <LegalTable>
        <LegalRow label="販売事業者">AOKAE 合同会社</LegalRow>
        <LegalRow label="代表責任者">{`{代表者氏名を記載}`}</LegalRow>
        <LegalRow label="所在地">{`{本社所在地を記載}`}</LegalRow>
        <LegalRow label="電話番号">
          {`{電話番号を記載}`}
          <div
            className="mt-1 text-[11px] text-[#0B1F3A]/50"
            style={{ fontFamily: FONT_SANS }}
          >
            ※受付時間 平日10:00〜18:00 / 請求があれば遅滞なく開示します
          </div>
        </LegalRow>
        <LegalRow label="メール">contact@soccer-selection.jp</LegalRow>
        <LegalRow label="URL">https://soccer-selection.jp</LegalRow>
      </LegalTable>

      <LegalSectionHead num="02" label="PRICE" title="販売価格" fig="02.D" />
      <LegalTable>
        <LegalRow label="パパママ応援">
          ¥4,500 / 6ヶ月一括
          <div
            className="mt-0.5 text-[11px] text-[#0B1F3A]/50"
            style={{ fontFamily: FONT_SANS }}
          >
            (税込・初回限定 / 自動更新なし)
          </div>
        </LegalRow>
        <LegalRow label="スタンダード">
          ¥500 / 月
          <div
            className="mt-0.5 text-[11px] text-[#0B1F3A]/50"
            style={{ fontFamily: FONT_SANS }}
          >
            (税込・初月14日間無料 / 自動更新)
          </div>
        </LegalRow>
        <LegalRow label="プレミアム">
          ¥1,500 / 月
          <div
            className="mt-0.5 text-[11px] text-[#0B1F3A]/50"
            style={{ fontFamily: FONT_SANS }}
          >
            (税込・初月14日間無料 / 自動更新)
          </div>
        </LegalRow>
      </LegalTable>
      <LegalNote tone="navy">
        各プランの提供内容・差分は料金プランページに記載しています。
      </LegalNote>

      <LegalSectionHead
        num="03"
        label="EXTRA"
        title="販売価格以外の必要料金"
        fig="03.D"
      />
      <LegalBody>
        インターネット接続料金・通信料金は利用者の負担となります。その他、追加で費用が発生することはありません。
      </LegalBody>

      <LegalSectionHead
        num="04"
        label="PAYMENT"
        title="支払方法・時期"
        fig="04.D"
      />
      <LegalList
        items={[
          "支払方法 · クレジットカード(Stripe決済)",
          "対応カード · VISA / Mastercard / JCB / American Express / Diners",
          "月額プラン · 毎月の課金日に自動決済",
          "6ヶ月一括プラン · お申込時に一括決済",
        ]}
      />

      <LegalSectionHead
        num="05"
        label="DELIVERY"
        title="サービス提供時期"
        fig="05.D"
      />
      <LegalBody>
        決済完了後、即時に有料機能をご利用いただけます。物理的な商品の配送は行いません(デジタルコンテンツのため)。
      </LegalBody>

      <LegalSectionHead
        num="06"
        label="CANCEL"
        title="解約・返金"
        fig="06.D"
      />
      <LegalList
        items={[
          "月額プランは、マイページから次回更新日の前日までに解約手続きを行うことで、翌月以降の課金が停止します。",
          "6ヶ月一括プランは、購入後の返金には応じません(購入後180日間ご利用いただけます)。",
          "無料トライアル期間中の解約は、料金は発生しません。",
          "デジタルコンテンツの性質上、購入後の返金は原則として承りません。",
          "システム障害等、当サイトの責に帰すべき事由による解約はこの限りではありません。",
        ]}
      />

      <LegalSectionHead num="07" label="ENV" title="動作環境" fig="07.D" />
      <LegalList
        items={[
          "スマートフォン · iOS Safari 最新版 / Android Chrome 最新版",
          "PC · Chrome / Edge / Safari / Firefox 最新版",
          "LINE連携機能 · LINE 最新版が必要です",
        ]}
      />

      <LegalSectionHead
        num="08"
        label="DEFECTS"
        title="特別条件"
        fig="08.D"
      />
      <LegalBody>
        未成年者の利用は、保護者の同意を得た上で行うものとします。利用者が未成年の場合、保護者が本規約に同意したものとみなします。
      </LegalBody>

      <LegalCTA
        primary="料金プランを見る"
        primaryHref="/plan"
        secondary="お問合せ"
        secondaryHref="/contact"
      />

      <LegalRevisedAt date="2026.05.21" />
    </LegalShell>
  );
}
