import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import ClubsClient from "@/components/ClubsClient";

export const revalidate = 3600;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = {
  title: "クラブを探す | 関東・関西 346クラブ掲載",
  description: "関東8都県・関西6府県のジュニアサッカークラブ・ジュニアユース・スクール346クラブを掲載。あなたのお子さんにぴったりなクラブが見つかる。レベル・地域・月謝で絞り込み検索が可能です。",
  alternates: { canonical: "https://soccer-selection.jp/clubs" },
};

type Club = {
  slug: string;
  name: string;
  name_kana?: string;
  club_type: string;
  city?: string;
  prefecture: string;
  description?: string;
  monthly_fee?: number;
  practice_days?: string;
  strength_label?: string;
  official_url?: string;
  instagram?: string;
  is_published?: boolean;
};

export default async function ClubsPage() {
  const { data: clubs } = await supabase
    .from("clubs")
    .select("slug,name,name_kana,club_type,city,prefecture,description,monthly_fee,practice_days,strength_label,official_url,instagram,is_published")
    .eq("is_published", true)
    .order("name");

  const allClubs = (clubs as Club[]) ?? [];
  console.log(`[/clubs] SSR: Fetched ${allClubs.length} clubs; Tokyo: ${allClubs.filter(c => c.prefecture === "東京都").length}`);
  const sampleClub = allClubs[0];
  if (sampleClub) {
    console.log(`[/clubs] Sample club:`, { slug: sampleClub.slug, name: sampleClub.name, prefecture: sampleClub.prefecture, club_type: sampleClub.club_type, strength_label: sampleClub.strength_label });
  }

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "20px 16px 56px", maxWidth: 1180 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 2px" }}>クラブを探す</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 14px" }}>関東8都県・関西6府県 346クラブから検索</p>
        <ClubsClient clubs={allClubs} />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
