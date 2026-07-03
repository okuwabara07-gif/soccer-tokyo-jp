import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import TeamInteractive from "./TeamInteractive";

export const revalidate = 86400;

type Team = {
  id: string; name: string; category: string; area: string; prefecture: string;
  block?: string; website?: string; instagram?: string; twitter?: string; facebook?: string;
  description?: string; name_kana?: string; access?: string; practice_days?: string;
  coach_info?: string; is_jleague?: boolean; selection_start?: string; selection_end?: string;
  apply_url?: string; fee?: number; is_free?: boolean; members?: number; founded?: number;
  lat?: number; lng?: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getTeam(id: string): Promise<Team | null> {
  const { data } = await supabase
    .from("teams").select("*").eq("id", id).eq("is_published", true).single();
  return (data as Team) ?? null;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("teams").select("id")
    .eq("is_published", true)
    .order("is_premium", { ascending: false })
    .order("is_jleague", { ascending: false })
    .limit(800);
  return (data || []).map((t) => ({ id: t.id as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const team = await getTeam(id);
  if (!team) return { title: "チームが見つかりません" };
  const location = [team.prefecture, team.area].filter(Boolean).join("");
  const desc = team.description && team.description.trim()
    ? team.description.slice(0, 120)
    : `${location}のジュニアサッカーチーム。練習日程やアクセスなどの詳細をご覧いただけます。`;
  const canonical = `https://soccer-selection.jp/teams/${team.id}`;
  const title = `${team.name}｜${location}のジュニアサッカーチーム`;
  return {
    title, description: desc,
    alternates: { canonical },
    openGraph: { title, description: desc, url: canonical, type: "website" },
  };
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(id);
  if (!team) notFound();

  const location = [team.prefecture, team.area].filter(Boolean).join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: team.name,
    sport: "Soccer",
    address: {
      "@type": "PostalAddress",
      addressRegion: team.prefecture,
      addressLocality: team.area,
      addressCountry: "JP",
    },
    ...(team.website && { url: team.website }),
    ...(team.lat && team.lng && {
      geo: { "@type": "GeoCoordinates", latitude: team.lat, longitude: team.lng },
    }),
    ...(team.description && { description: team.description }),
  };

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px" }}>
        <Link href="/teams" style={{ fontSize: 13, color: "var(--kf-primary)", textDecoration: "none" }}>← チーム一覧</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 4px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{team.name}</h1>
          {team.is_jleague && (
            <span className="kf-badge" style={{ background: "var(--kf-accent)", color: "#3a2e0a" }}>Jリーグ系</span>
          )}
        </div>
        {team.name_kana && (
          <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>{team.name_kana}</div>
        )}
        <p style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 6 }}>{location}</p>
        <TeamInteractive team={team} />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
