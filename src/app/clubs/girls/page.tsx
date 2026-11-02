import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import ClubsClient from "@/components/ClubsClient";

// 女子チーム（中学生年代）の一覧。clubs.team_gender = 'girls' の掲載中クラブだけを出す。
export const revalidate = 3600;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = {
  title: "女子ジュニアユースを探す｜関東・関西の中学生女子サッカーチーム",
  description:
    "関東・関西で活動する中学生年代の女子サッカーチーム（女子ジュニアユース・U-15）を都府県別に掲載。練習日・練習場所・月謝・所属リーグを各チームの公式サイトの掲載内容から整理しています。",
  alternates: { canonical: "https://soccer-selection.jp/clubs/girls" },
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

export default async function GirlsClubsPage() {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("is_published", true)
    .eq("team_gender", "girls")
    .order("prefecture")
    .order("name")
    .limit(500);
  if (error) console.error("[GirlsClubsPage] Supabase error:", error);
  const clubs = (data as Club[]) ?? [];

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "20px 16px 56px", maxWidth: 1180 }}>
        <Link href="/clubs" style={{ fontSize: 13, color: "var(--kf-primary)", textDecoration: "none" }}>← クラブ一覧（男子）</Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "10px 0 2px" }}>女子ジュニアユースを探す</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 14px" }}>
          関東・関西の中学生年代の女子サッカーチーム {clubs.length}チーム。載っていないチームは
          <Link href="/clubs/apply" style={{ color: "var(--kf-primary)", fontWeight: 700 }}>掲載を申請</Link>できます（無料）。
        </p>

        <section className="kf-card" style={{ padding: "14px 16px", margin: "0 0 16px", fontSize: 14, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 6px" }}>中学生女子がサッカーを続ける場所</h2>
          <p style={{ margin: "0 0 6px" }}>
            中学年代の女子の選択肢は、大きく「WEリーグ・なでしこリーグのクラブの下部組織（U-15）」「街クラブの女子チーム」「中学校の部活で男子にまじる」の3つです。女子チームは各都府県に数チームずつのことが多く、通える範囲が限られるため、早めに練習場所と曜日を確かめておくと安心です。
          </p>
          <p style={{ margin: 0 }}>
            このページの情報は各チームの公式サイトの掲載内容から整理しています。募集時期・費用・練習場所は変わることがあるので、申し込み前に必ず公式サイトで最新情報を確認してください。
          </p>
        </section>

        <ClubsClient clubs={clubs} />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
