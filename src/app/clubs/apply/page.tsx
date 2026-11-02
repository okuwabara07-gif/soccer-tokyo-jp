import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { pageMeta } from "@/lib/seo";
import ApplyForm from "./ApplyForm";

export const metadata = pageMeta(
  "/clubs/apply",
  "クラブの掲載・情報更新を申請する | サッカーセレクション",
  "関東・関西のジュニアユース・ジュニアのクラブ情報の掲載や、セレクション情報の更新を申請できます。保護者・クラブ関係者どちらからでも申請できます。"
);

export default async function ApplyPage(props: { searchParams: Promise<{ pref?: string }> }) {
  const sp = await props.searchParams;
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 720 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>クラブの掲載・情報更新を申請する</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 18px", lineHeight: 1.8 }}>
          お子さんのチームや、近所のクラブが載っていない場合は教えてください。公式サイトと所属リーグを確認してから掲載します。掲載は無料です。
        </p>
        <ApplyForm initialPref={sp.pref || ""} />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
