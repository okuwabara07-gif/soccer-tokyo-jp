'use client'
import { useState } from 'react'
import Link from 'next/link'

const AMAZON_TAG = 'haircolorab22-22'
const RAKUTEN_ID = '5253b9ed.08f9d938.5253b9ee.e71aefe8'

const SUPPLEMENTS = [
  {rank:1,name:'ザバス ジュニアプロテイン ココア味',brand:'明治',price:'¥2,860',per:'700g',target:'練習後',age:'U8〜U15',
    point:'成長期に必要なカルシウムも同時補給。牛乳と混ぜると飲みやすい。',tag:'売れ筋No.1',tagColor:'#c9a84c',emoji:'💪',
    amazon:`https://www.amazon.co.jp/s?k=ザバスジュニアプロテイン&tag=${AMAZON_TAG}`,
    rakuten:`https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B6%E3%83%90%E3%82%B9%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F`},
  {rank:2,name:'アミノバイタル プロ',brand:'味の素',price:'¥3,240',per:'30本',target:'練習中・後',age:'U12〜U15',
    point:'疲労回復に直結するアミノ酸を素早く補給。プロ選手も愛用。',tag:'疲労回復',tagColor:'#185FA5',emoji:'⚡',
    amazon:`https://www.amazon.co.jp/s?k=アミノバイタルプロ&tag=${AMAZON_TAG}`,
    rakuten:`https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%9F%E3%83%8E%E3%83%90%E3%82%A4%E3%82%BF%E3%83%AB%2F`},
  {rank:3,name:'カルシウム＋ビタミンD グミ',brand:'UHA味覚糖',price:'¥980',per:'60粒',target:'毎日',age:'U8〜U12',
    point:'グミタイプで子どもが毎日続けやすい。骨の強化・身長サポート。',tag:'続けやすい',tagColor:'#993556',emoji:'🦴',
    amazon:`https://www.amazon.co.jp/s?k=カルシウムグミ+子供&tag=${AMAZON_TAG}`,
    rakuten:`https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%AB%E3%83%AB%E3%82%B7%E3%82%A6%E3%83%A0%E3%82%B0%E3%83%9F%2F`},
  {rank:4,name:'ウイダーinゼリー プロテイン',brand:'森永製菓',price:'¥1,980',per:'6個',target:'試合前後',age:'U12〜U15',
    point:'持ち運びやすいゼリータイプ。試合直後15分以内の摂取に最適。',tag:'試合向き',tagColor:'#0F6E56',emoji:'🏃',
    amazon:`https://www.amazon.co.jp/s?k=ウイダーinゼリープロテイン&tag=${AMAZON_TAG}`,
    rakuten:`https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A6%E3%82%A4%E3%83%80%E3%83%BCin%E3%82%BC%E3%83%AA%E3%83%BC%2F`},
  {rank:5,name:'スポーツマルチビタミン',brand:'DHC',price:'¥1,200',per:'60日分',target:'毎朝',age:'U10〜U15',
    point:'食事で不足しがちなビタミンをまとめて補給。免疫力UP・疲労予防。',tag:'コスパ最強',tagColor:'#854F0B',emoji:'🌟',
    amazon:`https://www.amazon.co.jp/s?k=DHCマルチビタミン+スポーツ&tag=${AMAZON_TAG}`,
    rakuten:`https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2FDHC%E3%83%9E%E3%83%AB%E3%83%81%E3%83%93%E3%82%BF%E3%83%9F%E3%83%B3%2F`},
  {rank:6,name:'鉄分サプリ ジュニア',brand:'ファンケル',price:'¥1,620',per:'30日分',target:'毎日',age:'U12〜U15',
    point:'成長期の貧血予防に。特に女子選手・激しい練習をする選手に必須。',tag:'貧血予防',tagColor:'#A32D2D',emoji:'🩸',
    amazon:`https://www.amazon.co.jp/s?k=鉄分サプリ+子供&tag=${AMAZON_TAG}`,
    rakuten:`https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E9%89%84%E5%88%86%E3%82%B5%E3%83%97%E3%83%AA%2F`},
]

