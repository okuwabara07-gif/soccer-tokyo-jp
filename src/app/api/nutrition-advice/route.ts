import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { timing, position, grade } = await req.json()
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
          content: `ジュニアサッカー選手への栄養アドバイスを100文字以内で。${timing || ''}・ポジション:${position || '不明'}・${grade || ''}。具体的な食事例を1つ含めてください。`
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
