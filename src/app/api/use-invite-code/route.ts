export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const s = await getSession()
  if (!s) return NextResponse.json({ error: 'LINEログインが必要です' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { code } = await req.json()
  if (!code) return NextResponse.json({ error: 'コードを入力してください' }, { status: 400 })

  const { data: invite, error } = await supabase
    .from('invite_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (error || !invite) return NextResponse.json({ error: '無効または期限切れのコードです' }, { status: 400 })
  if (invite.used_count >= invite.max_uses) return NextResponse.json({ error: 'このコードは使用上限に達しています' }, { status: 400 })

  await supabase.from('invite_codes').update({ used_count: invite.used_count + 1 }).eq('id', invite.id)

  // ログインユーザーをサーバー側でプレミアム会員として記録
  await supabase.from('members').upsert({
    line_user_id: s.uid,
    plan: 'premium',
    status: 'active',
    stripe_session_id: `invite_${code}_${s.uid}`,
    amount: 0,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'stripe_session_id' })

  return NextResponse.json({ success: true, message: '招待コードが適用されました' })
}
