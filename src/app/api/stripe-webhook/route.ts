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