const SNACKS = [
  {name:'バナナ',emoji:'🍌',timing:'練習前30分',merit:'素早くエネルギー補給。消化も良い',cal:'約86kcal'},
  {name:'おにぎり（梅・鮭）',emoji:'🍙',timing:'練習前1時間',merit:'持続的なエネルギー源。塩分補給も',cal:'約170kcal'},
  {name:'カルシウムグミ',emoji:'🍬',timing:'毎日の間食',merit:'おやつ感覚でカルシウム補給',cal:'約30kcal'},
  {name:'チーズ',emoji:'🧀',timing:'おやつ',merit:'カルシウム＋タンパク質を同時補給',cal:'約70kcal'},
  {name:'ミックスナッツ',emoji:'🥜',timing:'おやつ',merit:'良質な脂質・ビタミンE・ミネラル',cal:'約180kcal'},
  {name:'ヨーグルト',emoji:'🥛',timing:'練習後・朝食',merit:'タンパク質＋カルシウム＋乳酸菌',cal:'約60kcal'},
  {name:'黒糖ビスケット',emoji:'🍪',timing:'試合前',merit:'エネルギー補給。鉄分も含む',cal:'約150kcal'},
  {name:'アーモンドチョコ',emoji:'🍫',timing:'疲労時のご褒美',merit:'カカオのポリフェノール＋ナッツ',cal:'約150kcal'},
]

const DRINKS = [
  {name:'アクエリアス',emoji:'💧',timing:'練習中',merit:'電解質補給。飲みやすい薄め設計',
    amazon:`https://www.amazon.co.jp/s?k=アクエリアス+まとめ買い&tag=${AMAZON_TAG}`},
  {name:'ポカリスエット',emoji:'🥤',timing:'練習中・後',merit:'体液に近い成分比。吸収が速い',
    amazon:`https://www.amazon.co.jp/s?k=ポカリスエット+まとめ買い&tag=${AMAZON_TAG}`},
  {name:'牛乳',emoji:'🥛',timing:'練習後・寝る前',merit:'カルシウム＋タンパク質の最強コンボ',
    amazon:`https://www.amazon.co.jp/s?k=牛乳+1L&tag=${AMAZON_TAG}`},
  {name:'麦茶',emoji:'🍵',timing:'日常・練習中',merit:'カフェインゼロ。ミネラル補給にも',
    amazon:`https://www.amazon.co.jp/s?k=麦茶+子供&tag=${AMAZON_TAG}`},
  {name:'OS-1（経口補水液）',emoji:'⚡',timing:'脱水・熱中症時',merit:'点滴に近い成分。緊急時の必需品',
    amazon:`https://www.amazon.co.jp/s?k=OS-1+経口補水液&tag=${AMAZON_TAG}`},
]

const TIMING_ADVICE = [
  {phase:'試合3日前',color:'#2d6a4f',bg:'#E1F5EE',icon:'📅',
    title:'カーボローディング期間',
    items:['炭水化物を多めに摂る（ご飯・パスタ・パン）','脂っこいものは避ける','水分をしっかり摂る（1日2L目標）']},
  {phase:'試合前日',color:'#185FA5',bg:'#E6F1FB',icon:'🌙',
    title:'消化の良い食事',
    items:['消化の良いものを食べる（うどん・おかゆ）','揚げ物・生もの・食べ慣れないものはNG','夕食は就寝3時間前まで']},
  {phase:'試合当日朝',color:'#854F0B',bg:'#FAEEDA',icon:'🌅',
    title:'試合3〜4時間前の朝食',
    items:['ご飯1.5杯＋卵＋味噌汁','バナナ1本追加でエネルギーUP','水分は500ml以上']},
  {phase:'試合直前',color:'#993C1D',bg:'#FAECE7',icon:'⚽',
    title:'キックオフ1時間前',
    items:['バナナ1本またはエネルギーゼリー','水分200〜300ml','重いものは食べない']},
  {phase:'ハーフタイム',color:'#534AB7',bg:'#EEEDFE',icon:'⏰',
    title:'15分間の補給',
    image:'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&q=80',
    items:['スポーツドリンク200ml','カットフルーツ・バナナ','アミノ酸サプリがあれば']},
  {phase:'試合直後',color:'#A32D2D',bg:'#FCEBEB',icon:'🔄',
    title:'ゴールデンタイム（30分以内）',
    items:['プロテインまたはアミノ酸を素早く摂取','おにぎり1〜2個で糖質補給','水分を十分に補給']},
]

const RANK_STYLE = [{bg:'#c9a84c',color:'white'},{bg:'#8e8e8e',color:'white'},{bg:'#8b6343',color:'white'}]

