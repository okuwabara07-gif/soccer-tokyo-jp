"use client";
import Link from "next/link";
import { useState } from "react";

export type Team = {
  id: string;
  name: string;
  category?: string;
  area?: string;
  rating?: number;
  reviewCount?: number;
  logoUrl?: string;
};

export default function TeamCard({ team }: { team: Team }) {
  const [fav, setFav] = useState(false);
  const hasRating = typeof team.rating === "number" && (team.reviewCount ?? 0) > 0;

  return (
    <div className="kf-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: 14 }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, background: "var(--kf-primary-soft)", display: "grid", placeItems: "center", overflow: "hidden" }}>
        {team.logoUrl
          ? <img src={team.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--kf-primary)" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7l4 3-1.5 5h-5L8 10z" /></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, color: "var(--kf-text)" }}>{team.name}</span>
          {team.category && <span className="kf-badge">{team.category}</span>}
        </div>
        {team.area && <div style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 2 }}>{team.area}</div>}
        <div style={{ fontSize: 13, marginTop: 4, color: hasRating ? "var(--kf-text)" : "var(--kf-muted)" }}>
          {hasRating
            ? <>★ <b>{team.rating!.toFixed(1)}</b> <span style={{ color: "var(--kf-muted)" }}>（{team.reviewCount}件）</span></>
            : <span>口コミ募集中</span>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button aria-label="お気に入り" onClick={() => setFav((v) => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={fav ? "var(--kf-danger)" : "none"} stroke={fav ? "var(--kf-danger)" : "var(--kf-muted)"} strokeWidth="1.8">
            <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
          </svg>
        </button>
        <Link href={`/teams/${team.id}`} className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>詳細</Link>
      </div>
    </div>
  );
}
