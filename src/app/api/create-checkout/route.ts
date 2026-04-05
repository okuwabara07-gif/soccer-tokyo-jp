import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'jpy',
          product_data: { name: selected.name },
          unit_amount: selected.price,
          ...(plan !== 'papa_mama' && { recurring: { interval: 'month' } }),
        },
        quantity: 1,
      }],
      mode: plan === 'papa_mama' ? 'payment' : 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/member/success?plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/member`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
