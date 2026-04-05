import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { answers, teams, prefecture } = await req.json()

    const answerText = Object.entries(answers).map(([k,v]) => `${k}:${v}`).join('、')
    const teamList = teams.slice(0, 20).map((t:any) => `${t.name}(${t.area}・${t.category})`).join('、')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `あなたはジュニアサッカーチーム選びのアドバイザーです。
保護者の希望条件とチームリストをもとに、最適なチームを3つ選んでJSONで返してください。

保護者の希望: ${answerText}
エリア: ${prefecture}
チームリスト: ${teamList}

以下のJSON形式のみで返答してください:
{
  "advice": "総合アドバイス（150文字程度）",
  "recommended": [
    {"name": "チーム名", "area": "エリア", "category": "カテゴリ", "reason": "このチームをすすめる理由（50文字）"},
    {"name": "チーム名", "area": "エリア", "category": "カテゴリ", "reason": "理由"},
    {"name": "チーム名", "area": "エリア", "category": "カテゴリ", "reason": "理由"}
  ]
}`
        }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const result = JSON.parse(text.replace(/\`\`\`json|\`\`\`/g, '').trim())
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ advice: 'チーム情報を確認中です。', recommended: [] }, { status: 200 })
  }
}
