"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AXES = ["コーチ", "保護者負担", "送迎", "雰囲気", "育成", "費用感"];
const NG = ["死ね", "殺す", "バカ", "アホ", "クズ", "ブス", "詐欺師"]; // 簡易NG（最低限）

type Review = { id: string; team_name: string; nickname: string; body: string; axis: string; rating: number; created_at: string };

function Stars({ value, size = 18, onPick }: { value: number; size?: number; onPick?: (n: number) => void }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n}
          onClick={onPick ? () => onPick(n) : undefined}
          style={{ cursor: onPick ? "pointer" : "default", fontSize: size, color: n <= value ? "#F5B400" : "#D8D8D2", lineHeight: 1 }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [nickname, setNickname] = useState("");
  const [axis, setAxis] = useState(AXES[0]);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    supabase.from("reviews").select("*").neq("status", "hidden").order("created_at", { ascending: false })
      .then(({ data }) => { setReviews((data as Review[]) ?? []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const avg = reviews.length ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.filter(r => r.rating).length || 0) : 0;

  const submit = async () => {
    if (!teamName.trim() || !body.trim()) { alert("題名と口コミ内容を入力してください"); return; }
    if (rating < 1) { alert("星評価を選んでください"); return; }
    const text = teamName + body + nickname;
    if (NG.some(w => text.includes(w))) { alert("不適切な表現が含まれている可能性があります。表現を見直してください。"); return; }
    setSending(true);
    const { error } = await supabase.from("reviews").insert({
      team_name: teamName.trim(), nickname: nickname.trim() || "匿名", axis, rating, body: body.trim(), status: "approved",
    });
    setSending(false);
    if (error) { alert("送信に失敗しました。時間をおいて再度お試しください。"); return; }
    setTeamName(""); setNickname(""); setBody(""); setRating(0); setOpen(false);
    setLoading(true); load();
    alert("口コミを投稿しました！");
  };

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>保護者の口コミ</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 14px", lineHeight: 1.7 }}>
          チーム選びの参考になる、保護者のリアルな声。星評価と6つの観点で投稿できます。
        </p>

        {reviews.length > 0 && (
          <div className="kf-card" style={{ padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#F5B400" }}>{avg.toFixed(1)}</div>
            <div>
              <Stars value={Math.round(avg)} size={20} />
              <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 2 }}>{reviews.length}件の口コミ</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {AXES.map(a => <span key={a} className="kf-badge">{a}</span>)}
        </div>

        {!open && (
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setOpen(true)} className="kf-btn kf-btn--primary" style={{ padding: "12px 22px" }}>口コミを投稿する</button>
          </div>
        )}

        {open && (
          <div className="kf-card" style={{ padding: 20, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>口コミを投稿</h2>
            <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>題名 *</label>
            <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="例: ◯◯FCジュニアユース セレクション参加レポート"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 12px", fontSize: 14 }} />

            <label style={{ fontSize: 12, color: "var(--kf-muted)", display: "block", marginBottom: 6 }}>総合評価 *</label>
            <div style={{ marginBottom: 12 }}><Stars value={rating} size={32} onPick={setRating} /></div>

            <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>ニックネーム（任意）</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="匿名"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 12px", fontSize: 14 }} />
            <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>観点</label>
            <select value={axis} onChange={e => setAxis(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 12px", fontSize: 14 }}>
              {AXES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>口コミ内容 *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="チームの雰囲気や保護者の関わり方など、体験にもとづいた感想をお書きください。"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 14px", fontSize: 14, resize: "vertical" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={submit} disabled={sending} className="kf-btn kf-btn--primary" style={{ padding: "12px 22px", opacity: sending ? .6 : 1 }}>
                {sending ? "送信中…" : "投稿する"}
              </button>
              <button onClick={() => setOpen(false)} className="kf-btn kf-btn--ghost" style={{ padding: "12px 22px" }}>キャンセル</button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ padding: 24, color: "var(--kf-muted)" }}>読み込み中…</div>
        ) : reviews.length === 0 ? (
          <div className="kf-empty">
            <div className="kf-empty__title">口コミ募集中</div>
            <div className="kf-empty__hint">まだ口コミがありません。あなたのチームの最初の声を投稿できます。</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {reviews.map(r => (
              <div key={r.id} className="kf-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{r.team_name}</div>
                  <span className="kf-badge">{r.axis}</span>
                </div>
                {r.rating ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <Stars value={r.rating} size={20} />
                    <span style={{ fontWeight: 800, color: "#F5B400", fontSize: 16 }}>{r.rating.toFixed(1)}</span>
                  </div>
                ) : null}
                <p style={{ fontSize: 13, lineHeight: 1.8, margin: "10px 0 6px", whiteSpace: "pre-wrap" }}>{r.body}</p>
                <div style={{ fontSize: 11, color: "var(--kf-muted)" }}>{r.nickname}</div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 20 }}>※口コミは投稿者個人の感想です。不適切な内容は通報・削除の対象となります。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
