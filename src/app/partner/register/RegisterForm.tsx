"use client";

import { useEffect, useState, FormEvent } from "react";

const PREFS = ["東京都", "神奈川県", "埼玉県", "千葉県", "茨城県", "栃木県", "群馬県", "山梨県", "大阪府", "兵庫県", "京都府", "滋賀県", "奈良県", "和歌山県"];
const field: React.CSSProperties = { width: "100%", minHeight: 44, border: "1px solid var(--kf-border)", borderRadius: 10, padding: "8px 12px", fontSize: 16, background: "#fff", boxSizing: "border-box" };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, margin: "14px 0 4px" };
const hint: React.CSSProperties = { fontSize: 12, color: "var(--kf-muted)", margin: "4px 0 0", lineHeight: 1.6 };

type Club = { id: string; slug: string; name: string; prefecture: string; city: string | null };
type Photo = { file: File; preview: string; caption: string };

// 画像をブラウザで縮小（長辺1600px・JPEG）してから送る
async function shrink(file: File, max = 1600): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const r = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * r);
  c.height = Math.round(bmp.height * r);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return await new Promise((res) => c.toBlob((b) => res(b!), "image/jpeg", 0.82));
}

async function upload(blobs: Blob[]): Promise<string[]> {
  if (blobs.length === 0) return [];
  const r = await fetch("/api/partner/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ count: blobs.length, ext: blobs.map(() => "jpg") }) });
  if (!r.ok) throw new Error("upload");
  const { files } = (await r.json()) as { files: { path: string; token: string }[] };
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  await Promise.all(files.map(async (f, i) => {
    const u = await fetch(`${base}/storage/v1/object/upload/sign/club-media/${f.path}?token=${encodeURIComponent(f.token)}`, {
      method: "PUT", headers: { "Content-Type": "image/jpeg", "x-upsert": "false" }, body: blobs[i],
    });
    if (!u.ok) throw new Error("upload");
  }));
  return files.map((f) => f.path);
}

export default function RegisterForm({ invite = "", lu = "", manage = "", maxPhotos = 10 }: { invite?: string; lu?: string; manage?: string; maxPhotos?: number }) {
  const [f, setF] = useState({
    club_name: "", prefecture: "", city: "", team_gender: "boys", contact_name: "", contact_email: "",
    official_url: "", instagram: "", line_url: "", contact_url: "", practice_days: "", practice_ground: "",
    nearest_station: "", monthly_fee: "", intro: "", website_hp: "",
  });
  const [agree, setAgree] = useState(false);
  const [consent, setConsent] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Club[]>([]);
  const [club, setClub] = useState<Club | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState("");
  const [manageLink, setManageLink] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (manage || club || q.trim().length < 2) return;
    const t = setTimeout(async () => {
      const r = await fetch(`/api/partner/clubs?q=${encodeURIComponent(q.trim())}`);
      if (r.ok) setHits((await r.json()).clubs ?? []);
    }, 300);
    return () => clearTimeout(t);
  }, [q, club, manage]);

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []).filter((x) => x.type.startsWith("image/"));
    setPhotos((p) => [...p, ...list.map((file) => ({ file, preview: URL.createObjectURL(file), caption: "" }))].slice(0, maxPhotos));
    e.target.value = "";
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    if (!manage) {
      const name = club?.name || f.club_name.trim();
      if (!name || !(club?.prefecture || f.prefecture)) return setErr("クラブ名と都道府県を入力してください。");
      if (!f.contact_name.trim()) return setErr("責任者の役職・お名前を入力してください。");
      if (!f.contact_email.trim() && !lu) return setErr("連絡先のメールアドレスを入力してください。");
      if (!agree) return setErr("掲載規約への同意にチェックしてください。");
    }
    if (photos.length > 0 && !consent) return setErr("写真に写っている選手・保護者の同意を確認のうえ、チェックしてください。");
    setState("sending");
    try {
      const photoPaths = await upload(await Promise.all(photos.map((p) => shrink(p.file))));
      const [logoPath] = logo ? await upload([await shrink(logo, 600)]) : [];
      const r = await fetch("/api/partner/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          club_name: club?.name || f.club_name, prefecture: club?.prefecture || f.prefecture, club_id: club?.id,
          photos: photoPaths.map((path, i) => ({ path, caption: photos[i].caption })), logo_path: logoPath,
          photo_consent: consent, agree, t: invite, lu, manage_token: manage || undefined,
        }),
      });
      const j = await r.json();
      if (!r.ok) { setState("idle"); return setErr(j.error || "送信できませんでした。"); }
      setManageLink(j.manage_url || "");
      setState("done");
    } catch {
      setState("idle");
      setErr("送信できませんでした。通信状況を確認して、もう一度お試しください。");
    }
  }

  if (state === "done") {
    return (
      <div className="kf-card" style={{ padding: 20, lineHeight: 1.9 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>受け付けました</h2>
        <p style={{ margin: 0, fontSize: 14 }}>内容を確認して掲載します（通常1〜3日）。掲載が始まったら{lu ? "LINE" : "メール"}でお知らせします。</p>
        {manageLink && !manage && (
          <p style={{ fontSize: 14 }}>
            このチーム専用の管理ページです。ブックマークしておいてください（他の人には教えないでください）。<br />
            <a href={manageLink} style={{ color: "var(--kf-primary)", wordBreak: "break-all" }}>{manageLink}</a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {!manage && (
        <>
          <label style={label}>クラブ名 *</label>
          {club ? (
            <div className="kf-card" style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{club.name}（{[club.prefecture, club.city].filter(Boolean).join("・")}）</span>
              <button type="button" onClick={() => setClub(null)} style={{ fontSize: 13, color: "var(--kf-primary)", background: "none", border: 0 }}>変更</button>
            </div>
          ) : (
            <>
              <input style={field} value={f.club_name} onChange={(e) => { set("club_name")(e); setQ(e.target.value); }} placeholder="例：〇〇FC ジュニアユース" />
              {hits.length > 0 && q.trim().length >= 2 && (
                <div className="kf-card" style={{ padding: 8, marginTop: 6 }}>
                  <div style={{ fontSize: 12, color: "var(--kf-muted)", padding: "0 4px 4px" }}>すでに掲載中のクラブなら選んでください</div>
                  {hits.map((h) => (
                    <button key={h.id} type="button" onClick={() => setClub(h)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 4px", background: "none", border: 0, borderTop: "1px solid var(--kf-border)", fontSize: 14 }}>
                      {h.name}（{[h.prefecture, h.city].filter(Boolean).join("・")}）
                    </button>
                  ))}
                </div>
              )}
              <label style={label}>都道府県 *</label>
              <select style={field} value={f.prefecture} onChange={set("prefecture")}>
                <option value="">選んでください</option>
                {PREFS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <label style={label}>市区町村</label>
              <input style={field} value={f.city} onChange={set("city")} placeholder="例：世田谷区" />
              <label style={label}>チーム</label>
              <select style={field} value={f.team_gender} onChange={set("team_gender")}>
                <option value="boys">男子（男女混合を含む）</option>
                <option value="girls">女子</option>
              </select>
            </>
          )}

          <label style={label}>責任者の役職・お名前 *</label>
          <input style={field} value={f.contact_name} onChange={set("contact_name")} placeholder="例：代表 山田" />
          <p style={hint}>連絡用です。サイトには表示しません。</p>
          <label style={label}>連絡先メールアドレス {lu ? "" : "*"}</label>
          <input style={field} type="email" value={f.contact_email} onChange={set("contact_email")} />
          {lu && <p style={hint}>LINEとつながっているので、お知らせはLINEに届きます。</p>}
        </>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 800, margin: "28px 0 0", color: "var(--kf-primary)" }}>掲載する情報{manage ? "（変える項目だけ入力）" : ""}</h2>
      <label style={label}>チーム紹介（600字まで）</label>
      <textarea style={{ ...field, minHeight: 120 }} value={f.intro} onChange={set("intro")} placeholder="練習の方針、雰囲気、卒団後の進路など" />
      <p style={hint}>「必ず上達」「No.1」などの断定や比較の表現は掲載時に調整することがあります。</p>
      <label style={label}>練習日</label>
      <input style={field} value={f.practice_days} onChange={set("practice_days")} placeholder="例：火・木・土（平日19:00〜21:00）" />
      <label style={label}>練習場所</label>
      <input style={field} value={f.practice_ground} onChange={set("practice_ground")} />
      <label style={label}>最寄駅</label>
      <input style={field} value={f.nearest_station} onChange={set("nearest_station")} />
      <label style={label}>月謝（円）</label>
      <input style={field} inputMode="numeric" value={f.monthly_fee} onChange={set("monthly_fee")} placeholder="例：12000" />
      <label style={label}>公式サイト</label>
      <input style={field} value={f.official_url} onChange={set("official_url")} placeholder="https://" />
      <label style={label}>Instagram</label>
      <input style={field} value={f.instagram} onChange={set("instagram")} placeholder="@ から始まるアカウント名かURL" />
      <label style={label}>チームの公式LINE（友だち追加URL）</label>
      <input style={field} value={f.line_url} onChange={set("line_url")} placeholder="https://lin.ee/..." />
      <p style={hint}>入れると、ページに「LINEで問い合わせる」ボタンが付きます。</p>
      <label style={label}>問い合わせフォームのURL</label>
      <input style={field} value={f.contact_url} onChange={set("contact_url")} placeholder="https://" />

      <label style={label}>ロゴ</label>
      <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
      <label style={label}>写真（{maxPhotos}枚まで）</label>
      <input type="file" accept="image/*" multiple onChange={addPhotos} />
      <p style={hint}>練習風景・グラウンドなど。顔がはっきり分かる個人の写真や、名前・ゼッケン番号が読める写真は避けてください。</p>
      {photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginTop: 8 }}>
          {photos.map((p, i) => (
            <div key={p.preview} className="kf-card" style={{ padding: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.preview} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 8 }} />
              <input style={{ ...field, minHeight: 36, fontSize: 13, marginTop: 6 }} placeholder="説明（任意）" value={p.caption}
                onChange={(e) => setPhotos(photos.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} />
              <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ fontSize: 12, color: "var(--kf-danger)", background: "none", border: 0, marginTop: 4 }}>外す</button>
            </div>
          ))}
        </div>
      )}
      {photos.length > 0 && (
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 14, marginTop: 12 }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 4 }} />
          写真に写っている選手と保護者から、掲載の同意を得ています。
        </label>
      )}

      <input tabIndex={-1} autoComplete="off" value={f.website_hp} onChange={set("website_hp")} style={{ position: "absolute", left: -9999 }} aria-hidden="true" />

      {!manage && (
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 14, marginTop: 18 }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 4 }} />
          <span><a href="/partner#rules" target="_blank" style={{ color: "var(--kf-primary)" }}>掲載のきまり</a>と<a href="/privacy" target="_blank" style={{ color: "var(--kf-primary)" }}>プライバシーポリシー</a>に同意します。内容は運営が確認してから掲載されます。</span>
        </label>
      )}

      {err && <p style={{ color: "var(--kf-danger)", fontSize: 14, marginTop: 14 }}>{err}</p>}
      <button type="submit" disabled={state === "sending"} className="kf-btn kf-btn--primary" style={{ width: "100%", minHeight: 48, marginTop: 18, fontSize: 16 }}>
        {state === "sending" ? "送信中…" : manage ? "更新を送る" : "登録する"}
      </button>
    </form>
  );
}
