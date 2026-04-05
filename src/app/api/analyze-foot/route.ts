import { NextRequest, NextResponse } from 'next/server'

const AMAZON_TAG = 'haircolorab22-22'
const RAKUTEN_ID = '5253b9ed.08f9d938.5253b9ee.e71aefe8'

const BRAND_CATALOG: Record<string, {
  position: { x: number; y: number };
  color: string;
  spikes: { name: string; priceMin: number; priceMax: number; feature: string }[];
  amazonUrl: string;
  rakutenUrl: string;
}> = {
  'Mizuno': {
    position: { x: 75, y: 35 },
    color: '#e63946',
    spikes: [
      { name: 'モナルシーダ NEO II SELECT Jr', priceMin: 5500, priceMax: 8800, feature: '甲高・幅広対応の定番' },
      { name: 'レビュラ 3 SELECT Jr', priceMin: 9900, priceMax: 14300, feature: '天然芝向け高級モデル' },
      { name: 'モナルシーダ NEO II ELITE AS', priceMin: 12100, priceMax: 18700, feature: '人工芝軽量モデル' },
    ],
    amazonUrl: `https://www.amazon.co.jp/s?k=ミズノ+サッカースパイク+ジュニア&tag=${AMAZON_TAG}`,
    rakutenUrl: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Asics': {
    position: { x: 70, y: 60 },
    color: '#457b9d',
    spikes: [
      { name: 'DS LIGHT Jr', priceMin: 6600, priceMax: 9900, feature: 'クッション×幅広の万能型' },
      { name: 'DS LIGHT WIDE Jr', priceMin: 8800, priceMax: 12100, feature: '幅広専用ワイドモデル' },
      { name: 'ULTREZZA AI Jr', priceMin: 11000, priceMax: 16500, feature: '軽量ハイパフォーマンス' },
    ],
    amazonUrl: `https://www.amazon.co.jp/s?k=アシックス+サッカースパイク+ジュニア&tag=${AMAZON_TAG}`,
    rakutenUrl: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B9%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Nike': {
    position: { x: 25, y: 20 },
    color: '#1a1a2e',
    spikes: [
      { name: 'ティエンポ LEGEND 10 CLUB Jr', priceMin: 7700, priceMax: 11000, feature: '細め甲低向け天然芝' },
      { name: 'ファントム GX CLUB Jr', priceMin: 8800, priceMax: 13200, feature: 'テクニカル操作性重視' },
      { name: 'マーキュリアル VAPOR 15 CLUB Jr', priceMin: 9900, priceMax: 15400, feature: '最軽量スピードモデル' },
    ],
    amazonUrl: `https://www.amazon.co.jp/s?k=ナイキ+サッカースパイク+ジュニア&tag=${AMAZON_TAG}`,
    rakutenUrl: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Adidas': {
    position: { x: 35, y: 30 },
    color: '#2d6a4f',
    spikes: [
      { name: 'プレデター ACCURACY.4 Jr', priceMin: 8800, priceMax: 12100, feature: 'ボールコントロール特化' },
      { name: 'コパ PURE.4 FxG Jr', priceMin: 11000, priceMax: 16500, feature: '天然皮革フィット感' },
      { name: 'X SPEEDPORTAL.4 Jr', priceMin: 9900, priceMax: 14300, feature: 'スピード×軽量' },
    ],
    amazonUrl: `https://www.amazon.co.jp/s?k=アディダス+サッカースパイク+ジュニア&tag=${AMAZON_TAG}`,
    rakutenUrl: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'Puma': {
    position: { x: 45, y: 45 },
    color: '#854F0B',
    spikes: [
      { name: 'フューチャー 7 MATCH FG/AG Jr', priceMin: 8800, priceMax: 13200, feature: 'バランス型オールラウンダー' },
      { name: 'キング PRO FG/AG Jr', priceMin: 11000, priceMax: 16500, feature: '天然皮革クラシックモデル' },
      { name: 'ウルトラ ULTIMATE FG/AG Jr', priceMin: 12100, priceMax: 17600, feature: '超軽量スピードモデル' },
    ],
    amazonUrl: `https://www.amazon.co.jp/s?k=プーマ+サッカースパイク+ジュニア&tag=${AMAZON_TAG}`,
    rakutenUrl: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%97%E3%83%BC%E3%83%9E%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
  },
  'New Balance': {
    position: { x: 80, y: 65 },
    color: '#993C1D',
    spikes: [
      { name: 'フューロン V7+ Jr', priceMin: 8800, priceMax: 13200, feature: '幅広甲高の日本人向け' },
      { name: 'テキスタ V3 Jr', priceMin: 7700, priceMax: 11000, feature: '軽量×幅広対応' },
      { name: 'アキュラ V3 Jr', priceMin: 11000, priceMax: 16500, feature: 'ハイエンド幅広モデル' },
    ],
    amazonUrl: `https://www.amazon.co.jp/s?k=ニューバランス+サッカースパイク+ジュニア&tag=${AMAZON_TAG}`,
    rakutenUrl: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%90%E3%83%A9%E3%83%B3%E3%82%B9%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F`
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
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text: `この足の写真を詳しく分析してください。JSONのみ返答：
{
  "analysis": "足の特徴（幅・甲・アーチ・つま先）3〜4文",
  "footType": ["足型タグ複数"],
  "size_advice": "サイズアドバイス1〜2文",
  "recommend": ["Mizuno","Asics","Nike","Adidas","Puma","New Balance"から複数"],
  "avoid": ["避けるブランド"],
  "reason": "推薦理由3〜4文",
  "score": {"comfort": 0-100, "speed": 0-100, "control": 0-100},
  "chartPosition": {"x": 0-100, "y": 0-100}
}`
            }
          ]
        }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const result = JSON.parse(text.replace(/```json|```/g, '').trim())

    // ブランドカタログを追加
    result.brandCatalog = Object.entries(BRAND_CATALOG).map(([name, info]) => ({
      name,
      position: info.position,
      color: info.color,
      isRecommended: (result.recommend || []).includes(name),
      isAvoid: (result.avoid || []).includes(name),
      spikes: info.spikes,
      amazonUrl: info.amazonUrl,
      rakutenUrl: info.rakutenUrl,
    }))

    result.products = (result.recommend || []).slice(0, 3).map((brand: string) => {
      const catalog = BRAND_CATALOG[brand]
      return {
        brand,
        spikes: catalog?.spikes || [],
        amazonUrl: catalog?.amazonUrl || '',
        rakutenUrl: catalog?.rakutenUrl || '',
      }
    })

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
