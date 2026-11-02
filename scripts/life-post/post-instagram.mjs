// 「今日の1人」をInstagramに投稿する（GitHub Actions から毎朝実行）。
// 使い方: node scripts/life-post/post-instagram.mjs 2026-11-03 life-posts
// 前提: make-post.mjs が <日付>.jpg と <日付>.ig.txt を作っていること。
// 1) 画像を Supabase Storage の公開バケット life-posts に上げる（Instagramは公開URLの画像しか受け付けない）
// 2) Instagram Graph API でメディアを作り、処理完了を待って公開する
// 3) 投稿済みの印（<日付>.json）を同じバケットに置き、同じ日に二重投稿しない
import fs from "node:fs";
import path from "node:path";

const date = process.argv[2];
const dir = process.argv[3] || "life-posts";
const { INSTAGRAM_ACCOUNT_ID: IG, META_ACCESS_TOKEN: TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: SRK } = process.env;
const DRY = process.env.DRY_RUN === "true", FORCE = process.env.FORCE === "true";
const summary = (s) => { console.log(s); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, s + "\n"); };

// 画像は Instagram の設定がなくても公開バケットに置く（TikTok 用に Higgsfield から取り込むため）
const missingStore = [["SUPABASE_URL", SUPABASE_URL], ["SUPABASE_SERVICE_ROLE_KEY", SRK]].filter(([, v]) => !v).map(([k]) => k);
const missingIG = [["INSTAGRAM_ACCOUNT_ID", IG], ["META_ACCESS_TOKEN", TOKEN]].filter(([, v]) => !v).map(([k]) => k);
if (missingStore.length && !DRY) { summary(`❌ GitHubのシークレットが未設定: ${missingStore.join(", ")}`); process.exit(1); }

const jpg = fs.readFileSync(path.join(dir, `${date}.jpg`));
const caption = fs.readFileSync(path.join(dir, `${date}.ig.txt`), "utf8").slice(0, 2200);
const bucket = `${SUPABASE_URL}/storage/v1/object`;
const pub = (name) => `${bucket}/public/life-posts/${name}`;
const put = async (name, body, type) => {
  const r = await fetch(`${bucket}/life-posts/${name}`, { method: "POST", headers: { Authorization: `Bearer ${SRK}`, apikey: SRK, "Content-Type": type, "x-upsert": "true" }, body });
  if (!r.ok) throw new Error(`Storageへの保存に失敗 ${name}: ${r.status} ${await r.text()}`);
};

if (DRY) { summary(`🧪 テスト実行（投稿しない）\n\n${caption}`); process.exit(0); }

if (!FORCE) {
  const done = await fetch(pub(`${date}.json`) + `?t=${Date.now()}`);
  if (done.ok) { summary(`⏭ ${date} は投稿済み: ${(await done.json()).permalink || ""}`); process.exit(0); }
}

await put(`${date}.jpg`, jpg, "image/jpeg");
await put(`${date}.ig.txt`, caption, "text/plain");
const imageUrl = pub(`${date}.jpg`);
summary(`🖼 画像を置きました: ${imageUrl}`);
if (missingIG.length) { summary(`⏭ Instagramは未設定のため投稿しません（${missingIG.join(", ")}）`); process.exit(0); }

// Instagramログインのトークン（IGAA…）は graph.instagram.com、Facebookログインのトークンは graph.facebook.com
const API = process.env.GRAPH_API || (TOKEN.startsWith("IGAA") ? "https://graph.instagram.com/v21.0" : "https://graph.facebook.com/v21.0");
const call = async (method, p, params) => {
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  const r = method === "GET" ? await fetch(`${API}/${p}?${body}`) : await fetch(`${API}/${p}`, { method, body });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(`${p}: ${JSON.stringify(j.error || j)}`);
  return j;
};

const { id: container } = await call("POST", `${IG}/media`, { image_url: imageUrl, caption });
let status = "";
for (let i = 0; i < 20; i++) {
  await new Promise((r) => setTimeout(r, 3000));
  status = (await call("GET", container, { fields: "status_code" })).status_code;
  if (status === "FINISHED") break;
  if (status === "ERROR" || status === "EXPIRED") throw new Error(`メディアの処理に失敗: ${status}`);
}
if (status !== "FINISHED") throw new Error(`メディアの処理が終わらない: ${status}`);
const { id: media } = await call("POST", `${IG}/media_publish`, { creation_id: container });
let permalink = "";
try { permalink = (await call("GET", media, { fields: "permalink" })).permalink || ""; } catch {}
await put(`${date}.json`, JSON.stringify({ date, media, permalink, postedAt: new Date().toISOString() }), "application/json");
summary(`✅ ${date} をInstagramに投稿しました ${permalink}`);
