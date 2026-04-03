'use client'
import Link from 'next/link'

const RANKING = [
  {
    rank:1, name:'ウイダーinゼリー プロテイン', brand:'森永製菓', price:'¥1,980/6個',
    nutrient:'タンパク質', target:'試合前後', age:'U12〜U15',
    rating:4.8, review:234,
    point:'持ち運びやすいゼリータイプ。試合直後15分以内の摂取に最適。',
    url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A6%E3%82%A4%E3%83%80%E3%83%BCin%E3%82%BC%E3%83%AA%E3%83%BC%2F',
    tag:'売れ筋No.1', tagColor:'#c9a84c'
  },
  {
    rank:2, name:'ジュニアプロテイン ココア味', brand:'ザバス', price:'¥2,860/700g',
    nutrient:'タンパク質・カルシウム', target:'練習後', age:'U8〜U15',
    rating:4.7, review:412,
    point:'成長期に必要なカルシウムも同時補給。牛乳と混ぜると飲みやすい。',
    url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B6%E3%83%90%E3%82%B9%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F',
    tag:'ジュニア特化', tagColor:'#2d6a2d'
  },
  {
    rank:3, name:'アミノバイタル プロ', brand:'味の素', price:'¥3,240/30本',
    nutrient:'BCAA・アミノ酸', target:'練習中・後', age:'U12〜U15',
    rating:4.6, review:189,
    point:'疲労回復に直結するアミノ酸を素早く補給。プロ選手も愛用。',
    url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%9F%E3%83%8E%E3%83%90%E3%82%A4%E3%82%BF%E3%83%AB%2F',
    tag:'疲労回復', tagColor:'#185FA5'
  },
  {
    rank:4, name:'カルシウム＋ビタミンD グミ', brand:'UHA味覚糖', price:'¥980/60粒',
    nutrient:'カルシウム・ビタミンD', target:'毎日', age:'U8〜U12',
    rating:4.5, review:328,
    point:'グミタイプで子どもが毎日続けやすい。骨の強化・身長サポート。',
    url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%AB%E3%83%AB%E3%82%B7%E3%82%A6%E3%83%A0%E3%82%B0%E3%83%9F%2F',
    tag:'続けやすい', tagColor:'#993556'
  },
  {
    rank:5, name:'スポーツマルチビタミン', brand:'DHC', price:'¥1,200/60日分',
    nutrient:'ビタミン全般', target:'毎朝', age:'U10〜U15',
    rating:4.4, review:156,
    point:'食事で不足しがちなビタミンをまとめて補給。免疫力UP・疲労予防。',
    url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2FDHC%E3%83%9E%E3%83%AB%E3%83%81%E3%83%93%E3%82%BF%E3%83%9F%E3%83%B3%2F',
    tag:'コスパ最強', tagColor:'#854F0B'
  },
  {
    rank:6, name:'鉄分サプリ ジュニア', brand:'ファンケル', price:'¥1,620/30日分',
    nutrient:'鉄分', target:'毎日', age:'U12〜U15（特に女子）',
    rating:4.3, review:98,
    point:'成長期の貧血予防に。特に女子選手・激しい練習をする選手に必須。',
    url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E9%89%84%E5%88%86%E3%82%B5%E3%83%97%E3%83%AA%2F',
    tag:'貧血予防', tagColor:'#A32D2D'
  },
]

const NUTRIENTS = [
  { name:'タンパク質', emoji:'💪', desc:'筋肉の材料。練習後30分以内に摂取', foods:'鶏胸肉・卵・豆腐・プロテイン', rankNos:[1,2] },
  { name:'炭水化物', emoji:'🍚', desc:'エネルギー源。試合前日〜当日に重要', foods:'白ご飯・パスタ・バナナ・エネルギーゼリー', rankNos:[] },
  { name:'カルシウム', emoji:'🦴', desc:'骨・歯の強化。成長期に特に重要', foods:'牛乳・ヨーグルト・小魚・チーズ', rankNos:[2,4] },
  { name:'鉄分', emoji:'🩸', desc:'貧血予防・持久力向上', foods:'レバー・ほうれん草・あさり', rankNos:[6] },
  { name:'BCAA', emoji:'⚡', desc:'筋肉疲労の軽減・素早い回復', foods:'肉・魚・アミノ酸サプリ', rankNos:[3] },
  { name:'ビタミンD', emoji:'☀️', desc:'カルシウムの吸収促進・免疫力UP', foods:'鮭・きのこ・日光浴', rankNos:[4,5] },
]

