"use client";
import { useState, useEffect, useMemo } from "react";
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
  id: string; name: string; category: string; area: string; prefecture: string; block?: string;
  description?: string; name_kana?: string; fee?: number; is_free?: boolean; practice_days?: string;
  is_jleague?: boolean; selection_start?: string; lat?: number; lng?: number; website?: string;
};

const PREFS = [
  { key: "東京都", label: "東京" }, { key: "神奈川県", label: "神奈川" },
  { key: "埼玉県", label: "埼玉" }, { key: "千葉県", label: "千葉" },
];
const CATS = ["すべて","U6","U7","U8","U9","U10","U11","U12","U13","U14","U15","U18","ジュニア","ジュニアユース","女子U12","女子U15"];
const PRACTICE = ["指定なし","週1回","週2回","週3回以上"];

function normalize(s: string) {
  if (!s) return "";
  return s.toLowerCase().normalize("NFKC").replace(/[\u30A1-\u30F6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}
function initial(name: string) { return (name || "?").trim().charAt(0); }
function feeLabel(t: Team) {
  if (t.is_free) return "無料";
  if (t.fee && t.fee > 0) return `月謝 ${t.fee.toLocaleString()}円〜`;
  return "月謝 要問合せ";
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pref, setPref] = useState("東京都");
  const [cat, setCat] = useState("すべて");
  const [q, setQ] = useState("");
  const [feeMax, setFeeMax] = useState(30000);
  const [practice, setPractice] = useState("指定なし");
  const [selectionOnly, setSelectionOnly] = useState(false);
  const [jleagueOnly, setJleagueOnly] = useState(false);
  const [view, setView] = useState<"card" | "map">("card");
  const [favs, setFavs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { try { setFavs(JSON.parse(localStorage.getItem("favTeams") || "[]")); } catch {} }, []);
  useEffect(() => {
    setLoading(true);
    supabase.from("teams").select("*").eq("prefecture", pref).order("name").then(({ data }) => {
      setTeams((data as Team[]) ?? []); setLoading(false);
    });
  }, [pref]);

  const toggleFav = (id: string) => {
    const next = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    setFavs(next); localStorage.setItem("favTeams", JSON.stringify(next));
  };

  const nq = normalize(q);
  const filtered = useMemo(() => teams.filter(t => {
    if (cat !== "すべて" && t.category !== cat) return false;
    if (nq && ![t.name, t.name_kana, t.area, t.block, t.description].some(v => v && normalize(v).includes(nq))) return false;
    if (feeMax < 30000 && t.fee && t.fee > feeMax) return false;
    if (practice !== "指定なし" && t.practice_days) {
      const p = t.practice_days;
      if (practice === "週1回" && !p.includes("1")) return false;
      if (practice === "週2回" && !p.includes("2")) return false;
      if (practice === "週3回以上" && !/[3-7]/.test(p)) return false;
    }
    if (selectionOnly && !(t.is_jleague || t.selection_start)) return false;
    if (jleagueOnly && !t.is_jleague) return false;
    return true;
  }), [teams, cat, nq, feeMax, practice, selectionOnly, jleagueOnly]);

  const mapTeams = filtered.filter(t => t.lat && t.lng).slice(0, 50);
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "20px 16px 56px", maxWidth: 1180 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 2px" }}>チームを探す</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 14px" }}>関東4都県 6,000チーム以上から検索</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {PREFS.map(p => (
            <button key={p.key} onClick={() => setPref(p.key)}
              style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid var(--kf-border)", cursor: "pointer",
                background: pref === p.key ? "var(--kf-primary)" : "var(--kf-surface)", color: pref === p.key ? "#fff" : "var(--kf-text)", fontWeight: 700, fontSize: 13 }}>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,260px) 1fr", gap: 20, alignItems: "start" }}>
          {/* 左サイドバー */}
          <aside className="kf-card" style={{ padding: 18, position: "sticky", top: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>条件で絞り込む</div>

            <input value={q} onChange={e => setQ(e.target.value)} placeholder="チーム名・特徴で検索"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", fontSize: 13, marginBottom: 16 }} />

            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--kf-muted)", marginBottom: 8 }}>カテゴリ</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid var(--kf-border)", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: cat === c ? "var(--kf-primary)" : "transparent", color: cat === c ? "#fff" : "var(--kf-text)" }}>
                  {c}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--kf-muted)", marginBottom: 4 }}>月謝の上限（目安）</div>
            <input type="range" min={0} max={30000} step={1000} value={feeMax} onChange={e => setFeeMax(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ fontSize: 12, color: "var(--kf-muted)", marginBottom: 16 }}>{feeMax >= 30000 ? "指定なし" : `〜${feeMax.toLocaleString()}円`}</div>

            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--kf-muted)", marginBottom: 8 }}>練習頻度</div>
            <select value={practice} onChange={e => setPractice(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--kf-border)", fontSize: 13, marginBottom: 16 }}>
              {PRACTICE.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
              <input type="checkbox" checked={selectionOnly} onChange={e => setSelectionOnly(e.target.checked)} />
              セレクション情報あり
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
              <input type="checkbox" checked={jleagueOnly} onChange={e => setJleagueOnly(e.target.checked)} />
              Jリーグ下部組織のみ
            </label>

            <button onClick={() => { setCat("すべて"); setQ(""); setFeeMax(30000); setPractice("指定なし"); setSelectionOnly(false); setJleagueOnly(false); }}
              style={{ marginTop: 8, background: "none", border: "none", color: "var(--kf-primary)", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>
              ↻ 条件をリセット
            </button>
          </aside>

          {/* メイン */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>{loading ? "読み込み中…" : `${filtered.length}件のチーム`}</div>
              <div style={{ display: "flex", gap: 4, background: "var(--kf-surface)", padding: 4, borderRadius: 10, border: "1px solid var(--kf-border)" }}>
                <button onClick={() => setView("card")} style={{ padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: view === "card" ? "var(--kf-primary)" : "transparent", color: view === "card" ? "#fff" : "var(--kf-muted)" }}>カード</button>
                <button onClick={() => setView("map")} style={{ padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: view === "map" ? "var(--kf-primary)" : "transparent", color: view === "map" ? "#fff" : "var(--kf-muted)" }}>地図</button>
              </div>
            </div>

            {view === "map" ? (
              <div className="kf-card" style={{ padding: 0, overflow: "hidden", height: 520 }}>
                {mapsKey && mapTeams.length > 0 ? (
                  <iframe title="map" width="100%" height="520" style={{ border: 0 }} loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/view?key=${mapsKey}&center=${mapTeams[0].lat},${mapTeams[0].lng}&zoom=10`} />
                ) : (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--kf-muted)" }}>このエリアは地図表示できる位置情報が不足しています。カード表示をご利用ください。</div>
                )}
                <div style={{ fontSize: 11, color: "var(--kf-muted)", padding: "8px 12px" }}>※位置情報が登録されたチームのみ地図に表示されます（{mapTeams.length}件）。</div>
              </div>
            ) : loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--kf-muted)" }}>読み込み中…</div>
            ) : filtered.length === 0 ? (
              <div className="kf-empty"><div className="kf-empty__title">該当するチームがありません</div><div className="kf-empty__hint">条件を変えてお試しください。</div></div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {filtered.slice(0, 60).map(t => (
                  <div key={t.id} className="kf-card" style={{ padding: 14, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--kf-primary-soft)", color: "var(--kf-primary)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 22, flexShrink: 0 }}>{initial(t.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                        <Link href={`/teams/${t.id}`} style={{ fontWeight: 800, fontSize: 15, textDecoration: "none", color: "var(--kf-text)" }}>{t.name}</Link>
                        <button onClick={() => toggleFav(t.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: favs.includes(t.id) ? "#E0245E" : "var(--kf-border)" }}>{favs.includes(t.id) ? "♥" : "♡"}</button>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 4 }}>
                        {t.category}／{t.area || t.block || t.prefecture}
                        {t.is_jleague && <span className="kf-badge" style={{ marginLeft: 8, background: "var(--kf-accent)", color: "#3a2e0a" }}>Jリーグ系</span>}
                      </div>
                      {t.description && <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "6px 0 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{t.description}</p>}
                      <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: "var(--kf-text)", flexWrap: "wrap" }}>
                        <span>{feeLabel(t)}</span>
                        {t.practice_days && <span>練習: {t.practice_days}</span>}
                        {(t.is_jleague || t.selection_start) && <span style={{ color: "var(--kf-primary)", fontWeight: 700 }}>セレクション情報あり</span>}
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <Link href={`/teams/${t.id}`} className="kf-btn kf-btn--primary" style={{ padding: "7px 16px", fontSize: 12 }}>詳細を見る</Link>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length > 60 && <div style={{ textAlign: "center", fontSize: 12, color: "var(--kf-muted)", padding: 12 }}>上位60件を表示中。条件を絞ると見つけやすくなります。</div>}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
