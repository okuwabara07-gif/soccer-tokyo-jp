import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    const base64 = image.replace(/^data:image\/\w+;base64,/, '')
    const mediaType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 }
            },
            {
              type: 'text',
              text: `この足の写真を分析して、サッカースパイク選びのアドバイスをしてください。
以下のJSON形式のみで返答してください（他のテキストは不要）:
{
  "analysis": "足の特徴の説明（2〜3文）",
  "footType": ["足型の特徴タグ（例：幅広、甲高、普通幅など）"],
  "recommend": ["おすすめブランド名（例：Mizuno, Asics, Nike, Adidas, Puma, New Balance）"],
  "avoid": ["避けた方がよいブランド名"],
  "reason": "このブランドをすすめる理由（2〜3文）"
}`
            }
          ]
        }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const json = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json(json)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
