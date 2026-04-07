'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRANDS = [
  {
    id:'nike', name:'Nike', logo:'🔵',
    feature:'スピード・軽量性',
    fit:'細め・低甲', surface:'人工芝・天然芝',
    color:'#0C447C',
    desc:'スピードを重視した薄くて軽いデザイン。甲が低め・細めの足向き。足の甲が高い方には窮屈に感じる場合あり。',
    strength:['軽量性No.1','スピード特化','デザイン性高い'],
    weakness:['甲高の足には窮屈','幅広の足には不向き'],
    best:'スピードタイプのFW・MF向け',
  },
  {
    id:'newbalance', name:'New Balance', logo:'🟠',
    feature:'幅広・クッション・日本人向け',
    fit:'幅広・甲高対応', surface:'天然芝・人工芝・土',
    color:'#993C1D',
    desc:'日本人の足型に合わせた幅広設計。甲高・幅広の足でも快適。クッション性が高く長時間の練習でも疲れにくい。',
    strength:['幅広対応','甲高でも快適','クッション性高い','価格帯が広い'],
    weakness:['軽量性はやや劣る','デザインが保守的'],
    best:'甲高・幅広・長時間練習の選手向け',
  },
  {
    id:'nike', name:'Nike', logo:'🔵',
    feature:'スピード・軽量性',
    fit:'細め・低甲', surface:'人工芝・天然芝',
    color:'#0C447C',
    desc:'スピードを重視した薄くて軽いデザイン。甲が低め・細めの足向き。',
    strength:['軽量性No.1','スピード特化','デザイン性'],
    weakness:['甲高の足には窮屈','幅広の足には不向き'],
    best:'スピードタイプのFW・MF向け',
  },
  {
    id:'adidas', name:'Adidas', logo:'⚫',
    feature:'ボールタッチ・フィット感',
    fit:'普通〜細め', surface:'天然芝・人工芝',
    color:'#1a1a1a',
    desc:'素足感覚のフィット感。プレデターシリーズは操作性が高い。',
    strength:['ボールタッチ良好','フィット感抜群','カラーバリエーション'],
    weakness:['幅広には不向き','価格が高め'],
    best:'テクニカルなMF・FW向け',
  },
  {
    id:'mizuno', name:'Mizuno', logo:'🔴',
    feature:'耐久性・日本人の足型',
    fit:'幅広・甲高対応', surface:'天然芝',
    color:'#A32D2D',
    desc:'日本人の足型に合わせた設計。甲高・幅広の足に最適。耐久性が高い。',
    strength:['日本人の足型対応','甲高でも快適','耐久性高い'],
    weakness:['デザインがシンプル','軽量性はやや劣る'],
    best:'甲高・幅広の日本人選手全般',
  },
  {
    id:'asics', name:'Asics', logo:'🟢',
    feature:'クッション性・走りやすさ',
    fit:'幅広対応', surface:'人工芝・土',
    color:'#0F6E56',
    desc:'クッション性と安定性を両立。長時間の練習でも疲れにくい設計。',
    strength:['クッション性高い','長時間OK','幅広対応'],
    weakness:['ボールタッチはやや劣る','重量感あり'],
    best:'DF・GK・運動量多い選手向け',
  },
  {
    id:'puma', name:'Puma', logo:'🟡',
    feature:'デザイン・バランス型',
    fit:'普通', surface:'天然芝・人工芝',
    color:'#854F0B',
    desc:'デザイン性が高くバランスが取れた1足。カラーが豊富で選びやすい。',
    strength:['デザイン豊富','バランス型','価格帯が広い'],
    weakness:['特化した強みが少ない'],
    best:'バランス重視の選手・初心者向け',
  },
]

