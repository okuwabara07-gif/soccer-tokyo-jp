// 配置先: src/app/teams/page.tsx （全置換）
"use client";
import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import TeamCard, { Team } from "@/components/TeamCard";

const PREFS = ["東京", "神奈川", "埼玉", "千葉"];
const CATS = ["すべて", "ジュニア", "ジュニアユース", "スクール", "アカデミー", "フットサル"];

// 実データが入るまで空配列（偽チームを出さない）。Supabase接続後にここへ流し込む。
const TEAMS: Team[] = [];

export default function TeamsPage() {
  const [pref, setPref] = useState("東京");
  const [cat, setCat] = useState("すべて");
  const [q, setQ] = useState("");

  const results = TEAMS.filter((t) =>
    (cat === "すべて" || t.category === cat) &&
    (q === "" || t.name.includes(q) || (t.area ?? "").includes(q))
  );

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "28px 16px 56px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px" }}>チームを探す</h1>

        {/* 都県タブ */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {PREFS.map((p) => (
            <button key={p} onClick={() => setPref(p)} className="kf-chip" data-active={pref === p}
              style={{ cursor: "pointer", fontSize: 14, padding: "8px 16px" }}>{p}</button>
          ))}
        </div>

        {/* 検索ボックス＋現在地 */}
        <div className="kf-card" style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--kf-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="チーム名・エリア・特徴で検索"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", color: "var(--kf-text)" }} />
          <button className="kf-btn kf-btn--ghost" style={{ padding: "8px 12px", fontSize: 13 }}>現在地</button>
        </div>

        {/* カテゴリチップ */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className="kf-chip" data-active={cat === c} style={{ cursor: "pointer" }}>{c}</button>
          ))}
        </div>

        {/* 結果件数 */}
        <div style={{ fontSize: 13, color: "var(--kf-muted)", marginBottom: 12 }}>
          {results.length > 0 ? `検索結果 ${results.length}件` : null}
        </div>

        {/* 結果リスト（空ステート） */}
        {results.length === 0 ? (
          <div className="kf-empty">
            <div className="kf-empty__title">チーム情報は準備中です</div>
            <div className="kf-empty__hint">{pref}のチームを順次掲載していきます。チーム関係者の方は掲載をお問い合わせください。</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {results.map((t) => <TeamCard key={t.id} team={t} />)}
          </div>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
