"use client";

import { useEffect, useState, FormEvent } from "react";
import RegisterForm from "../register/RegisterForm";

type Me = {
  account: { status: string; plan: string; effective_plan: string; plan_status: string; trial_until: string | null; club_name: string | null; line_linked: boolean };
  limits: { photos: number; imagesPerMonth: number | null; reportDetail: boolean };
  club: { name: string; slug: string } | null;
  page_url: string | null;
  badge_url: string | null;
  selections: { id: string; title: string | null; selection_type: string | null; event_date: string | null; event_date_end: string | null; status: string }[];
  submissions: { kind: string; title: string; status: string; created_at: string }[];
  stats: { views30: number; clicks30?: number };
};

const PLAN = { free: "無料", standard: "スタンダード", premium: "プレミアム" } as Record<string, string>;
const STATUS = { new: "確認待ち", applied: "掲載済み", rejected: "見送り", expired: "期限切れ", error: "要確認" } as Record<string, string>;
const field: React.CSSProperties = { width: "100%", minHeight: 44, border: "1px solid var(--kf-border)", borderRadius: 10, padding: "8px 12px", fontSize: 16, background: "#fff", boxSizing: "border-box" };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, margin: "12px 0 4px" };
const h2: React.CSSProperties = { fontSize: 16, fontWeight: 800, margin: "28px 0 10px", color: "var(--kf-primary)" };

