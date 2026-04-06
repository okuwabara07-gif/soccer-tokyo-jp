import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { height, weight, grade, bmi, status } = await req.json()
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
          content: `ジュニアサッカー選手の体格診断コメントを80文字以内で書いてください。身長${height}cm・体重${weight}kg・${grade}・BMI${bmi}・判定:${status}。前向きなアドバイスを1つ含めてください。`
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
