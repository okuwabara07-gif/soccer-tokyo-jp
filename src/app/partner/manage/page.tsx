import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { pageMeta } from "@/lib/seo";
import ManageClient from "./ManageClient";

export const metadata = { ...pageMeta("/partner/manage", "チーム管理ページ | サッカーセレクション", "掲載チームの管理ページ", { noindex: true }), referrer: "no-referrer" as const };

export default async function Page(props: { searchParams: Promise<{ t?: string; paid?: string }> }) {
  const sp = await props.searchParams;
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 720 }}>
        {sp.t ? <ManageClient token={sp.t} paid={sp.paid === "1"} /> : <p style={{ fontSize: 14 }}>届いた管理リンクから開いてください。</p>}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
