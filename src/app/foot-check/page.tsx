'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRANDS_MAP = {
  wide_high: {
    recommend: ['Mizuno', 'Asics'],
    avoid: ['Nike'],
    reason: '幅広・甲高の足はミズノ・アシックスが最適。日本人の足型に合わせた設計です。',
    products: [
      { name: 'ミズノ モナルシーダ NEO II SELECT Jr', price: '¥5,500', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F' },
      { name: 'アシックス DS LIGHT Jr', price: '¥6,600', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B9%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F' },
    ]
  },
  wide_low: {
    recommend: ['Asics', 'Mizuno'],
    avoid: ['Nike', 'Adidas'],
    reason: '幅広・甲低の足はアシックスが最適。クッション性と幅広対応を両立しています。',
    products: [
      { name: 'アシックス DS LIGHT Jr', price: '¥6,600', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B9%2F' },
      { name: 'ミズノ モナルシーダ', price: '¥5,500', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%2F' },
    ]
  },
  narrow_high: {
    recommend: ['Nike', 'Adidas'],
    avoid: ['Asics'],
    reason: '細め・甲高の足はナイキのティエンポ系が最適。細身でフィット感が高いです。',
    products: [
      { name: 'ナイキ ティエンポ LEGEND 10 Jr', price: '¥7,700', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%83%86%E3%82%A3%E3%82%A8%E3%83%B3%E3%83%9D%2F' },
      { name: 'アディダス コパ PURE Jr', price: '¥8,800', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%82%B3%E3%83%91%2F' },
    ]
  },
  narrow_low: {
    recommend: ['Nike', 'Adidas', 'Puma'],
    avoid: ['Mizuno'],
    reason: '細め・甲低の足はナイキ・アディダスが最適。スリムフィットでパフォーマンスを最大化。',
    products: [
      { name: 'ナイキ ファントム Jr', price: '¥7,700', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%83%95%E3%82%A1%E3%83%B3%E3%82%BF%E3%83%A0%2F' },
      { name: 'アディダス プレデター Jr', price: '¥8,800', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%83%97%E3%83%AC%E3%83%87%E3%82%BF%E3%83%BC%2F' },
    ]
  },
  normal_high: {
    recommend: ['Mizuno', 'Puma', 'Adidas'],
    avoid: [],
    reason: '普通幅・甲高の足はミズノが最適。甲高に対応しながらバランスの良い設計です。',
    products: [
      { name: 'ミズノ レビュラ 3 SELECT Jr', price: '¥9,900', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%83%AC%E3%83%93%E3%83%A5%E3%83%A9%2F' },
      { name: 'プーマ フューチャー 7 Jr', price: '¥8,800', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%97%E3%83%BC%E3%83%9E%E3%83%95%E3%83%A5%E3%83%BC%E3%83%81%E3%83%A3%E3%83%BC%2F' },
    ]
  },
  normal_low: {
    recommend: ['Adidas', 'Puma', 'Nike'],
    avoid: [],
    reason: '普通幅・甲低の足はどのブランドも比較的合います。好みのデザインで選んでOK！',
    products: [
      { name: 'アディダス プレデター ACCURACY Jr', price: '¥8,800', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%2F' },
      { name: 'プーマ フューチャー 7 Jr', price: '¥8,800', url: 'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%97%E3%83%BC%E3%83%9E%2F' },
    ]
  },
}

const ARCH_TIPS: Record<string, string> = {
  flat: '扁平足（土踏まずが低い）はクッション性の高いシューズを選びましょう。アシックスのGELシリーズがおすすめです。',
  normal: '標準的なアーチです。どのシューズも合いやすいです。',
  high: '高アーチ（ハイアーチ）は衝撃吸収が弱くなりがちです。クッション性重視で選びましょう。',
}

export default function FootCheckPage() {
  const [step, setStep] = useState(1)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [arch, setArch] = useState('')
  const [footLength, setFootLength] = useState('')
  const [result, setResult] = useState<any>(null)

  const diagnose = () => {
    const key = `${width}_${height}` as keyof typeof BRANDS_MAP
    const res = BRANDS_MAP[key] || BRANDS_MAP.normal_low
    setResult({ ...res, arch: ARCH_TIPS[arch] || '', footLength })
    setStep(4)
  }

  const reset = () => { setStep(1); setWidth(''); setHeight(''); setArch(''); setFootLength(''); setResult(null) }

  const share = () => {
    const text = `足型診断結果：${width === 'wide' ? '幅広' : width === 'narrow' ? '細め' : '普通'}×${height === 'high' ? '甲高' : '甲低'} → おすすめは${result?.recommend?.join('・')}！ https://soccer-tokyo-jp.vercel.app/foot-check`
    if (navigator.share) navigator.share({ title: '足型診断', text })
    else { navigator.clipboard.writeText(text); alert('コピーしました！') }
  }

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/shoes" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← シューズ一覧</Link>
          <h1 style={{color:'white',fontSize:22,fontWeight:300,letterSpacing:'-0.02em',marginBottom:4}}>足型診断</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>4つの質問であなたに最適なスパイクを提案</p>
        </div>

        <div style={{padding:'12px 16px 0'}}>
          <div style={{display:'flex',gap:4,marginBottom:16}}>
            {[1,2,3,4].map(s=>(
              <div key={s} style={{flex:1,height:3,borderRadius:2,background:step>=s?'#1a1a1a':'#e8e8e4',transition:'background 0.3s'}}/>
            ))}
          </div>
        </div>

        <div style={{padding:'0 16px 16px'}}>

          {step===1 && (
            <div>
              <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:4}}>STEP 1：足の幅を教えてください</p>
              <p style={{fontSize:11,color:'#999',marginBottom:16}}>靴下を脱いで、足の一番広い部分を確認してください</p>

              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px',marginBottom:12}}>
                <p style={{fontSize:10,color:'#999',marginBottom:10,letterSpacing:'0.1em',textTransform:'uppercase'}}>足幅の確認方法</p>
                <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <div style={{width:80,height:80,background:'#f8f8f6',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <svg viewBox="0 0 60 60" width="60" height="60">
                      <ellipse cx="30" cy="40" rx="20" ry="14" fill="#e8e8e4"/>
                      <ellipse cx="30" cy="38" rx="16" ry="12" fill="#d0d0cc"/>
                      <line x1="10" y1="38" x2="50" y2="38" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="3,2"/>
                      <text x="30" y="20" textAnchor="middle" fontSize="8" fill="#666">← 幅 →</text>
                    </svg>
                  </div>
                  <div style={{fontSize:11,color:'#666',lineHeight:1.7}}>
                    紙の上に足を置き、親指の付け根〜小指の付け根の幅を測ります。<br/>
                    <span style={{color:'#999'}}>目安：EE以上 = 幅広</span>
                  </div>
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[
                  {val:'wide',label:'幅広（E〜EEE）',desc:'一般的な日本人に多い。靴の両サイドが圧迫される'},
                  {val:'normal',label:'普通（D〜E）',desc:'標準的な幅。多くのシューズが合う'},
                  {val:'narrow',label:'細め（B〜C）',desc:'スリムな足。ゆったりした靴は脱げやすい'},
                ].map(opt=>(
                  <button key={opt.val} onClick={()=>{setWidth(opt.val);setStep(2)}}
                    style={{padding:'14px',borderRadius:12,border:'1px solid #eeeeea',background:'white',textAlign:'left',cursor:'pointer'}}>
                    <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{opt.label}</p>
                    <p style={{fontSize:11,color:'#999'}}>{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step===2 && (
            <div>
              <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:4}}>STEP 2：甲の高さを教えてください</p>
              <p style={{fontSize:11,color:'#999',marginBottom:16}}>足の甲（上部）の盛り上がり具合を確認してください</p>

              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px',marginBottom:12}}>
                <p style={{fontSize:10,color:'#999',marginBottom:10,letterSpacing:'0.1em',textTransform:'uppercase'}}>甲の高さの確認方法</p>
                <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <div style={{width:80,height:80,background:'#f8f8f6',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <svg viewBox="0 0 60 60" width="60" height="60">
                      <path d="M8 45 Q15 20 35 18 Q50 18 52 35 L52 45 Z" fill="#e8e8e4"/>
                      <path d="M8 45 Q15 25 35 22 Q50 22 52 35" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
                      <line x1="35" y1="22" x2="35" y2="45" stroke="#888" strokeWidth="1" strokeDasharray="2,2"/>
                      <text x="40" y="35" fontSize="7" fill="#666">甲の高さ</text>
                    </svg>
                  </div>
                  <div style={{fontSize:11,color:'#666',lineHeight:1.7}}>
                    横から足を見て甲の盛り上がりを確認します。<br/>
                    <span style={{color:'#999'}}>紐が余る = 甲低・きつい = 甲高</span>
                  </div>
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[
                  {val:'high',label:'甲高（高い）',desc:'靴紐をきつく結ぶと圧迫感がある。ナイキは合わないことが多い'},
                  {val:'low',label:'甲低（低い・普通）',desc:'靴紐が余りやすい。多くのシューズが合う'},
                ].map(opt=>(
                  <button key={opt.val} onClick={()=>{setHeight(opt.val);setStep(3)}}
                    style={{padding:'14px',borderRadius:12,border:'1px solid #eeeeea',background:'white',textAlign:'left',cursor:'pointer'}}>
                    <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{opt.label}</p>
                    <p style={{fontSize:11,color:'#999'}}>{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step===3 && (
            <div>
              <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:4}}>STEP 3：足のサイズと土踏まず</p>
              <p style={{fontSize:11,color:'#999',marginBottom:16}}>より正確な提案のために教えてください</p>

              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,color:'#666',display:'block',marginBottom:6}}>足のサイズ (cm)</label>
                <input type="number" value={footLength} onChange={e=>setFootLength(e.target.value)}
                  placeholder="例: 23.5"
                  style={{width:'100%',padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',fontSize:14,outline:'none',background:'white'}}/>
              </div>

              <p style={{fontSize:11,color:'#666',marginBottom:8}}>土踏まずの形は？</p>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
                {[
                  {val:'flat',label:'扁平足（土踏まずが低い・ほぼない）',desc:'クッション性重視のシューズが◎'},
                  {val:'normal',label:'標準（程よい土踏まず）',desc:'どのシューズも合いやすい'},
                  {val:'high',label:'ハイアーチ（土踏まずが高い）',desc:'衝撃吸収重視のシューズが◎'},
                ].map(opt=>(
                  <button key={opt.val} onClick={()=>setArch(opt.val)}
                    style={{padding:'12px',borderRadius:12,border:`1px solid ${arch===opt.val?'#1a1a1a':'#eeeeea'}`,background:arch===opt.val?'#1a1a1a':'white',textAlign:'left',cursor:'pointer'}}>
                    <p style={{fontSize:12,fontWeight:500,color:arch===opt.val?'white':'#1a1a1a',marginBottom:1}}>{opt.label}</p>
                    <p style={{fontSize:10,color:arch===opt.val?'rgba(255,255,255,0.6)':'#999'}}>{opt.desc}</p>
                  </button>
                ))}
              </div>

              <button onClick={diagnose} disabled={!arch}
                style={{width:'100%',padding:'14px',borderRadius:12,background:arch?'#1a1a1a':'#e8e8e4',color:arch?'white':'#bbb',fontSize:13,fontWeight:500,border:'none',cursor:arch?'pointer':'not-allowed'}}>
                診断結果を見る →
              </button>
            </div>
          )}

          {step===4 && result && (
            <div>
              <div style={{background:'#0a0a0a',borderRadius:12,padding:'16px',marginBottom:12}}>
                <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',marginBottom:8}}>診断結果</p>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginBottom:10,lineHeight:1.7}}>{result.reason}</p>
                <div style={{marginBottom:8}}>
                  <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginBottom:6}}>おすすめブランド</p>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {result.recommend.map((b:string)=>(
                      <span key={b} style={{fontSize:11,padding:'4px 12px',borderRadius:10,background:'white',color:'#1a1a1a',fontWeight:500}}>{b}</span>
                    ))}
                  </div>
                </div>
                {result.avoid.length>0 && (
                  <div>
                    <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginBottom:6}}>避けた方がよいブランド</p>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {result.avoid.map((b:string)=>(
                        <span key={b} style={{fontSize:11,padding:'4px 12px',borderRadius:10,background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)'}}>{b}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {result.arch && (
                <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px 14px',marginBottom:12}}>
                  <p style={{fontSize:10,color:'#999',marginBottom:4,letterSpacing:'0.1em',textTransform:'uppercase'}}>土踏まずについて</p>
                  <p style={{fontSize:12,color:'#444',lineHeight:1.7}}>{result.arch}</p>
                </div>
              )}

              <p style={{fontSize:9,color:'#999',letterSpacing:'0.12em',marginBottom:10,textTransform:'uppercase'}}>おすすめ商品</p>
              {result.products.map((p:any)=>(
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer sponsored"
                  style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:'white',borderRadius:12,border:'1px solid #eeeeea',textDecoration:'none',marginBottom:8}}>
                  <div>
                    <p style={{fontSize:12,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{p.name}</p>
                    <p style={{fontSize:11,color:'#999'}}>{p.price}</p>
                  </div>
                  <span style={{fontSize:10,padding:'5px 12px',borderRadius:8,background:'#1a1a1a',color:'white',flexShrink:0}}>楽天で見る</span>
                </a>
              ))}

              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button onClick={reset}
                  style={{flex:1,padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',background:'white',fontSize:12,cursor:'pointer',color:'#666'}}>
                  もう一度診断する
                </button>
                <button onClick={share}
                  style={{flex:1,padding:'12px',borderRadius:10,border:'none',background:'#1a1a1a',fontSize:12,cursor:'pointer',color:'white'}}>
                  📤 結果をシェア
                </button>
              </div>

              <Link href="/shoes"
                style={{display:'block',marginTop:8,padding:'12px',borderRadius:10,background:'#f0f0ec',textAlign:'center',fontSize:12,color:'#666',textDecoration:'none'}}>
                ブランド詳細・ランキングを見る →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
