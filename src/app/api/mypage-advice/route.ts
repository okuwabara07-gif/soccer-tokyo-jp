import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json()
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `あなたはジュニアサッカー選手を応援するコーチです。以下の選手情報をもとに、今日の前向きなアドバイスや励ましのメッセージを200文字程度で書いてください。毎回少し違う内容にしてください。絵文字を2〜3個使って明るく書いてください。

選手情報: ${context}

文章のみ返答してください。`
        }]
      })
    })
    const data = await response.json()
    const advice = data.content?.[0]?.text || ''
    return NextResponse.json({ advice })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
