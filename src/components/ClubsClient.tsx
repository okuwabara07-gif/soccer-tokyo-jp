"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type Club = {
  id: string;
  slug: string;
  name: string;
  name_kana?: string;
  club_type: string;
  prefecture: string;
  city?: string;
  nearest_station?: string;
  monthly_fee?: number;
  practice_days?: string;
  strength_label?: string;
  official_url?: string;
  instagram?: string;
};

const PREFS = [
  { key: "東京都", label: "東京" },
  { key: "神奈川県", label: "神奈川" },
  { key: "埼玉県", label: "埼玉" },
  { key: "千葉県", label: "千葉" },
  { key: "茨城県", label: "茨城" },
  { key: "栃木県", label: "栃木" },
  { key: "群馬県", label: "群馬" },
  { key: "山梨県", label: "山梨" },
  { key: "大阪府", label: "大阪" },
  { key: "兵庫県", label: "兵庫" },
  { key: "京都府", label: "京都" },
  { key: "滋賀県", label: "滋賀" },
  { key: "奈良県", label: "奈良" },
  { key: "和歌山県", label: "和歌山" },
];

const CLUB_TYPES = [
  { key: "club", label: "クラブ" },
  { key: "j_academy", label: "Jリーグアカデミー" },
  { key: "school", label: "学校" },
];

const STRENGTH = [
  "すべて",
  "全国トップクラス",
  "関東トップクラス",
  "関西トップクラス",
  "府県トップクラス",
  "府県上位",
  "府県中位",
  "地域リーグ",
];

const PRACTICE = ["指定なし", "週1回", "週2回", "週3回以上"];

