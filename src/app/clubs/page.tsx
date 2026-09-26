import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import ClubsClient from "@/components/ClubsClient";
import Link from "next/link";

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

const PAGE_SIZE = 100;

export default async function ClubsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1", 10);
  const offset = (page - 1) * PAGE_SIZE;

  const { data: clubs, error, count } = await supabase
    .from("clubs")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("name")
    .range(offset, offset + PAGE_SIZE - 1);

  console.log("[ClubsPage] page:", page, "clubs fetched:", clubs?.length, "error:", error);

  if (error) {
    console.error("[ClubsPage] Supabase error:", error);
  }

  const pageClubs = (clubs as Club[]) ?? [];
  const totalClubs = count || 0;
  const totalPages = Math.ceil(totalClubs / PAGE_SIZE);

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "20px 16px 56px", maxWidth: 1180 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 2px" }}>クラブを探す</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 14px" }}>関東8都県・関西6府県 {totalClubs}クラブから検索</p>
        <ClubsClient clubs={pageClubs} />

        {totalPages > 1 && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            {page > 1 && <Link href="/clubs?page=1" style={{ padding: "8px 12px", borderRadius: 6, background: "var(--kf-surface)", textDecoration: "none", color: "var(--kf-primary)" }}>« 最初</Link>}
            {page > 1 && <Link href={`/clubs?page=${page - 1}`} style={{ padding: "8px 12px", borderRadius: 6, background: "var(--kf-surface)", textDecoration: "none", color: "var(--kf-primary)" }}>前へ</Link>}
            <span style={{ padding: "8px 12px", color: "var(--kf-muted)" }}>{page} / {totalPages}</span>
            {page < totalPages && <Link href={`/clubs?page=${page + 1}`} style={{ padding: "8px 12px", borderRadius: 6, background: "var(--kf-surface)", textDecoration: "none", color: "var(--kf-primary)" }}>次へ</Link>}
            {page < totalPages && <Link href={`/clubs?page=${totalPages}`} style={{ padding: "8px 12px", borderRadius: 6, background: "var(--kf-surface)", textDecoration: "none", color: "var(--kf-primary)" }}>最後 »</Link>}
          </div>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