const RANK_STYLE = [
  {bg:'#c9a84c',color:'white'},
  {bg:'#8e8e8e',color:'white'},
  {bg:'#8b6343',color:'white'},
]

export default function NutritionPage() {
  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← 戻る</Link>
          <h1 style={{color:'white',fontSize:22,fontWeight:300,letterSpacing:'-0.02em',marginBottom:4}}>栄養・補助食品</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>ジュニアサッカー選手のための栄養ガイド</p>
        </div>

        <div style={{padding:'16px'}}>

          <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 16px',marginBottom:16}}>
            <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:10,textTransform:'uppercase'}}>栄養素別ガイド</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {NUTRIENTS.map(n=>(
                <div key={n.name} style={{background:'#f8f8f6',borderRadius:8,padding:'10px 12px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                    <span style={{fontSize:16}}>{n.emoji}</span>
                    <span style={{fontSize:12,fontWeight:500,color:'#1a1a1a'}}>{n.name}</span>
                  </div>
                  <p style={{fontSize:10,color:'#888',lineHeight:1.5,marginBottom:4}}>{n.desc}</p>
                  <p style={{fontSize:9,color:'#bbb'}}>{n.foods}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:12,textTransform:'uppercase'}}>補助食品ランキング TOP6</p>

          {RANKING.map((item,i)=>(
            <a key={item.rank} href={item.url} target="_blank" rel="noopener noreferrer sponsored"
              style={{display:'flex',gap:12,background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px',marginBottom:8,textDecoration:'none',alignItems:'flex-start'}}>
              <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:500,flexShrink:0,
                background:i<3?RANK_STYLE[i].bg:'#f0f0ec',color:i<3?RANK_STYLE[i].color:'#999'}}>
                {item.rank}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:3}}>
                  <div>
                    <span style={{fontSize:9,padding:'1px 7px',borderRadius:10,fontWeight:500,marginRight:4,
                      background:item.tagColor+'18',color:item.tagColor}}>{item.tag}</span>
                  </div>
                  <span style={{fontSize:11,color:'#1a1a1a',fontWeight:500}}>{item.price}</span>
                </div>
                <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{item.name}</p>
                <p style={{fontSize:10,color:'#999',marginBottom:4}}>{item.brand} · {item.target} · {item.age}</p>
                <p style={{fontSize:10,color:'#666',lineHeight:1.6,marginBottom:6}}>{item.point}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:4}}>
                    <span style={{fontSize:9,padding:'2px 7px',borderRadius:10,background:'#f0f7f0',color:'#2d6a2d'}}>{item.nutrient}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:3}}>
                    <span style={{fontSize:10,color:'#c9a84c'}}>{'★'.repeat(Math.floor(item.rating))}</span>
                    <span style={{fontSize:10,color:'#999'}}>{item.rating}（{item.review}件）</span>
                  </div>
                </div>
              </div>
            </a>
          ))}

          <div style={{background:'#1a1a1a',borderRadius:12,padding:'14px 16px',marginTop:8}}>
            <p style={{fontSize:11,fontWeight:500,color:'white',marginBottom:8}}>試合・練習別 摂取タイミング</p>
            {[
              ['試合3時間前','おにぎり・うどん・バナナで炭水化物補給'],
              ['試合1時間前','エネルギーゼリー・アミノ酸で最終調整'],
              ['試合直後15分','プロテイン・アミノ酸でゴールデンタイム'],
              ['就寝前','カルシウム・成長ホルモンの分泌を促す'],
            ].map(([t,d])=>(
              <div key={t} style={{display:'flex',gap:10,marginBottom:6}}>
                <span style={{fontSize:10,color:'rgba(255,255,255,0.4)',flexShrink:0,minWidth:80}}>{t}</span>
                <span style={{fontSize:10,color:'rgba(255,255,255,0.7)',lineHeight:1.5}}>{d}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  )
}