function normalize(s: string) {
  if (!s) return "";
  return s.toLowerCase().normalize("NFKC").replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

function initial(name: string) {
  return (name || "?").trim().charAt(0);
}

function feeLabel(c: Club) {
  if (c.monthly_fee === 0) return "無料";
  if (c.monthly_fee && c.monthly_fee > 0) return `月謝 ${c.monthly_fee.toLocaleString()}円〜`;
  return "月謝 要問合せ";
}

function typeLabel(type: string): string {
  const t = CLUB_TYPES.find(x => x.key === type);
  return t ? t.label : type;
}

export default function ClubsClient({ clubs }: { clubs: Club[] }) {
  const [pref, setPref] = useState("");
  const [clubType, setClubType] = useState("");
  const [strength, setStrength] = useState("すべて");
  const [q, setQ] = useState("");
  const [feeMax, setFeeMax] = useState(30000);
  const [practice, setPractice] = useState("指定なし");
  const [favs, setFavs] = useState<string[]>([]);

  const toggleFav = (slug: string) => {
    const next = favs.includes(slug) ? favs.filter(x => x !== slug) : [...favs, slug];
    setFavs(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("favClubs", JSON.stringify(next));
    }
  };

  const prefClubs = pref ? clubs.filter(c => c.prefecture === pref) : clubs;
  const nq = normalize(q);

  const filtered = useMemo(() =>
    prefClubs.filter(c => {
      if (clubType && c.club_type !== clubType) return false;
      if (strength !== "すべて" && c.strength_label !== strength) return false;
      if (nq && ![c.name, c.name_kana, c.city, c.nearest_station].some(v => v && normalize(v).includes(nq))) return false;
      if (feeMax < 30000 && c.monthly_fee && c.monthly_fee > feeMax) return false;
      if (practice !== "指定なし" && c.practice_days) {
        const p = c.practice_days;
        if (practice === "週1回" && !p.includes("1")) return false;
        if (practice === "週2回" && !p.includes("2")) return false;
        if (practice === "週3回以上" && !/[3-7]/.test(p)) return false;
      }
      return true;
    }),
    [prefClubs, clubType, strength, nq, feeMax, practice]
  );

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, overflowX: "auto" }}>
        <button
          onClick={() => setPref("")}
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            border: "1px solid var(--kf-border)",
            cursor: "pointer",
            background: pref === "" ? "var(--kf-primary)" : "var(--kf-surface)",
            color: pref === "" ? "#fff" : "var(--kf-text)",
            fontWeight: 700,
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          すべて
        </button>
        {PREFS.map(p => (
          <button
            key={p.key}
            onClick={() => setPref(p.key)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid var(--kf-border)",
              cursor: "pointer",
              background: pref === p.key ? "var(--kf-primary)" : "var(--kf-surface)",
              color: pref === p.key ? "#fff" : "var(--kf-text)",
              fontWeight: 700,
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 260px) 1fr", gap: 20, alignItems: "start" }}>
        {/* サイドバー */}
        <aside className="kf-card" style={{ padding: 18, position: "sticky", top: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>条件で絞り込む</div>

          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="クラブ名で検索"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", fontSize: 13, marginBottom: 16 }}
          />

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--kf-muted)", marginBottom: 8 }}>クラブ種別</div>
          <select
            value={clubType}
            onChange={e => setClubType(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--kf-border)", fontSize: 12, marginBottom: 16 }}
          >
            <option value="">すべて</option>
            {CLUB_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--kf-muted)", marginBottom: 8 }}>レベル</div>
          <select
            value={strength}
            onChange={e => setStrength(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--kf-border)", fontSize: 12, marginBottom: 16 }}
          >
            {STRENGTH.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--kf-muted)", marginBottom: 4 }}>月謝の上限</div>
          <input type="range" min={0} max={30000} step={1000} value={feeMax} onChange={e => setFeeMax(Number(e.target.value))} style={{ width: "100%" }} />
          <div style={{ fontSize: 12, color: "var(--kf-muted)", marginBottom: 16 }}>{feeMax >= 30000 ? "指定なし" : `〜${feeMax.toLocaleString()}円`}</div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--kf-muted)", marginBottom: 8 }}>練習頻度</div>
          <select
            value={practice}
            onChange={e => setPractice(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--kf-border)", fontSize: 13, marginBottom: 16 }}
          >
            {PRACTICE.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <button
            onClick={() => {
              setClubType("");
              setStrength("すべて");
              setQ("");
              setFeeMax(30000);
              setPractice("指定なし");
            }}
            style={{ width: "100%", marginTop: 8, background: "none", border: "1px solid var(--kf-border)", color: "var(--kf-primary)", fontSize: 12, cursor: "pointer", fontWeight: 700, borderRadius: 6, padding: 8 }}
          >
            ↻ リセット
          </button>
        </aside>

        {/* メインコンテンツ */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>{filtered.length}件のクラブ</div>
          </div>

          {filtered.length === 0 ? (
            <div className="kf-empty">
              <div className="kf-empty__title">該当するクラブがありません</div>
              <div className="kf-empty__hint">条件を変えてお試しください。</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {filtered.slice(0, 100).map(c => (
                <div key={c.slug} className="kf-card" style={{ padding: 14, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: "var(--kf-primary-soft)",
                      color: "var(--kf-primary)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {initial(c.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                      <Link href={`/clubs/${c.slug}`} style={{ fontWeight: 800, fontSize: 15, textDecoration: "none", color: "var(--kf-text)" }}>
                        {c.name}
                      </Link>
                      <button
                        onClick={() => toggleFav(c.slug)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: favs.includes(c.slug) ? "#E0245E" : "var(--kf-border)" }}
                      >
                        {favs.includes(c.slug) ? "♥" : "♡"}
                      </button>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 4 }}>
                      {typeLabel(c.club_type)}／{c.city || c.prefecture}
                    </div>
                    {c.strength_label && <div style={{ fontSize: 12, color: "var(--kf-primary)", fontWeight: 600, marginTop: 2 }}>{c.strength_label}</div>}
                    <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: "var(--kf-text)", flexWrap: "wrap" }}>
                      <span>{feeLabel(c)}</span>
                      {c.practice_days && <span>練習: {c.practice_days}</span>}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <Link href={`/clubs/${c.slug}`} className="kf-btn kf-btn--primary" style={{ padding: "7px 16px", fontSize: 12 }}>
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length > 100 && <div style={{ textAlign: "center", fontSize: 12, color: "var(--kf-muted)", padding: 12 }}>上位100件を表示中。条件を絞ると見つけやすくなります。</div>}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
