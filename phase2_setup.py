#!/usr/bin/env python3
# Phase 2: 会員/トライアルのサーバー判定 + checkout への line_user_id 紐付け。
# 使い方: リポジトリ直下で  python3 phase2_setup.py  → npm run build
import pathlib
ROOT = pathlib.Path.cwd()
FILES = {}

# 会員/トライアルのサーバー判定ヘルパ（gateはこれを使う）
FILES["src/lib/membership.ts"] = r'''import { createClient } from "@supabase/supabase-js";

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
'''

# トライアル開始（localStorage廃止・サーバー保存）
FILES["src/app/api/trial/start/route.ts"] = r'''import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, error: "not logged in" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "no service key" }, { status: 500 });
  const sb = createClient(url, key, { auth: { persistSession: false } });
  // 既にあれば二重開始しない
  await sb.from("trials").upsert({ line_user_id: s.uid }, { onConflict: "line_user_id", ignoreDuplicates: true });
  return NextResponse.json({ ok: true });
}
'''

# クライアント/ゲートが会員状態を取得する口
FILES["src/app/api/membership/route.ts"] = r'''import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMembership } from "@/lib/membership";

export async function GET() {
  const s = await getSession();
  const mem = await getMembership(s?.uid);
  return NextResponse.json(mem);
}
'''

# create-checkout：セッションCookieのuidをStripe metadataへ（クライアントから渡さない＝改ざん不可）
FILES["src/app/api/create-checkout/route.ts"] = r'''import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession } from '@/lib/session'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' })

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json()

    const plans: Record<string, { price: number; name: string }> = {
      standard: { price: 500, name: 'スタンダードプラン（月¥500）' },
      premium: { price: 1500, name: 'プレミアムプラン（月¥1,500）' },
      papa_mama: { price: 4500, name: 'パパママ応援プラン（6ヶ月¥4,500）' },
    }

    const selected = plans[plan]
    if (!selected) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const sess = await getSession()
    const lineUserId = sess?.uid ?? ''
    const isSub = plan !== 'papa_mama'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'jpy',
          product_data: { name: selected.name },
          unit_amount: selected.price,
          ...(isSub && { recurring: { interval: 'month' } }),
        },
        quantity: 1,
      }],
      mode: isSub ? 'subscription' : 'payment',
      metadata: { line_user_id: lineUserId, plan },
      ...(isSub && { subscription_data: { metadata: { line_user_id: lineUserId, plan } } }),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/member/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/member`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
'''

# verify-checkout：metadataのline_user_idをmembersに書き込み
FILES["src/app/api/verify-checkout/route.ts"] = r'''import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' })

function planFromAmount(amount: number) {
  if (amount >= 4500) return 'papa_mama'
  if (amount >= 1500) return 'premium'
  return 'standard'
}

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json()
    if (!session_id) return NextResponse.json({ ok: false, error: 'no session_id' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(session_id)
    const paid = session.payment_status === 'paid' || session.status === 'complete'
    if (!paid) return NextResponse.json({ ok: false, error: 'not paid' }, { status: 402 })

    const amount = session.amount_total ?? 0
    const plan = planFromAmount(amount)
    const lineUserId = (session.metadata?.line_user_id as string) || null

    // membersへ記録（service_roleキーがあれば。無ければ検証のみで継続）
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && svc) {
      try {
        const supabase = createClient(url, svc)
        await supabase.from('members').upsert({
          email: session.customer_details?.email ?? null,
          plan,
          status: 'active',
          stripe_session_id: session.id,
          stripe_customer_id: (session.customer as string) ?? null,
          stripe_subscription_id: (session.subscription as string) ?? null,
          amount,
          line_user_id: lineUserId,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_session_id' })
      } catch (e) { /* 記録失敗は会員化を妨げない */ }
    }

    return NextResponse.json({ ok: true, plan, paid: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
'''

written = []
for rel, content in FILES.items():
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    written.append(rel)
for w in written:
    print("OK:", w)
print("OK: Phase2 files written (", len(written), "files )")