const RANKINGS: Record<string, any[]> = {
  'U8〜U10': [
    {rank:1,name:'ミズノ モナルシーダ NEO II SELECT Jr',brand:'Mizuno',price:'¥5,500',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F',point:'軽くて履きやすい。ジュニア入門に最適。甲高対応。',type:'スパイク'},
    {rank:2,name:'アシックス DS LIGHT Jr',brand:'Asics',price:'¥6,600',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B9%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F',point:'クッション性が高く走りやすい。長時間の練習OK。',type:'スパイク'},
    {rank:3,name:'ナイキ ファントム Jr',brand:'Nike',price:'¥7,700',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F',point:'デザインがかっこいい。細め〜普通の足向け。',type:'スパイク'},
  ],
  'U12': [
    {rank:1,name:'アディダス プレデター ACCURACY.4 Jr',brand:'Adidas',price:'¥8,800',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%83%97%E3%83%AC%E3%83%87%E3%82%BF%E3%83%BC%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F',point:'ボールコントロールに優れる。テクニカルな選手に最適。',type:'スパイク'},
    {rank:2,name:'ミズノ レビュラ 3 SELECT Jr',brand:'Mizuno',price:'¥9,900',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%83%AC%E3%83%93%E3%83%A5%E3%83%A9%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F',point:'日本人の足型対応。天然芝での使用に最適。',type:'スパイク'},
    {rank:3,name:'ナイキ ティエンポ LEGEND 10 CLUB Jr',brand:'Nike',price:'¥7,700',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%83%86%E3%82%A3%E3%82%A8%E3%83%B3%E3%83%9D%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F',point:'ナイキの中では比較的幅広。天然芝向け。',type:'スパイク'},
  ],
  'U15': [
    {rank:1,name:'アディダス コパ PURE.4 FxG',brand:'Adidas',price:'¥12,100',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%82%B3%E3%83%91%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F',point:'柔らかい天然皮革。フィット感と操作性が両立。',type:'スパイク'},
    {rank:2,name:'ミズノ モナルシーダ NEO II ELITE AS',brand:'Mizuno',price:'¥14,300',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%83%A2%E3%83%8A%E3%83%AB%E3%82%B7%E3%83%BC%E3%83%80%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F',point:'人工芝対応。軽量で反発力が高い。甲高OK。',type:'トレシュー'},
    {rank:3,name:'プーマ フューチャー 7 MATCH FG/AG',brand:'Puma',price:'¥11,000',url:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%97%E3%83%BC%E3%83%9E%E3%83%95%E3%83%A5%E3%83%BC%E3%83%81%E3%83%A3%E3%83%BC%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F',point:'フィット感×デザイン性。オールラウンダー向け。',type:'スパイク'},
  ],
}

const FOOT_TYPES = [
  {id:'normal',label:'普通（標準）',desc:'どのブランドも合いやすい。好みで選んでOK'},
  {id:'wide',label:'幅広・甲高',desc:'ミズノ・アシックスが最適。ナイキは避けて'},
  {id:'narrow',label:'細め・甲低',desc:'ナイキ・アディダスが最適。フィット感重視'},
  {id:'long',label:'つま先が長い',desc:'つま先にゆとりのあるモデルを選ぶ'},
]

const RANK_STYLE = [
  {bg:'#c9a84c',color:'white'},
  {bg:'#8e8e8e',color:'white'},
  {bg:'#8b6343',color:'white'},
]

export default function ShoesPage() {
  const [tab, setTab] = useState<'ranking'|'brand'|'foot'>('ranking')
  const [ageGroup, setAgeGroup] = useState('U12')
  const [footType, setFootType] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<any>(null)

  const share = (item: any) => {
    const text = `${item.name}（${item.brand}）${item.price} - おすすめ！ → https://soccer-tokyo-jp.vercel.app/shoes`
    if (navigator.share) navigator.share({title:'シューズ情報',text})
    else { navigator.clipboard.writeText(text); alert('コピーしました！') }
  }

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← 戻る</Link>
          <h1 style={{color:'white',fontSize:22,fontWeight:300,letterSpacing:'-0.02em',marginBottom:4}}>スパイク・シューズ選び</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>世代別ランキング＆ブランド比較</p>
        </div>

        <div style={{display:'flex',background:'white',borderBottom:'1px solid #eeeeea'}}>
          {(['ranking','brand','foot'] as const).map((t,i)=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{flex:1,padding:'12px 4px',fontSize:11,border:'none',background:'transparent',cursor:'pointer',
                borderBottom:`2px solid ${tab===t?'#1a1a1a':'transparent'}`,
                color:tab===t?'#1a1a1a':'#999',letterSpacing:'0.03em'}}>
              {['ランキング','ブランド比較','足型診断'][i]}
            </button>
          ))}
        </div>

        <div style={{padding:16}}>

          {tab==='ranking' && (
            <>
              <div style={{display:'flex',gap:6,marginBottom:14}}>
                {Object.keys(RANKINGS).map(age=>(
                  <button key={age} onClick={()=>setAgeGroup(age)}
                    style={{flex:1,padding:'8px 4px',borderRadius:20,border:`1px solid ${ageGroup===age?'#1a1a1a':'#e8e8e4'}`,
                      background:ageGroup===age?'#1a1a1a':'white',color:ageGroup===age?'white':'#666',fontSize:11,cursor:'pointer'}}>
                    {age}
                  </button>
                ))}
              </div>

              {RANKINGS[ageGroup].map((item,i)=>(
                <div key={item.rank} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px',marginBottom:8}}>
                  <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                    <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:11,fontWeight:500,flexShrink:0,
                      background:i<3?RANK_STYLE[i].bg:'#f0f0ec',color:i<3?RANK_STYLE[i].color:'#999'}}>
                      {item.rank}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:3}}>
                        <span style={{fontSize:9,padding:'1px 7px',borderRadius:10,background:'#f0f0ec',color:'#666'}}>{item.brand}</span>
                        <span style={{fontSize:12,fontWeight:500,color:'#1a1a1a'}}>{item.price}</span>
                      </div>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:3}}>{item.name}</p>
                      <p style={{fontSize:10,color:'#888',marginBottom:8,lineHeight:1.5}}>{item.point}</p>
                      <div style={{display:'flex',gap:6}}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer sponsored"
                          style={{flex:1,padding:'8px',borderRadius:8,background:'#1a1a1a',color:'white',fontSize:11,textAlign:'center',textDecoration:'none'}}>
                          楽天で見る →
                        </a>
                        <button onClick={()=>share(item)}
                          style={{padding:'8px 12px',borderRadius:8,border:'1px solid #e8e8e4',background:'white',fontSize:11,cursor:'pointer',color:'#666'}}>
                          📤
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab==='brand' && (
            <>
              <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:12,textTransform:'uppercase'}}>ブランド別 特徴マップ</p>

              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:12,marginBottom:14}}>
                <div style={{position:'relative',height:220,border:'1px solid #f0f0ec',borderRadius:8,overflow:'hidden'}}>
                  <div style={{position:'absolute',top:'50%',left:0,right:0,height:'1px',background:'#e8e8e4'}}/>
                  <div style={{position:'absolute',left:'50%',top:0,bottom:0,width:'1px',background:'#e8e8e4'}}/>
                  <div style={{position:'absolute',top:4,left:'50%',transform:'translateX(-50%)',fontSize:9,color:'#999'}}>軽量・スピード重視</div>
                  <div style={{position:'absolute',bottom:4,left:'50%',transform:'translateX(-50%)',fontSize:9,color:'#999'}}>耐久・安定重視</div>
                  <div style={{position:'absolute',left:4,top:'50%',transform:'translateY(-50%)',fontSize:9,color:'#999',writingMode:'vertical-rl'}}>細め</div>
                  <div style={{position:'absolute',right:4,top:'50%',transform:'translateY(-50%)',fontSize:9,color:'#999',writingMode:'vertical-rl'}}>幅広</div>
                  {[
                    {id:'nike',x:'25%',y:'15%',name:'Nike'},
                    {id:'adidas',x:'35%',y:'20%',name:'Adidas'},
                    {id:'puma',x:'45%',y:'35%',name:'Puma'},
                    {id:'mizuno',x:'70%',y:'60%',name:'Mizuno'},
                    {id:'asics',x:'75%',y:'70%',name:'Asics'},
                  ].map(b=>{
                    const brand = BRANDS.find(br=>br.id===b.id)!
                    return (
                      <button key={b.id} onClick={()=>setSelectedBrand(brand)}
                        style={{position:'absolute',left:b.x,top:b.y,transform:'translate(-50%,-50%)',
                          padding:'4px 10px',borderRadius:12,border:`1px solid ${brand.color}`,
                          background:selectedBrand?.id===b.id?brand.color:'white',
                          color:selectedBrand?.id===b.id?'white':brand.color,
                          fontSize:10,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap'}}>
                        {b.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedBrand && (
                <div style={{background:'white',borderRadius:12,border:`1.5px solid ${selectedBrand.color}`,padding:'14px 16px',marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <h2 style={{fontSize:16,fontWeight:500,color:'#1a1a1a'}}>{selectedBrand.name}</h2>
                    <span style={{fontSize:9,padding:'2px 8px',borderRadius:10,background:selectedBrand.color+'18',color:selectedBrand.color,fontWeight:500}}>
                      {selectedBrand.feature}
                    </span>
                  </div>
                  <p style={{fontSize:12,color:'#666',marginBottom:10,lineHeight:1.6}}>{selectedBrand.desc}</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
                    <div style={{background:'#f8f8f6',borderRadius:8,padding:'8px 10px'}}>
                      <p style={{fontSize:9,color:'#999',marginBottom:4}}>足型</p>
                      <p style={{fontSize:11,color:'#1a1a1a'}}>{selectedBrand.fit}</p>
                    </div>
                    <div style={{background:'#f8f8f6',borderRadius:8,padding:'8px 10px'}}>
                      <p style={{fontSize:9,color:'#999',marginBottom:4}}>対応グラウンド</p>
                      <p style={{fontSize:11,color:'#1a1a1a'}}>{selectedBrand.surface}</p>
                    </div>
                  </div>
                  <div style={{marginBottom:8}}>
                    <p style={{fontSize:9,color:'#999',marginBottom:4}}>強み</p>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {selectedBrand.strength.map((s:string)=>(
                        <span key={s} style={{fontSize:9,padding:'2px 7px',borderRadius:10,background:'#f0f7f0',color:'#2d6a2d'}}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{fontSize:9,color:'#999',marginBottom:4}}>注意点</p>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {selectedBrand.weakness.map((w:string)=>(
                        <span key={w} style={{fontSize:9,padding:'2px 7px',borderRadius:10,background:'#fff0f0',color:'#c0392b'}}>{w}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!selectedBrand && (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {BRANDS.map(b=>(
                    <button key={b.id} onClick={()=>setSelectedBrand(b)}
                      style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px 14px',
                        textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div>
                        <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{b.name}</p>
                        <p style={{fontSize:10,color:'#999'}}>{b.best}</p>
                      </div>
                      <span style={{fontSize:9,padding:'2px 8px',borderRadius:10,background:b.color+'18',color:b.color}}>{b.feature}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab==='foot' && (
            <div>
              <a href="/foot-camera"
                style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0a0a0a',borderRadius:12,padding:'14px 16px',marginBottom:14,textDecoration:'none'}}>
                <div>
                  <p style={{fontSize:13,fontWeight:500,color:'white',marginBottom:2}}>📷 カメラで足型を診断する</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>写真を撮るだけ・AIが最適シューズを提案</p>
                </div>
                <span style={{fontSize:16,color:'rgba(255,255,255,0.4)'}}>›</span>
              </a>

              <div style={{background:'#1a1a1a',borderRadius:12,padding:'14px 16px',marginBottom:14}}>
                <p style={{fontSize:12,fontWeight:500,color:'white',marginBottom:4}}>足型からシューズを選ぼう</p>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',lineHeight:1.6}}>甲の高さ・幅によって合うブランドが大きく変わります。</p>
              </div>

              <p style={{fontSize:10,color:'#999',letterSpacing:'0.15em',marginBottom:10}}>お子さんの足型を選んでください</p>

              {FOOT_TYPES.map(ft=>(
                <button key={ft.id} onClick={()=>setFootType(ft.id)}
                  style={{width:'100%',background:'white',borderRadius:12,
                    border:`1px solid ${footType===ft.id?'#1a1a1a':'#eeeeea'}`,
                    padding:'12px 14px',textAlign:'left',cursor:'pointer',marginBottom:8,
                    borderLeftWidth:footType===ft.id?4:1}}>
                  <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:3}}>{ft.label}</p>
                  <p style={{fontSize:11,color:'#888'}}>{ft.desc}</p>
                </button>
              ))}

              {footType && (
                <div style={{background:'#f0f7f0',borderRadius:12,border:'1px solid #c8e6c9',padding:'14px 16px',marginTop:4}}>
                  <p style={{fontSize:11,fontWeight:500,color:'#2d6a2d',marginBottom:8}}>おすすめブランド</p>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                    {footType==='wide' && ['Mizuno','Asics','New Balance'].map(b=>(
                      <button key={b} onClick={()=>{setTab('brand');setSelectedBrand(BRANDS.find(br=>br.name===b))}}
                        style={{padding:'6px 14px',borderRadius:10,border:'none',background:'#2d6a2d',color:'white',fontSize:11,cursor:'pointer'}}>{b}</button>
                    ))}
                    {footType==='narrow' && ['Nike','Adidas'].map(b=>(
                      <button key={b} onClick={()=>{setTab('brand');setSelectedBrand(BRANDS.find(br=>br.name===b))}}
                        style={{padding:'6px 14px',borderRadius:10,border:'none',background:'#2d6a2d',color:'white',fontSize:11,cursor:'pointer'}}>{b}</button>
                    ))}
                    {footType==='normal' && ['Adidas','Puma','Mizuno'].map(b=>(
                      <button key={b} onClick={()=>{setTab('brand');setSelectedBrand(BRANDS.find(br=>br.name===b))}}
                        style={{padding:'6px 14px',borderRadius:10,border:'none',background:'#2d6a2d',color:'white',fontSize:11,cursor:'pointer'}}>{b}</button>
                    ))}
                    {footType==='long' && ['Mizuno','Asics'].map(b=>(
                      <button key={b} onClick={()=>{setTab('brand');setSelectedBrand(BRANDS.find(br=>br.name===b))}}
                        style={{padding:'6px 14px',borderRadius:10,border:'none',background:'#2d6a2d',color:'white',fontSize:11,cursor:'pointer'}}>{b}</button>
                    ))}
                  </div>
                  <Link href="/shoes" onClick={()=>setTab('ranking')}
                    style={{fontSize:11,color:'#2d6a2d',textDecoration:'none'}}>ランキングを見る →</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* サッカー用品 Amazon購入リンク */}
      <div style={{padding:'0 16px 24px'}}>
        <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',marginBottom:12}}>SOCCER GOODS</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
          <a href="https://www.amazon.co.jp/s?k=%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF&tag=haircolorab22-22"
            target="_blank" rel="noopener noreferrer sponsored"
            style={{padding:'14px 8px',borderRadius:12,background:'#111',
              border:'1px solid rgba(255,180,0,0.3)',textDecoration:'none',textAlign:'center',display:'block'}}>
            <span style={{fontSize:28,display:'block',marginBottom:4}}>👟</span>
            <p style={{fontSize:11,color:'white',fontWeight:700,marginBottom:2}}>スパイク</p>
            <p style={{fontSize:9,color:'#FF9900'}}>Amazonで探す</p>
          </a>
          <a href="https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%AB%205%E5%8F%B7%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22"
            target="_blank" rel="noopener noreferrer sponsored"
            style={{padding:'14px 8px',borderRadius:12,background:'#111',
              border:'1px solid rgba(255,180,0,0.3)',textDecoration:'none',textAlign:'center',display:'block'}}>
            <span style={{fontSize:28,display:'block',marginBottom:4}}>⚽</span>
            <p style={{fontSize:11,color:'white',fontWeight:700,marginBottom:2}}>サッカーボール</p>
            <p style={{fontSize:9,color:'#FF9900'}}>Amazonで探す</p>
          </a>
          <a href="https://www.amazon.co.jp/s?k=%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E3%83%A6%E3%83%8B%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%20%E4%B8%8A%E4%B8%8B%E3%82%BB%E3%83%83%E3%83%88&tag=haircolorab22-22"
            target="_blank" rel="noopener noreferrer sponsored"
            style={{padding:'14px 8px',borderRadius:12,background:'#111',
              border:'1px solid rgba(255,180,0,0.3)',textDecoration:'none',textAlign:'center',display:'block'}}>
            <span style={{fontSize:28,display:'block',marginBottom:4}}>👕</span>
            <p style={{fontSize:11,color:'white',fontWeight:700,marginBottom:2}}>ユニフォーム</p>
            <p style={{fontSize:9,color:'#FF9900'}}>Amazonで探す</p>
          </a>
          <a href="https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E5%AF%A9%E5%88%A4%20%E3%82%B0%E3%83%83%E3%82%BA%20%E3%83%9B%E3%82%A4%E3%83%83%E3%82%B9%E3%83%AB%20%E3%83%95%E3%83%A9%E3%83%83%E3%82%B0&tag=haircolorab22-22"
            target="_blank" rel="noopener noreferrer sponsored"
            style={{padding:'14px 8px',borderRadius:12,background:'#111',
              border:'1px solid rgba(255,180,0,0.3)',textDecoration:'none',textAlign:'center',display:'block'}}>
            <span style={{fontSize:28,display:'block',marginBottom:4}}>🚩</span>
            <p style={{fontSize:11,color:'white',fontWeight:700,marginBottom:2}}>審判グッズ</p>
            <p style={{fontSize:9,color:'#FF9900'}}>Amazonで探す</p>
          </a>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <a href="https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E3%81%99%E3%81%AD%E5%BD%93%E3%81%A6%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22"
            target="_blank" rel="noopener noreferrer sponsored"
            style={{padding:'14px 8px',borderRadius:12,background:'#111',
              border:'1px solid rgba(255,180,0,0.3)',textDecoration:'none',textAlign:'center',display:'block'}}>
            <span style={{fontSize:28,display:'block',marginBottom:4}}>🦵</span>
            <p style={{fontSize:11,color:'white',fontWeight:700,marginBottom:2}}>すね当て</p>
            <p style={{fontSize:9,color:'#FF9900'}}>Amazonで探す</p>
          </a>
          <a href="https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E3%82%BD%E3%83%83%E3%82%AF%E3%82%B9%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22"
            target="_blank" rel="noopener noreferrer sponsored"
            style={{padding:'14px 8px',borderRadius:12,background:'#111',
              border:'1px solid rgba(255,180,0,0.3)',textDecoration:'none',textAlign:'center',display:'block'}}>
            <span style={{fontSize:28,display:'block',marginBottom:4}}>🧦</span>
            <p style={{fontSize:11,color:'white',fontWeight:700,marginBottom:2}}>ソックス</p>
            <p style={{fontSize:9,color:'#FF9900'}}>Amazonで探す</p>
          </a>
        </div>
        <p style={{fontSize:'9px',color:'rgba(255,255,255,0.2)',textAlign:'center',marginTop:10}}>PR・Amazonアソシエイト</p>
      </div>
    </main>
  )
}
