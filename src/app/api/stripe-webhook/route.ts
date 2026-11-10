import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' })

function planFromAmount(amount: number) {
  if (amount >= 4500) return 'papa_mama'
  if (amount >= 1500) return 'premium'
  return 'standard'
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  const body = await req.text()

  let event: Stripe.Event
  try {
    if (whSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, whSecret)
    } else {
      event = JSON.parse(body) as Stripe.Event // secret未設定時のフォールバック
    }
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook signature error: ${e.message}` }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = url && svc ? createClient(url, svc) : null

  try {
    // 掲載チームの有料プラン（metadata.kind === 'club'）は会員とは別に club_accounts へ反映する
    if (supabase && await handleClubEvent(supabase, event)) {
      return NextResponse.json({ received: true })
    }
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object as Stripe.Checkout.Session
      const amount = s.amount_total ?? 0
      if (supabase) {
        await supabase.from('members').upsert({
          email: s.customer_details?.email ?? null,
          plan: planFromAmount(amount),
          status: 'active',
          stripe_session_id: s.id,
          stripe_customer_id: (s.customer as string) ?? null,
          stripe_subscription_id: (s.subscription as string) ?? null,
          amount,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_session_id' })
      }
    }
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      if (supabase) {
        await supabase.from('members').update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
      }
    }
  } catch (e: any) {
    return NextResponse.json({ received: true, warn: e.message })
  }

  return NextResponse.json({ received: true })
}

import type { SupabaseClient } from '@supabase/supabase-js'
type SB = SupabaseClient

async function syncClubPlan(supabase: SB, accountId: string) {
  const { data: a } = await supabase.from('club_accounts').select('club_id,plan,trial_until,plan_status').eq('id', accountId).maybeSingle()
  const acc = a as { club_id: string | null; plan: string; trial_until: string | null; plan_status: string } | null
  if (!acc?.club_id) return
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10)
  const eff = acc.plan === 'free' && acc.trial_until && acc.trial_until >= today ? 'standard' : acc.plan
  await supabase.from('clubs').update({ partner_plan: eff }).eq('id', acc.club_id)
}

// 戻り値 true = 掲載チームのイベントとして処理した
async function handleClubEvent(supabase: SB, event: Stripe.Event): Promise<boolean> {
  const now = new Date().toISOString()
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session
    if (s.metadata?.kind !== 'club' || !s.metadata.account_id) return false
    const plan = s.metadata.plan === 'premium' ? 'premium' : 'standard'
    await supabase.from('club_accounts').update({
      plan, plan_status: 'active',
      stripe_customer_id: (s.customer as string) ?? null,
      stripe_subscription_id: (s.subscription as string) ?? null,
      updated_at: now,
    }).eq('id', s.metadata.account_id)
    await syncClubPlan(supabase, s.metadata.account_id)
    return true
  }
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    if (sub.metadata?.kind !== 'club') return false
    const { data: a } = await supabase.from('club_accounts').select('id').eq('stripe_subscription_id', sub.id).maybeSingle()
    const id = (a as { id: string } | null)?.id ?? sub.metadata.account_id
    if (!id) return true
    const ended = event.type === 'customer.subscription.deleted' || ['canceled', 'unpaid', 'incomplete_expired'].includes(sub.status)
    // 新しいAPIバージョンでは期間の終わりが items 側にある
    const raw = sub as unknown as { current_period_end?: number; items?: { data?: { current_period_end?: number }[] } }
    const periodEnd = raw.current_period_end ?? raw.items?.data?.[0]?.current_period_end
    await supabase.from('club_accounts').update({
      plan: ended ? 'free' : (sub.metadata.plan === 'premium' ? 'premium' : 'standard'),
      plan_status: ended ? 'canceled' : sub.status === 'past_due' ? 'past_due' : sub.status === 'trialing' ? 'trialing' : 'active',
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      updated_at: now,
    }).eq('id', id)
    await syncClubPlan(supabase, id)
    return true
  }
  return false
}
