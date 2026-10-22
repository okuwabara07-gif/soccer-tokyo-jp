import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 3600;

type PageClub = {
  id?: string;
  season?: number | null;
  league?: string | null;
  block?: string | null;
  tier?: string | number | null;
  slug: string;
  selection_count?: number | null;
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
  const { data, error } = await supabase
    .from("v_page_club")
    .select("*")
    .eq("slug", slug)
    .order("season", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[getClub] error:", error);
  return (data as PageClub) ?? null;
}

function isIndexable(club: PageClub): boolean {
  return (club.selection_count ?? 0) > 0 || !!club.official_url || !!club.instagram;
}

type ClubSelection = {
  id: string;
  intake_year: number | null;
  target_grade: string | null;
  selection_type: string | null;
  title: string | null;
  event_date: string | null;
  event_date_end: string | null;
  event_time: string | null;
  venue: string | null;
  apply_deadline: string | null;
  apply_url: string | null;
  requirements: string | null;
  notes: string | null;
  source_url: string | null;
};

async function getSelections(clubId?: string): Promise<ClubSelection[]> {
  if (!clubId) return [];
  const { data, error } = await supabase
    .from("selections")
    .select("id,intake_year,target_grade,selection_type,title,event_date,event_date_end,event_time,venue,apply_deadline,apply_url,requirements,notes,source_url")
    .eq("club_id", clubId)
    .eq("status", "published")
    .order("event_date", { ascending: false, nullsFirst: false })
    .limit(10);
  if (error) console.error("[getSelections] error:", error);
  return (data as ClubSelection[]) ?? [];
}

function fmtDate(d?: string | null): string {
  if (!d) return "";
  const [y, m, day] = d.split("-").map(Number);
  return `${y}年${m}月${day}日`;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("clubs")
    .select("slug")
    .eq("is_published", true)
    .order("strength_label", { ascending: false })
    .limit(1000);
  return (data || []).map((c) => ({ slug: c.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) return { title: "クラブが見つかりません" };

  const location = [club.prefecture, club.city].filter(Boolean).join("");
  const typeName = club.club_type === "j_academy" ? "Jリーグアカデミー" : club.club_type === "school" ? "学校のサッカー部" : "ジュニアサッカークラブ";
  const leagueLabel = [club.league, club.block].filter(Boolean).join(" ");
  const sels = await getSelections(club.id);
  const latest = sels[0];
  const selLabel = latest
    ? (latest.title || [latest.intake_year ? `${latest.intake_year}年度` : "", latest.target_grade, latest.selection_type].filter(Boolean).join(" "))
    : "";
  const desc = club.description && club.description.trim()
    ? club.description.slice(0, 120)
    : [
        `${club.name}（${location}）の${typeName}情報。`,
        leagueLabel ? `${club.season ? `${club.season}年度` : ""}所属リーグ：${leagueLabel}。` : "",
        selLabel ? `${selLabel}の日程・会場・申込先と情報元を掲載。` : "セレクション・練習会の情報と公式サイトへのリンクを掲載。",
      ].join("").slice(0, 150);
  const canonical = `https://soccer-selection.jp/clubs/${slug}`;
  const title = `${club.name}｜${location}のジュニアサッカークラブ`;

  return {
    title, description: desc,
    alternates: { canonical },
    // 独自情報（セレクション or 公式リンク）が無いクラブはインデックスさせない
    robots: isIndexable(club) ? undefined : { index: false, follow: true },
    openGraph: { title, description: desc, url: canonical, type: "website" },
  };
}

export default async function ClubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) notFound();

  const location = [club.prefecture, club.city].filter(Boolean).join("");
  const selections = await getSelections(club.id);
  const today = new Date().toISOString().slice(0, 10);
  const leagueLabel = [club.league, club.block].filter(Boolean).join(" ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: club.name,
    sport: "Soccer",
    address: {
      "@type": "PostalAddress",
      addressRegion: club.prefecture,
      addressLocality: club.city,
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


        {leagueLabel && (
          <section style={{ marginTop: 24, borderTop: "1px solid var(--kf-border)", paddingTop: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--kf-primary)" }}>所属リーグ</h2>
            <div className="kf-card" style={{ padding: 16, fontSize: 14, lineHeight: 1.8 }}>
              {club.season ? `${club.season}年度：` : ""}{leagueLabel}
              <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 6 }}>
                順位・日程は各都道府県サッカー協会の公式発表をご確認ください。
              </div>
            </div>
          </section>
        )}

        <section style={{ marginTop: 24, borderTop: "1px solid var(--kf-border)", paddingTop: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--kf-primary)" }}>セレクション・練習会情報</h2>
          {selections.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--kf-muted)" }}>現在掲載中のセレクション情報はありません。最新情報はクラブ公式の発表をご確認ください。</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {selections.map((sel) => {
                const end = sel.event_date_end || sel.event_date;
                const isPast = !!end && end < today;
                const dateLabel = sel.event_date
                  ? fmtDate(sel.event_date) + (sel.event_date_end && sel.event_date_end !== sel.event_date ? `〜${fmtDate(sel.event_date_end)}` : "")
                  : "日程未定";
                return (
                  <div key={sel.id} className="kf-card" style={{ padding: 16, fontSize: 14, lineHeight: 1.8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
                      <span className="kf-badge">{isPast ? "実施済み" : "受付・開催予定"}</span>
                      <strong>
                        {sel.title || [sel.intake_year ? `${sel.intake_year}年度` : "", sel.target_grade, sel.selection_type].filter(Boolean).join(" ")}
                      </strong>
                    </div>
                    <div><strong>日程:</strong> {dateLabel}{sel.event_time ? ` ${sel.event_time}` : ""}</div>
                    {sel.venue && <div><strong>会場:</strong> {sel.venue}</div>}
                    {sel.apply_deadline && <div><strong>申込締切:</strong> {fmtDate(sel.apply_deadline)}</div>}
                    {sel.requirements && <div style={{ marginTop: 4 }}><strong>補足:</strong> {sel.requirements}</div>}
                    {sel.notes && <div style={{ marginTop: 4, color: "var(--kf-muted)" }}>{sel.notes}</div>}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8, fontSize: 13 }}>
                      {sel.apply_url && !isPast && (
                        <a href={sel.apply_url} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--primary" style={{ padding: "8px 14px", fontSize: 13 }}>申込ページ</a>
                      )}
                      {sel.source_url && (
                        <a href={sel.source_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--kf-primary)" }}>情報元を確認 →</a>
                      )}
                    </div>
                  </div>
                );
              })}
              <p style={{ fontSize: 12, color: "var(--kf-muted)" }}>
                ※掲載内容はクラブの発表や公開情報をもとにまとめたものです（情報元リンク参照）。参加前に必ず公式情報をご確認ください。実施済みの情報は、例年の実施時期の目安として掲載しています。
              </p>
            </div>
          )}
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
