import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 3600;

type PageClub = {
  slug: string;
  name: string;
  name_kana?: string;
  prefecture: string;
  city?: string;
  club_type: string;
  official_url?: string;
  instagram?: string;
  monthly_fee?: number;
  practice_days?: string;
  practice_ground?: string;
  description?: string;
  strength_label?: string;
  opponents?: Array<{ slug: string; name: string }>;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getClub(slug: string): Promise<PageClub | null> {
  const { data } = await supabase
    .from("v_page_club")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as PageClub) ?? null;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("clubs")
    .select("slug")
    .eq("is_published", true)
    .order("strength_label", { ascending: false })
    .limit(346);
  return (data || []).map((c) => ({ slug: c.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) return { title: "クラブが見つかりません" };

  const location = [club.prefecture, club.city, club.area].filter(Boolean).join("");
  const desc = club.description && club.description.trim()
    ? club.description.slice(0, 120)
    : `${location}のジュニアサッカークラブ。${club.strength_label || "クラブ情報"}、セレクション、実績など詳細をご覧いただけます。`;
  const canonical = `https://soccer-selection.jp/clubs/${slug}`;
  const title = `${club.name}｜${location}のジュニアサッカークラブ`;

  return {
    title, description: desc,
    alternates: { canonical },
    openGraph: { title, description: desc, url: canonical, type: "website" },
  };
}

export default async function ClubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) notFound();

  const location = [club.prefecture, club.city, club.area].filter(Boolean).join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: club.name,
    sport: "Soccer",
    address: {
      "@type": "PostalAddress",
      addressRegion: club.prefecture,
      addressLocality: club.city || club.area,
      addressCountry: "JP",
    },
    ...(club.official_url && { url: club.official_url }),
    ...(club.description && { description: club.description }),
  };

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <Link href="/clubs" style={{ fontSize: 13, color: "var(--kf-primary)", textDecoration: "none" }}>← クラブ一覧</Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 4px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{club.name}</h1>
        </div>

        {club.name_kana && <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>{club.name_kana}</div>}
        <p style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 6 }}>{location}</p>

        <section style={{ marginTop: 24, borderTop: "1px solid var(--kf-border)", paddingTop: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--kf-primary)" }}>基本情報</h2>
          <div className="kf-card" style={{ padding: 16 }}>
            {club.club_type && <div style={{ marginBottom: 12 }}><strong>種別:</strong> {club.club_type === 'j_academy' ? 'Jリーグアカデミー' : club.club_type === 'school' ? '学校' : 'クラブ'}</div>}
            {club.strength_label && <div style={{ marginBottom: 12 }}><strong>レベル:</strong> {club.strength_label}</div>}
            {club.practice_days && <div style={{ marginBottom: 12 }}><strong>練習頻度:</strong> {club.practice_days}</div>}
            {club.practice_ground && <div style={{ marginBottom: 12 }}><strong>練習地:</strong> {club.practice_ground}</div>}
            {club.monthly_fee !== undefined && (
              <div style={{ marginBottom: 12 }}>
                <strong>月謝:</strong> {club.monthly_fee === 0 ? "無料" : club.monthly_fee ? `${club.monthly_fee.toLocaleString()}円` : "要問合せ"}
              </div>
            )}
          </div>
        </section>

        {club.description && (
          <section style={{ marginTop: 24, borderTop: "1px solid var(--kf-border)", paddingTop: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--kf-primary)" }}>クラブ紹介</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>{club.description}</p>
          </section>
        )}

        <section style={{ marginTop: 24, borderTop: "1px solid var(--kf-border)", paddingTop: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--kf-primary)" }}>公式情報</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {club.official_url && (
              <a href={club.official_url} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--primary" style={{ padding: "10px 16px", fontSize: 13 }}>
                公式サイト
              </a>
            )}
            {club.instagram && (
              <a href={club.instagram} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "10px 16px", fontSize: 13 }}>
                Instagram
              </a>
            )}
          </div>
        </section>

        {club.opponents && club.opponents.length > 0 && (
          <section style={{ marginTop: 24, borderTop: "1px solid var(--kf-border)", paddingTop: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--kf-primary)" }}>同じブロックのクラブ</h2>
            <div style={{ display: "grid", gap: 8 }}>
              {club.opponents.slice(0, 10).map(opp => (
                <Link key={opp.slug} href={`/clubs/${opp.slug}`} style={{ fontSize: 14, color: "var(--kf-primary)", textDecoration: "none" }}>
                  {opp.name} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
