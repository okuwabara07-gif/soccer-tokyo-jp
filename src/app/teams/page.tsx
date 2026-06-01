"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Team = {
  id: string; name: string; category: string; area: string; prefecture: string;
  block?: string; website?: string; instagram?: string; description?: string;
  name_kana?: string; access?: string; practice_days?: string;
  is_jleague?: boolean; selection_start?: string; apply_url?: string;
};

const PREFS = [
  { key: "東京都", label: "東京" },
  { key: "神奈川県", label: "神奈川" },
  { key: "埼玉県", label: "埼玉" },
  { key: "千葉県", label: "千葉" },
];
const CATS = ["すべて","U6","U7","U8","U9","U10","U11","U12","U13","U14","U15","U18","ジュニア","ジュニアユース","女子U12","女子U15"];

function normalize(s: string) {
  if (!s) return "";
  return s.toLowerCase().normalize("NFKC").replace(/[\u30A1-\u30F6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pref, setPref] = useState("東京都");
  const [cat, setCat] = useState("すべて");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    supabase.from("teams").select("*").eq("prefecture", pref).order("name").then(({ data }) => {
      if (!cancel) { setTeams((data as Team[]) ?? []); setLoading(false); }
    });
    return () => { cancel = true; };
  }, [pref]);

  const nq = normalize(q);
  const filtered = teams.filter(t => {
    const okCat = cat === "すべて" || t.category === cat;
    const okQ = !nq || [t.name, t.name_kana, t.area, t.block, t.description].some(v => v && normalize(v).includes(nq));
    return okCat && okQ;
  });

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>チームを探す</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px" }}>関東4都県 6,000チーム以上から検索</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {PREFS.map(p => (
            <button key={p.key} onClick={() => setPref(p.key)}
              style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid var(--kf-border)", cursor: "pointer",
                background: pref === p.key ? "var(--kf-primary)" : "var(--kf-surface)",
                color: pref === p.key ? "#fff" : "var(--kf-text)", fontWeight: 700, fontSize: 13 }}>
              {p.label}
            </button>
          ))}
        </div>

        <input value={q} onChange={e => setQ(e.target.value)} placeholder="チーム名・エリア・特徴で検索"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--kf-border)", fontSize: 14, marginBottom: 12 }} />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: "5px 12px", borderRadius: 999, border: "1px solid var(--kf-border)", cursor: "pointer",
                background: cat === c ? "var(--kf-primary-soft)" : "transparent",
                color: cat === c ? "var(--kf-primary)" : "var(--kf-muted)", fontWeight: 600, fontSize: 12 }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, color: "var(--kf-muted)", marginBottom: 12 }}>
          {loading ? "読み込み中…" : `${filtered.length}件のチーム`}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
          {filtered.map(t => (
            <Link key={t.id} href={`/teams/${t.id}`} className="kf-card" style={{ padding: 16, textDecoration: "none", color: "var(--kf-text)", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{t.name}</div>
                {t.is_jleague && <span className="kf-badge" style={{ background: "var(--kf-accent)", color: "#3a2e0a" }}>Jリーグ系</span>}
              </div>
              <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 6, lineHeight: 1.7 }}>
                {t.category} ／ {t.area || t.block || t.prefecture}
              </div>
              {t.description && <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{t.description}</div>}
            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="kf-empty"><div className="kf-empty__title">該当するチームがありません</div><div className="kf-empty__hint">条件を変えてお試しください。</div></div>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
