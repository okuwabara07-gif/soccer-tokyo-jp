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

type Review = { id: string; team_name: string; nickname: string; body: string; axis: string; created_at: string };

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [nickname, setNickname] = useState("");
  const [axis, setAxis] = useState(AXES[0]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.from("reviews").select("*").eq("status", "approved").order("created_at", { ascending: false })
      .then(({ data }) => { setReviews((data as Review[]) ?? []); setLoading(false); });
  }, []);

  const submit = async () => {
    if (!teamName.trim() || !body.trim()) { alert("チーム名と口コミ内容を入力してください"); return; }
    setSending(true);
    const { error } = await supabase.from("reviews").insert({
      team_name: teamName.trim(), nickname: nickname.trim() || "匿名", axis, body: body.trim(), status: "pending",
    });
    setSending(false);
    if (error) { alert("送信に失敗しました。時間をおいて再度お試しください。"); return; }
    setDone(true); setTeamName(""); setNickname(""); setBody("");
  };

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>保護者の口コミ</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px", lineHeight: 1.7 }}>
          チーム選びの参考になる、保護者のリアルな声。次の6つの観点で投稿できます。
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {AXES.map(a => <span key={a} className="kf-badge">{a}</span>)}
        </div>

        {!open && !done && (
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setOpen(true)} className="kf-btn kf-btn--primary" style={{ padding: "12px 22px" }}>口コミを投稿する</button>
          </div>
        )}

        {open && !done && (
          <div className="kf-card" style={{ padding: 20, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>口コミを投稿</h2>
            <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>チーム名 *</label>
            <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="例: ◯◯FC ジュニアユース"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 12px", fontSize: 14 }} />
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

        {done && (
          <div className="kf-card" style={{ padding: 24, textAlign: "center", background: "var(--kf-primary-soft)", border: "none", marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>投稿ありがとうございました</div>
            <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "8px 0 0" }}>内容を確認のうえ掲載します（承認制）。掲載まで少しお時間をいただきます。</p>
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
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{r.team_name}</div>
                  <span className="kf-badge">{r.axis}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.8, margin: "8px 0 6px" }}>{r.body}</p>
                <div style={{ fontSize: 11, color: "var(--kf-muted)" }}>{r.nickname}</div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 20 }}>※口コミは投稿者個人の感想です。掲載は承認制とし、不適切な内容は通報・削除の対象となります。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
