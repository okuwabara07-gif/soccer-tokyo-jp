import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, accountByManageToken, clean, manageUrl } from "@/lib/partner";

// 掲載チームの有料プラン申込（Stripe の定期課金）。金額は仮。決まったら環境変数の Price ID に切り替える。
const PRICES: Record<string, { amount: number; interval: "month" | "year"; name: string; env: string }> = {
  "standard-month": { amount: 1980, interval: "month", name: "掲載スタンダード（月払い）", env: "STRIPE_PRICE_CLUB_STANDARD_MONTH" },
  "standard-year": { amount: 19800, interval: "year", name: "掲載スタンダード（年払い）", env: "STRIPE_PRICE_CLUB_STANDARD_YEAR" },
  "premium-month": { amount: 4980, interval: "month", name: "掲載プレミアム（月払い）", env: "STRIPE_PRICE_CLUB_PREMIUM_MONTH" },
  "premium-year": { amount: 49800, interval: "year", name: "掲載プレミアム（年払い）", env: "STRIPE_PRICE_CLUB_PREMIUM_YEAR" },
};

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const sb = admin();
  const a = await accountByManageToken(sb, clean(b.manage_token, 100));
  if (!a || a.status !== "active" || !a.club_id) return NextResponse.json({ error: "掲載が始まってから申し込めます。" }, { status: 403 });
  const key = `${b.plan}-${b.interval}`;
  const p = PRICES[key];
  if (!p) return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  const plan = String(b.plan);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as never });
  const priceId = process.env[p.env];
  const meta = { kind: "club", account_id: a.id, plan };
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [priceId
      ? { price: priceId, quantity: 1 }
      : { price_data: { currency: "jpy", product_data: { name: p.name }, unit_amount: p.amount, recurring: { interval: p.interval } }, quantity: 1 }],
    ...(a.stripe_customer_id ? { customer: a.stripe_customer_id } : a.contact_email ? { customer_email: a.contact_email } : {}),
    metadata: meta,
    subscription_data: { metadata: meta },
    success_url: `${manageUrl(a.manage_token!)}&paid=1`,
    cancel_url: manageUrl(a.manage_token!),
  });
  return NextResponse.json({ url: session.url });
}