export default function ManageClient({ token, paid }: { token: string; paid: boolean }) {
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"home" | "selection" | "profile" | "plan">("home");

  useEffect(() => {
    fetch(`/api/partner/me?t=${encodeURIComponent(token)}`).then(async (r) => {
      if (!r.ok) return setErr("管理リンクが見つかりません。届いたリンクをもう一度開くか、運営に連絡してください。");
      setMe(await r.json());
    });
  }, [token]);

  if (err) return <p style={{ fontSize: 14, color: "var(--kf-danger)" }}>{err}</p>;
  if (!me) return <p style={{ fontSize: 14, color: "var(--kf-muted)" }}>読み込み中…</p>;
  const pending = me.account.status !== "active";

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>{me.club?.name || me.account.club_name}</h1>
      <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: 0 }}>
        プラン：{PLAN[me.account.effective_plan]}
        {me.account.plan === "free" && me.account.effective_plan === "standard" && me.account.trial_until ? `（お試し中・${me.account.trial_until.replaceAll("-", "/")}まで）` : ""}
      </p>
      {paid && <p className="kf-card" style={{ padding: 12, fontSize: 14 }}>お申し込みありがとうございます。反映まで数分かかることがあります。</p>}

      {pending ? (
        <div className="kf-card" style={{ padding: 16, marginTop: 16, fontSize: 14, lineHeight: 1.8 }}>登録内容を確認しています。掲載が始まったらお知らせします。</div>
      ) : (
        <div style={{ display: "flex", gap: 8, margin: "18px 0 0", flexWrap: "wrap" }}>
          {(["home", "selection", "profile", "plan"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`kf-btn ${tab === t ? "kf-btn--primary" : "kf-btn--ghost"}`} style={{ padding: "8px 14px", fontSize: 14 }}>
              {{ home: "ホーム", selection: "募集を登録", profile: "情報を更新", plan: "プラン" }[t]}
            </button>
          ))}
        </div>
      )}

      {!pending && tab === "home" && (
        <>
          <h2 style={h2}>最近30日</h2>
          <div className="kf-card" style={{ padding: 16, fontSize: 15, lineHeight: 1.9 }}>
            ページの閲覧：{me.stats.views30}回
            {me.stats.clicks30 !== undefined ? <><br />公式サイト・LINE・申込へのクリック：{me.stats.clicks30}回</> : <><br /><span style={{ fontSize: 13, color: "var(--kf-muted)" }}>クリック数はスタンダードプランで見られます。</span></>}
          </div>
          <h2 style={h2}>掲載ページとバッジ</h2>
          <div className="kf-card" style={{ padding: 16, fontSize: 14, lineHeight: 1.9 }}>
            {me.page_url && <a href={me.page_url} target="_blank" rel="noopener" style={{ color: "var(--kf-primary)", wordBreak: "break-all" }}>{me.page_url}</a>}
            {me.badge_url && (
              <div style={{ marginTop: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={me.badge_url} alt="掲載バッジ" style={{ width: 160, height: 160 }} />
                <div><a href={me.badge_url} download style={{ color: "var(--kf-primary)" }}>バッジ画像を保存</a>（プロフィールや投稿にお使いください）</div>
              </div>
            )}
          </div>
          <h2 style={h2}>募集情報</h2>
          {me.selections.length === 0 ? <p style={{ fontSize: 14, color: "var(--kf-muted)" }}>まだありません。「募集を登録」から追加できます。</p> : (
            <div style={{ display: "grid", gap: 8 }}>
              {me.selections.map((s) => (
                <div key={s.id} className="kf-card" style={{ padding: 12, fontSize: 14 }}>
                  <strong>{s.title || s.selection_type}</strong>　{s.event_date ? s.event_date.replaceAll("-", "/") : "随時"}
                  {s.status === "published" && (
                    <div style={{ marginTop: 6, fontSize: 13 }}>
                      告知画像：<a href={`/api/og/selection/${s.id}?size=feed`} target="_blank" style={{ color: "var(--kf-primary)" }}>フィード用</a>・<a href={`/api/og/selection/${s.id}?size=story`} target="_blank" style={{ color: "var(--kf-primary)" }}>ストーリーズ用</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <h2 style={h2}>送った内容</h2>
          <ul style={{ fontSize: 13, paddingLeft: 18, lineHeight: 1.9 }}>
            {me.submissions.map((s, i) => <li key={i}>{s.created_at.slice(0, 10).replaceAll("-", "/")} {s.title}：{STATUS[s.status] ?? s.status}</li>)}
          </ul>
        </>
      )}

      {!pending && tab === "selection" && <SelectionForm token={token} />}
      {!pending && tab === "profile" && <div style={{ marginTop: 8 }}><RegisterForm manage={token} maxPhotos={me.limits.photos} /></div>}
      {!pending && tab === "plan" && <PlanBox token={token} me={me} />}
    </div>
  );
}

function SelectionForm({ token }: { token: string }) {
  const y = new Date().getFullYear() + 1;
  const [f, setF] = useState({ selection_type: "セレクション", intake_year: String(y), target_grade: "新中1", title: "", event_date: "", event_date_end: "", event_time: "", venue: "", apply_deadline: "", apply_url: "", source_url: "", requirements: "" });
  const [always, setAlways] = useState(false);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  async function submit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    const r = await fetch("/api/partner/selection", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, always, manage_token: token }) });
    const j = await r.json();
    setSending(false);
    setMsg(r.ok ? "受け付けました。確認して掲載し、告知画像をお届けします。" : j.error || "送信できませんでした。");
    if (r.ok) setF({ ...f, title: "", event_date: "", event_date_end: "", event_time: "", venue: "", apply_deadline: "" });
  }
  return (
    <form onSubmit={submit} style={{ marginTop: 8 }}>
      <label style={label}>種類</label>
      <select style={field} value={f.selection_type} onChange={set("selection_type")}><option>セレクション</option><option>練習会</option></select>
      <label style={label}>対象</label>
      <div style={{ display: "flex", gap: 8 }}>
        <select style={field} value={f.intake_year} onChange={set("intake_year")}><option value={y}>{y}年度入団</option><option value={y + 1}>{y + 1}年度入団</option></select>
        <input style={field} value={f.target_grade} onChange={set("target_grade")} />
      </div>
      <label style={label}>タイトル（任意）</label>
      <input style={field} value={f.title} onChange={set("title")} placeholder={`例：${y}年度 第1回練習会`} />
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, marginTop: 14 }}>
        <input type="checkbox" checked={always} onChange={(e) => setAlways(e.target.checked)} /> 日付を決めず随時受け付けている
      </label>
      {!always && (
        <>
          <label style={label}>開催日 *</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input style={field} type="date" value={f.event_date} onChange={set("event_date")} />〜
            <input style={field} type="date" value={f.event_date_end} onChange={set("event_date_end")} />
          </div>
          <label style={label}>時間</label>
          <input style={field} value={f.event_time} onChange={set("event_time")} placeholder="例：18:30-20:30" />
        </>
      )}
      <label style={label}>会場</label>
      <input style={field} value={f.venue} onChange={set("venue")} />
      <label style={label}>申込締切</label>
      <input style={field} type="date" value={f.apply_deadline} onChange={set("apply_deadline")} />
      <label style={label}>申込ページのURL</label>
      <input style={field} value={f.apply_url} onChange={set("apply_url")} placeholder="https://" />
      <label style={label}>告知ページ・投稿のURL（あれば）</label>
      <input style={field} value={f.source_url} onChange={set("source_url")} placeholder="公式サイトやInstagramの投稿" />
      <label style={label}>補足（持ち物・対象など）</label>
      <textarea style={{ ...field, minHeight: 80 }} value={f.requirements} onChange={set("requirements")} />
      {msg && <p style={{ fontSize: 14, marginTop: 12 }}>{msg}</p>}
      <button type="submit" disabled={sending} className="kf-btn kf-btn--primary" style={{ width: "100%", minHeight: 48, marginTop: 14 }}>{sending ? "送信中…" : "登録する"}</button>
    </form>
  );
}

function PlanBox({ token, me }: { token: string; me: Me }) {
  const [busy, setBusy] = useState("");
  async function go(plan: string, interval: string) {
    setBusy(`${plan}-${interval}`);
    const r = await fetch("/api/partner/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ manage_token: token, plan, interval }) });
    const j = await r.json();
    if (j.url) window.location.assign(j.url); else { setBusy(""); alert(j.error || "申し込みを始められませんでした。"); }
  }
  const active = me.account.plan_status === "active" && me.account.plan !== "free";
  return (
    <div style={{ marginTop: 8 }}>
      {active ? (
        <p className="kf-card" style={{ padding: 16, fontSize: 14 }}>{PLAN[me.account.plan]}プランをご利用中です。変更・解約は運営までご連絡ください。</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { plan: "standard", name: "スタンダード", m: "1,980", yv: "19,800", pts: ["告知画像を毎回作成（チームのロゴ入り）", "写真20枚・クリック数のレポート", "運営インスタのまとめ投稿に掲載"] },
            { plan: "premium", name: "プレミアム", m: "4,980", yv: "49,800", pts: ["スタンダードの内容すべて", "運営インスタでの単独紹介（年2回）", "特集記事（年1本）・地域ページのPR枠"] },
          ].map((p) => (
            <div key={p.plan} className="kf-card" style={{ padding: 16 }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{p.name}</div>
              <ul style={{ fontSize: 14, paddingLeft: 18, lineHeight: 1.8 }}>{p.pts.map((x) => <li key={x}>{x}</li>)}</ul>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" disabled={!!busy} onClick={() => go(p.plan, "month")} className="kf-btn kf-btn--primary" style={{ padding: "10px 14px" }}>月{p.m}円で申し込む</button>
                <button type="button" disabled={!!busy} onClick={() => go(p.plan, "year")} className="kf-btn kf-btn--ghost" style={{ padding: "10px 14px" }}>年{p.yv}円で申し込む</button>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "var(--kf-muted)" }}>料金は税込です。お支払いはカード（Stripe）。いつでも解約でき、解約後も無料プランで掲載は続きます。</p>
        </div>
      )}
    </div>
  );
}
