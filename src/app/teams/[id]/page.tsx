"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Team = {
  id: string; name: string; category: string; area: string; prefecture: string;
  block?: string; website?: string; instagram?: string; twitter?: string; facebook?: string;
  description?: string; name_kana?: string; access?: string; practice_days?: string;
  coach_info?: string; is_jleague?: boolean; selection_start?: string; selection_end?: string;
  apply_url?: string; fee?: number; is_free?: boolean; members?: number; founded?: number;
};

export default function TeamDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/team?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { setTeam((d.team as Team) ?? null); setHasSelection(!!d.has_selection); setIsPremium(!!d.active); })
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (<div style={{ background: "var(--kf-bg)", minHeight: "100vh" }}><Header /><main className="kf-container" style={{ padding: 40 }}>読み込み中…</main></div>);
  if (!team) return (<div style={{ background: "var(--kf-bg)", minHeight: "100vh" }}><Header /><main className="kf-container" style={{ padding: 40 }}><p>チームが見つかりませんでした。</p><Link href="/teams" className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px" }}>一覧に戻る</Link></main></div>);

  const Row = ({ label, value }: { label: string; value?: string | number }) =>
    value ? (<div style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid var(--kf-border)" }}><div style={{ width: 110, color: "var(--kf-muted)", fontSize: 13, flexShrink: 0 }}>{label}</div><div style={{ fontSize: 14 }}>{value}</div></div>) : null;

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px" }}>
        <Link href="/teams" style={{ fontSize: 13, color: "var(--kf-primary)", textDecoration: "none" }}>← チーム一覧</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 4px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{team.name}</h1>
          {team.is_jleague && <span className="kf-badge" style={{ background: "var(--kf-accent)", color: "#3a2e0a" }}>Jリーグ系</span>}
        </div>
        {team.name_kana && <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>{team.name_kana}</div>}

        <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
          <Row label="カテゴリ" value={team.category} />
          <Row label="エリア" value={[team.prefecture, team.area, team.block].filter(Boolean).join(" ")} />
          <Row label="練習日" value={team.practice_days} />
          <Row label="アクセス" value={team.access} />
          <Row label="会費" value={team.is_free ? "無料" : team.fee ? `¥${team.fee.toLocaleString()}` : undefined} />
          <Row label="部員数" value={team.members ? `${team.members}名` : undefined} />
          <Row label="設立" value={team.founded ? `${team.founded}年` : undefined} />
          <Row label="コーチ" value={team.coach_info} />
        </div>

        {team.description && (
          <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>チーム紹介</h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>{team.description}</p>
          </div>
        )}

        {hasSelection && (
          <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>セレクション情報</h2>
            {isPremium ? (
              <>
                <Row label="開催期間" value={[team.selection_start, team.selection_end].filter(Boolean).join(" 〜 ")} />
                {team.apply_url && <a href={team.apply_url} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--primary" style={{ padding: "10px 18px", marginTop: 10, display: "inline-block" }}>公式申込ページ</a>}
              </>
            ) : (
              <div style={{ background: "var(--kf-primary-soft)", borderRadius: 10, padding: 16, textAlign: "center" }}>
                <div style={{ fontWeight: 700 }}>セレクション詳細・申込先はプレミアム会員限定</div>
                <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "10px 20px", marginTop: 10, display: "inline-block" }}>プレミアムを見る</Link>
              </div>
            )}
          </div>
        )}

        <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>公式・SNS</h2>
          {isPremium ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {team.website && <a href={team.website} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>公式サイト</a>}
              {team.instagram && <a href={team.instagram} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>Instagram</a>}
              {team.twitter && <a href={team.twitter} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>X</a>}
              {team.facebook && <a href={team.facebook} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>Facebook</a>}
              {!team.website && !team.instagram && !team.twitter && !team.facebook && <span style={{ fontSize: 13, color: "var(--kf-muted)" }}>公式リンクは登録されていません。</span>}
            </div>
          ) : (
            <div style={{ background: "var(--kf-primary-soft)", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>公式サイト・SNSリンクはプレミアム会員限定</div>
              <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "10px 20px", marginTop: 10, display: "inline-block" }}>プレミアムを見る</Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
