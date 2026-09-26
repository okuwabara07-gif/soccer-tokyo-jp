"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Sel = {
  id: string; slug: string; club_name: string; prefecture: string; city: string;
  selection_type: string; event_date: string; apply_deadline: string; venue: string;
  apply_url: string | null;
};

const PREFS = ["すべて", "東京都", "神奈川県", "埼玉県", "千葉県",
  "茨城県", "栃木県", "群馬県", "山梨県",
  "大阪府", "兵庫県", "京都府", "滋賀県", "奈良県", "和歌山県"];

function fmt(d: string) {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${m}/${day}`;
}

export default function SelectionPage() {
  const [visible, setVisible] = useState<Sel[]>([]);
  const [locked, setLocked] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pref, setPref] = useState("すべて");
  const [jleagueOnly, setJleagueOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ pref, jleague: jleagueOnly ? "1" : "0" });
    fetch(`/api/selection?${q.toString()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { setVisible(d.visible ?? []); setLocked(d.locked ?? 0); setTotal(d.total ?? 0); })
      .catch(() => { setVisible([]); setLocked(0); setTotal(0); })
      .finally(() => setLoading(false));
  }, [pref, jleagueOnly]);

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>セレクション情報センター</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px", lineHeight: 1.7 }}>
          関東・関西のジュニアユース・ジュニアのセレクション開催情報。日程・会場・申込先をまとめています。合否の傾向や合格率は扱いません。
        </p>

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

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--kf-muted)" }}>読み込み中…</div>
        ) : total === 0 ? (
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

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 20, lineHeight: 1.7 }}>
          ※掲載情報は変更される場合があります。応募前に必ず各クラブ公式サイトで最新の募集要項をご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
