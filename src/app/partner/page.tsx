import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/partner",
  "クラブ・チームの方へ（掲載は無料） | サッカーセレクション",
  "関東・関西のジュニアユース・ジュニアのクラブは無料で掲載できます。チーム紹介・写真・セレクション情報を登録すると、告知画像の作成や閲覧レポートもお届けします。"
);

const ROWS: [string, string, string, string][] = [
  ["チーム紹介ページ", "写真3枚まで", "写真20枚まで", "〇"],
  ["セレクション・練習会の掲載", "〇", "〇", "〇"],
  ["LINE・問い合わせボタン", "〇", "〇", "〇"],
  ["掲載バッジ・更新のご案内", "〇", "〇", "〇"],
  ["告知画像の作成", "月1枚（サイト名入り）", "毎回（チームのロゴ入り）", "〇"],
  ["月1回のレポート", "閲覧数", "閲覧数・クリック数", "〇"],
  ["運営インスタのまとめ投稿", "載ることがあります", "優先して載ります", "〇"],
  ["運営インスタでの単独紹介", "－", "－", "年2回"],
  ["特集記事・地域ページのPR枠", "－", "－", "〇（「PR」と表示）"],
];

const th: React.CSSProperties = { padding: "10px 8px", fontSize: 13, textAlign: "left", borderBottom: "1px solid var(--kf-border)" };
const td: React.CSSProperties = { padding: "10px 8px", fontSize: 13, borderBottom: "1px solid var(--kf-border)", verticalAlign: "top" };

export default function PartnerPage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.4 }}>無料で、来年度の新入団生に届く。</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, margin: 0 }}>
          soccer-selection.jp は、関東・関西のセレクション・練習会を地域と学年で探せるサイトです。クラブの責任者の方が登録すると、チーム紹介と募集情報を掲載し、告知画像や閲覧レポートをお届けします。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <Link href="/partner/register" className="kf-btn kf-btn--primary" style={{ padding: "12px 20px" }}>無料で登録する</Link>
          {process.env.NEXT_PUBLIC_PARTNER_LINE_URL && (
            <a href={process.env.NEXT_PUBLIC_PARTNER_LINE_URL} className="kf-btn kf-btn--ghost" style={{ padding: "12px 20px" }}>LINEで登録・相談する</a>
          )}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "36px 0 10px", color: "var(--kf-primary)" }}>登録は3ステップ</h2>
        <ol style={{ fontSize: 15, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
          <li>登録フォームに、チーム紹介・練習日・写真などを入力（3分ほど）</li>
          <li>運営が内容を確認して掲載（通常1〜3日）</li>
          <li>届いた管理ページから、セレクション・練習会を登録。告知画像をお届けします</li>
        </ol>

        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "36px 0 10px", color: "var(--kf-primary)" }}>プラン</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, minWidth: 560 }}>
            <thead>
              <tr><th style={th}></th><th style={th}>無料</th><th style={th}>スタンダード<br />月1,980円／年19,800円</th><th style={th}>プレミアム<br />月4,980円／年49,800円</th></tr>
            </thead>
            <tbody>{ROWS.map((r) => <tr key={r[0]}><td style={{ ...td, fontWeight: 700 }}>{r[0]}</td><td style={td}>{r[1]}</td><td style={td}>{r[2]}</td><td style={td}>{r[3]}</td></tr>)}</tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", lineHeight: 1.8 }}>
          料金は税込です。登録から90日間はスタンダードの内容を無料でお使いいただけます。お試し期間が終わっても、掲載は無料で続きます。検索結果や一覧の並び順は料金で変わりません。
        </p>

        <h2 id="rules" style={{ fontSize: 18, fontWeight: 800, margin: "36px 0 10px", color: "var(--kf-primary)" }}>掲載のきまり</h2>
        <ul style={{ fontSize: 14, lineHeight: 1.9, paddingLeft: 20, margin: 0 }}>
          <li>登録はクラブの責任者（代表・事務局など）の方にお願いしています。運営が公式サイトやInstagramで確認してから掲載します。</li>
          <li>写真は、写っている選手と保護者の同意を得たものだけを登録してください。顔がはっきり分かる個人の写真や、名前・番号が読める写真は避けてください。</li>
          <li>「必ず上達」「No.1」などの断定や、他のクラブと比べる表現は、掲載時に調整または削除することがあります。</li>
          <li>責任者のお名前・連絡先はサイトに表示しません。運営からの連絡にだけ使います。</li>
          <li>掲載の停止・削除は、管理ページまたはお問い合わせからいつでもご依頼いただけます。</li>
          <li>有料プランで目立たせる枠には「PR」と表示します。</li>
        </ul>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
