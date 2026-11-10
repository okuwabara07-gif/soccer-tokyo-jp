import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { pageMeta } from "@/lib/seo";
import RegisterForm from "./RegisterForm";

export const metadata = {
  ...pageMeta(
    "/partner/register",
    "チーム掲載の登録 | サッカーセレクション",
    "クラブの責任者の方が、チーム紹介・写真・練習情報を登録できます。掲載は無料です。",
    { noindex: true }
  ),
  referrer: "no-referrer" as const,
};

export default async function Page(props: { searchParams: Promise<{ t?: string; lu?: string }> }) {
  const sp = await props.searchParams;
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 720 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>チーム掲載の登録</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 8px", lineHeight: 1.8 }}>
          クラブの責任者の方が入力してください（3分ほど）。運営が内容を確認してから掲載します。掲載は無料です。
        </p>
        <RegisterForm invite={sp.t || ""} lu={sp.lu || ""} />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
