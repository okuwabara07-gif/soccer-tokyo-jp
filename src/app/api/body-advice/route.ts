import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { grade, height, weight, bmi, status, hDiff, wDiff, avg } = await req.json()
    const statusText = status === 'under' ? '体重が少なめ' : status === 'over' ? '体重が多め' : '理想的な体格'
    const hCompare = hDiff > 0 ? `平均より${Math.abs(hDiff)}cm高く` : hDiff < 0 ? `平均より${Math.abs(hDiff)}cm低く` : '平均と同じ身長で'
    const wCompare = wDiff > 0 ? `体重は平均より${Math.abs(wDiff)}kg多め` : wDiff < 0 ? `体重は平均より${Math.abs(wDiff)}kg少なめ` : '体重は平均と同じ'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `あなたはジュニアサッカー選手の体格診断コーチです。以下のデータをもとに、保護者向け診断コメントを300文字程度で書いてください。

データ：
- 学年: ${grade}
- 身長: ${height}cm（全国平均${avg.height}cm、${hCompare}）
- 体重: ${weight}kg（全国平均${avg.weight}kg、${wCompare}）
- BMI: ${bmi}
- 判定: ${statusText}

ルール：
- 具体的な数値を使って褒める
- 現在の体格がサッカーにどう活きるか説明
- 改善点があれば前向きに1つだけアドバイス
- 励ましの言葉で締める
- 絵文字を2〜3個使って読みやすく
- 300文字程度
- 文章のみ返答（JSONや記号不要）`
        }]
      })
    })

    const data = await response.json()
    const comment = data.content?.[0]?.text || ''
    return NextResponse.json({ comment })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
