import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `あなたはサッカーのルールと用語に詳しいコーチです。ジュニア選手や保護者にわかりやすく200文字程度で答えてください。絵文字を使って読みやすくしてください。\n\n質問：${question}`
        }]
      })
    })
    const data = await response.json()
    const answer = data.content?.[0]?.text || ''
    return NextResponse.json({ answer })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
