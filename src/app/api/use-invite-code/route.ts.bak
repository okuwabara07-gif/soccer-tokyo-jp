import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code) return NextResponse.json({error:'コードを入力してください'},{status:400})

  // コード確認
  const { data: invite, error } = await supabase
    .from('invite_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (error || !invite) return NextResponse.json({error:'無効または期限切れのコードです'},{status:400})
  if (invite.used_count >= invite.max_uses) return NextResponse.json({error:'このコードは使用上限に達しています'},{status:400})

  // 使用回数を更新
  await supabase.from('invite_codes').update({used_count: invite.used_count + 1}).eq('id', invite.id)

  return NextResponse.json({success:true, message:'招待コードが適用されました'})
}
