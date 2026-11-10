// 掲載チーム（パートナー）機能の共通処理。サーバー専用（service_role を使う）。
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";

export const SITE = (process.env.NEXT_PUBLIC_BASE_URL || "https://soccer-selection.jp").replace(/\/$/, "");

export type Plan = "free" | "standard" | "premium";

// プランごとの上限（料金・中身は vault の決定に合わせて調整する）
export const PLAN_LIMITS: Record<Plan, { photos: number; imagesPerMonth: number | null; reportDetail: boolean }> = {
  free: { photos: 3, imagesPerMonth: 1, reportDetail: false },
  standard: { photos: 20, imagesPerMonth: null, reportDetail: true },
  premium: { photos: 20, imagesPerMonth: null, reportDetail: true },
};

export const PLAN_LABEL: Record<Plan, string> = { free: "無料", standard: "スタンダード", premium: "プレミアム" };

export function admin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabase service role is not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

export function newToken(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

export type Account = {
  id: string;
  club_id: string | null;
  club_name_raw: string | null;
  prefecture: string | null;
  contact_name: string | null;
  contact_email: string | null;
  instagram: string | null;
  line_user_id: string | null;
  status: "pending" | "active" | "suspended";
  plan: Plan;
  plan_status: string;
  trial_until: string | null;
  manage_token: string | null;
  invite_token: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  last_reminded_at: string | null;
  last_report_month: string | null;
};

// お試し期間中の無料プランはスタンダード扱い
export function effectivePlan(a: Pick<Account, "plan" | "trial_until">, today = todayJst()): Plan {
  if (a.plan === "free" && a.trial_until && a.trial_until >= today) return "standard";
  return a.plan;
}

export function todayJst(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export async function accountByManageToken(sb: SupabaseClient, token: string | null | undefined) {
  if (!token || token.length < 20) return null;
  const { data } = await sb.from("club_accounts").select("*").eq("manage_token", token).maybeSingle();
  return (data as Account) ?? null;
}

// ---- LINE（運営のパートナー向け公式アカウント）の userId を、登録フォームのURLに安全に載せる ----
function lineSecret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET || "dev-insecure-secret-change-me");
}
export async function signLineUser(userId: string) {
  return await new SignJWT({ lu: userId, k: "partner" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(lineSecret());
}
export async function verifyLineUser(token: string | null | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, lineSecret());
    return payload.k === "partner" && typeof payload.lu === "string" ? payload.lu : null;
  } catch {
    return null;
  }
}

// ---- 通知（LINE があれば LINE、無ければメール。どちらも無ければ送らない） ----
export async function linePush(to: string, messages: unknown[]) {
  const token = process.env.LINE_PARTNER_CHANNEL_ACCESS_TOKEN;
  if (!token) return { ok: false, reason: "line_not_configured" };
  const r = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ to, messages }),
  });
  return { ok: r.ok, reason: r.ok ? "" : `line_${r.status}` };
}

export async function lineReply(replyToken: string, messages: unknown[]) {
  const token = process.env.LINE_PARTNER_CHANNEL_ACCESS_TOKEN;
  if (!token) return { ok: false };
  const r = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ replyToken, messages }),
  });
  return { ok: r.ok };
}

export async function sendMail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "mail_not_configured" };
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const from = process.env.CONTACT_FROM_EMAIL || "noreply@soccer-selection.jp";
  const { error } = await resend.emails.send({ from, to, subject, text });
  return { ok: !error, reason: error ? "mail_error" : "" };
}

// 1回だけ送る（partner_notify_log の dedupe_key で二重送信を防ぐ）
export async function notifyOnce(
  sb: SupabaseClient,
  a: Pick<Account, "id" | "line_user_id" | "contact_email">,
  kind: string,
  dedupeKey: string,
  subject: string,
  text: string,
  lineExtra: unknown[] = []
) {
  const { data: seen } = await sb.from("partner_notify_log").select("id").eq("dedupe_key", dedupeKey).maybeSingle();
  if (seen) return "skip";
  let channel = "none";
  let ok = false;
  if (a.line_user_id) {
    const r = await linePush(a.line_user_id, [{ type: "text", text: text.slice(0, 4900) }, ...lineExtra].slice(0, 5));
    if (r.ok) { channel = "line"; ok = true; }
  }
  if (!ok && a.contact_email) {
    const r = await sendMail(a.contact_email, subject, text);
    if (r.ok) { channel = "email"; ok = true; }
  }
  if (!ok) return "no_channel";
  await sb.from("partner_notify_log").insert({ account_id: a.id, kind, dedupe_key: dedupeKey, channel, detail: subject });
  return channel;
}

// 運営への新着連絡（メール）
export async function notifyOperator(subject: string, text: string) {
  const to = process.env.PARTNER_OPERATOR_EMAIL || process.env.CONTACT_TO_EMAIL || "contact@soccer-selection.jp";
  return sendMail(to, subject, text);
}

// ---- 入力の整形 ----
export function clean(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  return s ? s.slice(0, max) : null;
}
export function cleanMultiline(v: unknown, max = 1000): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim();
  return s ? s.slice(0, max) : null;
}
export function cleanUrl(v: unknown): string | null {
  const s = clean(v, 300);
  if (!s) return null;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}
export function instagramUrl(v: unknown): string | null {
  const s = clean(v, 200);
  if (!s) return null;
  const handle = s.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/^@/, "").split(/[/?#]/)[0];
  return /^[A-Za-z0-9._]{1,30}$/.test(handle) ? `https://www.instagram.com/${handle}/` : null;
}
export function instagramHandle(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([A-Za-z0-9._]+)/);
  return m ? m[1] : null;
}
export function cleanDate(v: unknown): string | null {
  const s = clean(v, 10);
  return s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}
export function slugify(name: string): string {
  const ascii = name.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return (ascii.length >= 3 ? ascii.slice(0, 40) : "club") + "-" + randomBytes(3).toString("hex");
}

export const PREFS = ["東京都", "神奈川県", "埼玉県", "千葉県", "茨城県", "栃木県", "群馬県", "山梨県", "大阪府", "兵庫県", "京都府", "滋賀県", "奈良県", "和歌山県"];

export function manageUrl(token: string) {
  return `${SITE}/partner/manage?t=${encodeURIComponent(token)}`;
}
