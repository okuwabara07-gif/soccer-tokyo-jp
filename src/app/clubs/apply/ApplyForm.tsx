"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";

// クラブ掲載・情報更新の申請フォーム。club_listing_requests へ匿名でINSERTする（RLS: insert のみ許可、読み取り不可）。
const PREFS = ["東京都", "神奈川県", "埼玉県", "千葉県", "茨城県", "栃木県", "群馬県", "山梨県", "大阪府", "兵庫県", "京都府", "滋賀県", "奈良県", "和歌山県", "その他"];

type Status = "idle" | "submitting" | "done" | "error";

const field: React.CSSProperties = { width: "100%", minHeight: 44, border: "1px solid var(--kf-border)", borderRadius: 10, padding: "8px 12px", fontSize: 15, background: "#fff", boxSizing: "border-box" };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, margin: "0 0 4px" };

export default function ApplyForm({ initialPref = "" }: { initialPref?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");
  const [f, setF] = useState({ club: "", pref: PREFS.includes(initialPref) ? initialPref : "", city: "", url: "", ig: "", role: "保護者", email: "", message: "", agree: false });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    if (!f.club.trim() || !f.pref) { setErr("クラブ名と都道府県を入力してください。"); return; }
    if (!f.url.trim() && !f.ig.trim()) { setErr("公式サイトかInstagramのどちらかを入力してください。掲載前の確認に使います。"); return; }
    if (!f.agree) { setErr("プライバシーポリシーへの同意にチェックしてください。"); return; }
    setStatus("submitting");
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.from("club_listing_requests").insert({
      club_name_raw: f.club.trim().slice(0, 80),
      prefecture: f.pref,
      official_url: f.url.trim().slice(0, 300) || null,
      instagram: f.ig.trim().slice(0, 300) || null,
      contact_name: f.role,
      contact_email: f.email.trim().slice(0, 200) || null,
      message: [f.city.trim() ? `市区町村: ${f.city.trim().slice(0, 40)}` : "", f.message.trim().slice(0, 1000)].filter(Boolean).join("\n") || null,
    });
    if (error) { setStatus("error"); setErr("送信できませんでした。時間をおいてもう一度お試しください。"); return; }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="kf-card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>申請を受け付けました</div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8 }}>公式サイト・所属リーグを確認したうえで掲載します。確認には1〜2週間ほどかかります。</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="kf-card" style={{ padding: 20, display: "grid", gap: 14 }}>
      <div><label style={label} htmlFor="ap-club">クラブ名（必須）</label><input id="ap-club" style={field} value={f.club} onChange={set("club")} maxLength={80} placeholder="例：〇〇FCジュニアユース" /></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
        <div><label style={label} htmlFor="ap-pref">都道府県（必須）</label>
          <select id="ap-pref" style={field} value={f.pref} onChange={set("pref")}><option value="">選んでください</option>{PREFS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
        <div><label style={label} htmlFor="ap-city">活動している市区町村</label><input id="ap-city" style={field} value={f.city} onChange={set("city")} maxLength={40} placeholder="例：世田谷区" /></div>
      </div>
      <div><label style={label} htmlFor="ap-url">公式サイト</label><input id="ap-url" type="url" inputMode="url" style={field} value={f.url} onChange={set("url")} placeholder="https://" /></div>
      <div><label style={label} htmlFor="ap-ig">Instagram</label><input id="ap-ig" style={field} value={f.ig} onChange={set("ig")} placeholder="https://www.instagram.com/..." /></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
        <div><label style={label} htmlFor="ap-role">あなたの立場</label>
          <select id="ap-role" style={field} value={f.role} onChange={set("role")}><option>保護者</option><option>クラブ関係者</option><option>選手</option><option>その他</option></select></div>
        <div><label style={label} htmlFor="ap-email">連絡先メール（任意）</label><input id="ap-email" type="email" style={field} value={f.email} onChange={set("email")} placeholder="確認事項がある場合のみ連絡します" /></div>
      </div>
      <div><label style={label} htmlFor="ap-msg">補足（所属リーグ、セレクション時期など）</label><textarea id="ap-msg" style={{ ...field, minHeight: 96 }} value={f.message} onChange={set("message")} maxLength={1000} /></div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, minHeight: 44 }}>
        <input type="checkbox" checked={f.agree} onChange={set("agree")} style={{ width: 20, height: 20 }} />
        <span><a href="/privacy" target="_blank" rel="noopener">プライバシーポリシー</a>に同意する</span>
      </label>
      {err && <p role="alert" style={{ margin: 0, color: "#b3261b", fontSize: 13, fontWeight: 700 }}>{err}</p>}
      <button type="submit" className="kf-btn kf-btn--primary" disabled={status === "submitting"} style={{ minHeight: 48, fontSize: 16 }}>
        {status === "submitting" ? "送信しています…" : "掲載を申請する"}
      </button>
    </form>
  );
}
