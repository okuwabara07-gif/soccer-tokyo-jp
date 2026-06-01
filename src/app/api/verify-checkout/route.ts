import { NextRequest, NextResponse } from 'next/server'
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
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_session_id' })
      } catch (e) { /* 記録失敗は会員化を妨げない */ }
    }

    return NextResponse.json({ ok: true, plan, paid: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
