import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import ClubsClient from "@/components/ClubsClient";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = {
  title: "クラブを探す | 関東・関西のジュニアサッカークラブ検索",
  description: "関東8都県・関西6府県のジュニアサッカークラブ・ジュニアユース・スクールを掲載。あなたのお子さんにぴったりなクラブが見つかる。レベル・地域・月謝で絞り込み検索が可能です。",
  alternates: { canonical: "https://soccer-selection.jp/clubs" },
};

type Club = {
  id: string;
  slug: string;
  name: string;
  name_kana?: string;
  club_type: string;
  city?: string;
  prefecture: string;
  nearest_station?: string;
  monthly_fee?: number;
  practice_days?: string;
  strength_label?: string;
  official_url?: string;
  instagram?: string;
};

export default async function ClubsPage() {
  const { data: clubs, error, count } = await supabase
    .from("clubs")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("name");

  if (error) {
    console.error("[ClubsPage] Supabase error:", error);
  }

  const allClubs = (clubs as Club[]) ?? [];
  console.log(`[ClubsPage] Loaded ${allClubs.length} clubs (exact count from DB: ${count}, data length: ${clubs?.length || 0})`);

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "20px 16px 56px", maxWidth: 1180 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 2px" }}>クラブを探す</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 14px" }}>関東8都県・関西6府県 {allClubs.length}クラブから検索</p>
        <ClubsClient clubs={allClubs} />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