export default function NutritionPage() {
  const [tab, setTab] = useState<'timing'|'ranking'|'snack'|'drink'>('timing')

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        {/* ヒーロー画像 */}
        <div style={{position:'relative',height:180,overflow:'hidden'}}>
          <img src="https://images.unsplash.com/photo-1596463059283-da257325bab8?w=800&q=80"
            alt="ハーフタイムの栄養補給" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(10,10,10,0.92))'}}>
            <div style={{position:'absolute',bottom:16,left:16,right:16}}>
              <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none',display:'block',marginBottom:6}}>← 戻る</Link>
              <h1 style={{color:'white',fontSize:22,fontWeight:300,marginBottom:2}}>栄養・補助食品</h1>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>ジュニアサッカー選手のための栄養完全ガイド</p>
            </div>
          </div>
        </div>

        {/* 体格診断へのCTA */}
        <Link href="/body-check" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#1a1a2e',textDecoration:'none',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <span style={{fontSize:20}}>📊</span>
          <div style={{flex:1}}>
            <p style={{fontSize:12,fontWeight:600,color:'white',marginBottom:1}}>体格診断と連動した栄養アドバイス</p>
            <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>身長・体重を入力すると個別プランが表示 →</p>
          </div>
          <span style={{color:'rgba(255,255,255,0.3)',fontSize:16}}>›</span>
        </Link>

        {/* タブ */}
        <div style={{display:'flex',background:'white',borderBottom:'1px solid #eeeeea'}}>
          {([['timing','タイミング'],['ranking','サプリ'],['snack','間食・おやつ'],['drink','ドリンク']] as const).map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              style={{flex:1,padding:'11px 4px',fontSize:10,border:'none',background:'transparent',cursor:'pointer',
                borderBottom:`2px solid ${tab===key?'#1a1a1a':'transparent'}`,
                color:tab===key?'#1a1a1a':'#999'}}>
              {label}
            </button>
          ))}
        </div>

        <div style={{padding:16}}>

          {tab==='timing' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <p style={{fontSize:11,color:'#888',lineHeight:1.7,marginBottom:4}}>
                「いつ何を食べるか」がパフォーマンスを大きく左右します。試合前後の栄養タイミングを覚えましょう。
              </p>
              {TIMING_ADVICE.map((t:any)=>(
                <div key={t.phase} style={{background:t.bg,borderRadius:12,overflow:'hidden',border:`1px solid ${t.color}20`}}>
                  {t.image && (
                    <div style={{position:'relative',height:120,overflow:'hidden'}}>
                      <img src={t.image} alt={t.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent,rgba(0,0,0,0.4))'}}/>
                      <div style={{position:'absolute',bottom:8,left:12}}>
                        <span style={{fontSize:9,padding:'2px 8px',borderRadius:6,background:t.color,color:'white',fontWeight:600}}>{t.phase}</span>
                      </div>
                    </div>
                  )}
                  <div style={{padding:'14px'}}>
                    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
                      <span style={{fontSize:20}}>{t.icon}</span>
                      <div>
                        {!t.image && <p style={{fontSize:10,color:t.color,fontWeight:600,letterSpacing:'0.05em'}}>{t.phase}</p>}
                        <p style={{fontSize:13,fontWeight:700,color:'#1a1a1a'}}>{t.title}</p>
                      </div>
                    </div>
                    {t.items.map((item:string,i:number)=>(
                      <div key={i} style={{display:'flex',gap:6,marginBottom:4}}>
                        <span style={{color:t.color,fontWeight:700,fontSize:12,flexShrink:0}}>✓</span>
                        <p style={{fontSize:11,color:'#444',lineHeight:1.6}}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <a href={`https://www.amazon.co.jp/s?k=スポーツ栄養+ジュニア&tag=${AMAZON_TAG}`} target="_blank" rel="noopener noreferrer sponsored"
                style={{display:'flex',alignItems:'center',gap:10,padding:'12px',background:'#fff3cd',borderRadius:10,border:'1px solid #ffc107',textDecoration:'none'}}>
                <span style={{fontSize:20}}>📦</span>
                <p style={{fontSize:11,fontWeight:600,color:'#856404'}}>Amazonでジュニアスポーツ栄養を検索 →</p>
              </a>
            </div>
          )}

          {tab==='ranking' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <p style={{fontSize:11,color:'#888',marginBottom:4}}>ジュニアサッカー選手におすすめのサプリメントランキングです。</p>
              {SUPPLEMENTS.map((s,i)=>(
                <div key={s.rank} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px 14px'}}>
                  <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:11,fontWeight:700,flexShrink:0,
                      background:i<3?RANK_STYLE[i].bg:'#f0f0ec',color:i<3?RANK_STYLE[i].color:'#999'}}>
                      {s.rank}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                        <span style={{fontSize:9,padding:'1px 7px',borderRadius:8,background:s.tagColor+'18',color:s.tagColor,fontWeight:600}}>{s.tag}</span>
                        <span style={{fontSize:13,fontWeight:700,color:'#1a1a1a'}}>{s.price}<span style={{fontSize:9,color:'#999'}}>/{s.per}</span></span>
                      </div>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{s.emoji} {s.name}</p>
                      <p style={{fontSize:10,color:'#888',marginBottom:6}}>{s.brand} · {s.target} · {s.age}</p>
                      <p style={{fontSize:10,color:'#666',lineHeight:1.6,marginBottom:8}}>{s.point}</p>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                        <a href={s.amazon} target="_blank" rel="noopener noreferrer sponsored"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,padding:'7px',borderRadius:8,background:'#ff9900',textDecoration:'none'}}>
                          <span style={{fontSize:11}}>📦</span><span style={{fontSize:10,fontWeight:700,color:'white'}}>Amazon</span>
                        </a>
                        <a href={s.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,padding:'7px',borderRadius:8,background:'#bf0000',textDecoration:'none'}}>
                          <span style={{fontSize:11}}>🛒</span><span style={{fontSize:10,fontWeight:700,color:'white'}}>楽天</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==='snack' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <p style={{fontSize:11,color:'#888',marginBottom:4}}>サッカー選手に最適な間食・おやつを選びましょう。</p>
              <div style={{background:'#fff8e6',borderRadius:12,border:'1px solid #ffe082',padding:'12px 14px',marginBottom:4}}>
                <p style={{fontSize:11,fontWeight:600,color:'#856404',marginBottom:4}}>💡 間食の基本ルール</p>
                <p style={{fontSize:10,color:'#666',lineHeight:1.7}}>練習前は消化の良い糖質・練習後はタンパク質重視・寝る前はカルシウムを意識しましょう。</p>
              </div>
              {SNACKS.map(s=>(
                <div key={s.name} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px 14px',display:'flex',gap:12,alignItems:'center'}}>
                  <span style={{fontSize:28,flexShrink:0}}>{s.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a'}}>{s.name}</p>
                      <span style={{fontSize:10,color:'#888'}}>{s.cal}</span>
                    </div>
                    <p style={{fontSize:9,padding:'1px 7px',borderRadius:6,background:'#f0f0ec',color:'#666',display:'inline-block',marginBottom:4}}>{s.timing}</p>
                    <p style={{fontSize:10,color:'#666',lineHeight:1.5}}>{s.merit}</p>
                  </div>
                </div>
              ))}
              <a href={`https://www.amazon.co.jp/s?k=スポーツ+エネルギーゼリー&tag=${AMAZON_TAG}`} target="_blank" rel="noopener noreferrer sponsored"
                style={{display:'flex',alignItems:'center',gap:10,padding:'12px',background:'#fff3cd',borderRadius:10,border:'1px solid #ffc107',textDecoration:'none'}}>
                <span style={{fontSize:20}}>📦</span>
                <p style={{fontSize:11,fontWeight:600,color:'#856404'}}>Amazonでエネルギー補給食品を検索 →</p>
              </a>
            </div>
          )}

          {tab==='drink' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <p style={{fontSize:11,color:'#888',marginBottom:4}}>水分補給は練習・試合のパフォーマンスに直結します。</p>
              <div style={{background:'#E6F1FB',borderRadius:12,border:'1px solid #B5D4F4',padding:'12px 14px',marginBottom:4}}>
                <p style={{fontSize:11,fontWeight:600,color:'#185FA5',marginBottom:4}}>💧 水分補給の基本</p>
                <p style={{fontSize:10,color:'#444',lineHeight:1.7}}>体重の2%の水分が失われると判断力が低下します。練習前・中・後と こまめに補給することが重要です。</p>
              </div>
              {DRINKS.map(d=>(
                <div key={d.name} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px 14px'}}>
                  <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}>
                    <span style={{fontSize:28,flexShrink:0}}>{d.emoji}</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{d.name}</p>
                      <span style={{fontSize:9,padding:'1px 7px',borderRadius:6,background:'#E6F1FB',color:'#185FA5'}}>{d.timing}</span>
                    </div>
                  </div>
                  <p style={{fontSize:10,color:'#666',lineHeight:1.6,marginBottom:8}}>{d.merit}</p>
                  <a href={d.amazon} target="_blank" rel="noopener noreferrer sponsored"
                    style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px',borderRadius:8,background:'#ff9900',textDecoration:'none'}}>
                    <span style={{fontSize:12}}>📦</span>
                    <span style={{fontSize:11,fontWeight:700,color:'white'}}>Amazonでまとめ買い →</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
