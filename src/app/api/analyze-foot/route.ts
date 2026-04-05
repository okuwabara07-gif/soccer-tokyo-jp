import { NextRequest, NextResponse } from 'next/server'

const AMAZON_TAG = 'haircolorab22-22'
const RAKUTEN_ID = '5253b9ed.08f9d938.5253b9ee.e71aefe8'

const BRAND_LINKS: Record<string, { amazon: string; rakuten: string }> = {
  'Mizuno': {
    amazon: `https://www.amazon.co.jp/s?k=ミズノ+サッカースパイク&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Asics': {
    amazon: `https://www.amazon.co.jp/s?k=アシックス+サッカースパイク&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B9%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Nike': {
    amazon: `https://www.amazon.co.jp/s?k=ナイキ+サッカースパイク&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Adidas': {
    amazon: `https://www.amazon.co.jp/s?k=アディダス+サッカースパイク&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Puma': {
    amazon: `https://www.amazon.co.jp/s?k=プーマ+サッカースパイク&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%97%E3%83%BC%E3%83%9E%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'New Balance': {
    amazon: `https://www.amazon.co.jp/s?k=ニューバランス+サッカースパイク&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%90%E3%83%A9%E3%83%B3%E3%82%B9%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
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
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data }
            },
            {
              type: 'text',
              text: `この足の写真を詳しく分析して、サッカースパイク選びのアドバイスをしてください。
以下のJSON形式のみで返答してください（他のテキストは一切不要）:
{
  "analysis": "足の特徴の詳しい説明（幅・甲の高さ・アーチ・つま先の形など3〜4文）",
  "footType": ["足型タグ（例：幅広、甲高、扁平足、ハイアーチ、つま先が長い、など複数可）"],
  "size_advice": "サイズ選びのアドバイス（1〜2文）",
  "recommend": ["おすすめブランド名（Mizuno/Asics/Nike/Adidas/Puma/New Balanceから複数）"],
  "avoid": ["避けた方がよいブランド名"],
  "reason": "このブランドをすすめる詳しい理由（3〜4文）",
  "score": {"comfort": 0-100, "speed": 0-100, "control": 0-100}
}`
            }
          ]
        }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const result = JSON.parse(text.replace(/```json|```/g, '').trim())

    // アフィリエイトリンクを追加
    result.products = (result.recommend || []).slice(0, 3).map((brand: string) => ({
      brand,
      links: BRAND_LINKS[brand] || BRAND_LINKS['Mizuno']
    }))

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
