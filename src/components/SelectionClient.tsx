"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type Selection = {
  id: string; slug: string; club_name: string; prefecture: string; city: string;
  selection_type: string; event_date: string; apply_deadline: string; venue: string;
  apply_url: string | null;
};

const PREFS = ["すべて", "東京都", "神奈川県", "埼玉県", "千葉県",
  "茨城県", "栃木県", "群馬県", "山梨県",
  "大阪府", "兵庫県", "京都府", "滋賀県", "奈良県", "和歌山県"];

const FREE_LIMIT = 3;

function fmt(d: string) {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${m}/${day}`;
}

export default function SelectionClient({ selections }: { selections: Selection[] }) {
  const [pref, setPref] = useState("すべて");
  const [jleagueOnly, setJleagueOnly] = useState(false);

  const filtered = useMemo(() =>
    selections
      .filter(s => pref === "すべて" || s.prefecture === pref)
      .filter(s => !jleagueOnly || s.club_name),
    [selections, pref, jleagueOnly]
  );

  const visible = filtered.slice(0, FREE_LIMIT);
  const locked = filtered.length - visible.length;

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {PREFS.map((p) => (
          <button key={p} onClick={() => setPref(p)}
            style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid var(--kf-border)", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: pref === p ? "var(--kf-primary)" : "var(--kf-surface)", color: pref === p ? "#fff" : "var(--kf-text)" }}>
            {p === "すべて" ? "全エリア" : p.replace(/[都県]/, "")}
          </button>
        ))}
      </div>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 18, cursor: "pointer" }}>
        <input type="checkbox" checked={jleagueOnly} onChange={(e) => setJleagueOnly(e.target.checked)} />
        Jリーグ下部組織のみ表示
      </label>

      {filtered.length === 0 ? (
        <div className="kf-empty"><div className="kf-empty__title">該当する情報がありません</div><div className="kf-empty__hint">条件を変えてお試しください。</div></div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {visible.map((s) => (
            <div key={s.id} className="kf-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>
                  {s.club_name}
                </div>
                <span className="kf-badge kf-badge--deadline">〜{fmt(s.apply_deadline)}締切</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 8, lineHeight: 1.8 }}>
                開催: {fmt(s.event_date)}／対象: {s.selection_type}／{s.prefecture} {s.city}
              </div>
              <div style={{ marginTop: 10 }}>
                {s.apply_url
                  ? <a href={s.apply_url} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--primary" style={{ padding: "8px 16px", fontSize: 13 }}>公式サイトで確認</a>
                  : <Link href={`/teams/${s.id}`} className="kf-btn kf-btn--ghost" style={{ padding: "8px 16px", fontSize: 13 }}>チーム詳細を見る</Link>}
              </div>
            </div>
          ))}

          {locked > 0 && (
            <div className="kf-card" style={{ padding: 28, textAlign: "center", background: "var(--kf-primary-soft)", border: "none" }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>続き{locked}件はプレミアム会員限定</div>
              <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "8px 0 14px" }}>関東全エリアのセレクション情報をすべて閲覧＋締切リマインドが使えます。</p>
              <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "12px 24px" }}>プレミアムを見る</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
