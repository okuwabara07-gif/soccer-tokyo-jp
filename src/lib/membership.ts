import { createClient } from "@supabase/supabase-js";

const TRIAL_DAYS = 3;

export type Membership = { active: boolean; plan: string | null; trialDaysLeft: number };

function svc() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// uid = LINE userId（セッションCookie由来）。会員 or 有効トライアルなら active。
export async function getMembership(uid: string | null | undefined): Promise<Membership> {
  const none: Membership = { active: false, plan: null, trialDaysLeft: 0 };
  if (!uid) return none;
  const sb = svc();
  if (!sb) return none;

  // 課金会員か？
  const { data: m } = await sb
    .from("members")
    .select("plan,status,updated_at")
    .eq("line_user_id", uid)
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1);
  if (m && m.length > 0) {
    return { active: true, plan: m[0].plan ?? "standard", trialDaysLeft: 0 };
  }

  // 有効なトライアルか？
  const { data: t } = await sb
    .from("trials")
    .select("started_at")
    .eq("line_user_id", uid)
    .limit(1);
  if (t && t.length > 0) {
    const started = new Date(t[0].started_at).getTime();
    const left = TRIAL_DAYS - Math.floor((Date.now() - started) / 86400000);
    if (left > 0) return { active: true, plan: null, trialDaysLeft: left };
  }
  return none;
}
