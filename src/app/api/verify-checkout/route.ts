import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' })

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json()
    if (!session_id) return NextResponse.json({ ok: false, error: 'no session_id' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(session_id)
    // 支払い済み(subscription/paymentいずれも paid 判定)
    const paid = session.payment_status === 'paid' || session.status === 'complete'
    if (!paid) return NextResponse.json({ ok: false, error: 'not paid' }, { status: 402 })

    // プラン名を金額から復元（create-checkoutの定義と一致）
    const amount = session.amount_total ?? 0
    let plan = 'standard'
    if (amount >= 4500) plan = 'papa_mama'
    else if (amount >= 1500) plan = 'premium'
    else plan = 'standard'

    return NextResponse.json({ ok: true, plan, paid: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
