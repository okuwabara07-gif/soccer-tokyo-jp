'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MyPage() {
  const [memberPlan, setMemberPlan] = useState<string|null>(null)
  const [trialDaysLeft, setTrialDaysLeft] = useState<number|null>(null)
  const [aiAdvice, setAiAdvice] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [footResult, setFootResult] = useState<any>(null)
  const [bodyResult, setBodyResult] = useState<any>(null)
  const [childName, setChildName] = useState('')
  const [childGrade, setChildGrade] = useState('')
  const [tab, setTab] = useState<'home'|'status'|'settings'>('home')

  useEffect(() => {
    const plan = localStorage.getItem('memberPlan')
    setMemberPlan(plan)
    const trialStart = localStorage.getItem('trialStart')
    if (!plan && trialStart) {
      const days = Math.floor((Date.now() - new Date(trialStart).getTime()) / (1000*60*60*24))
      setTrialDaysLeft(Math.max(0, 3 - days))
    } else if (!plan && !trialStart) {
      setTrialDaysLeft(null)
    }
    const savedName = localStorage.getItem('childName')
    const savedGrade = localStorage.getItem('childGrade')
    if (savedName) setChildName(savedName)
    if (savedGrade) setChildGrade(savedGrade)
    const foot = localStorage.getItem('footDiagnosis')
    if (foot) { try { setFootResult(JSON.parse(foot)) } catch {} }
    const body = localStorage.getItem('bodyDiagnosis')
    if (body) { try { setBodyResult(JSON.parse(body)) } catch {} }
    fetchAdvice(savedName||'', savedGrade||'', foot, body)
  }, [])

  const fetchAdvice = async (name:string, grade:string, foot:string|null, body:string|null) => {
    setAiLoading(true)
    try {
      const ctx = []
      if (name) ctx.push(`選手名:${name}`)
      if (grade) ctx.push(`学年:${grade}`)
      if (foot) { try { const f=JSON.parse(foot); ctx.push(`足型:${(f.footType||[]).join('・')}`) } catch {} }
      if (body) { try { const b=JSON.parse(body); ctx.push(`身長${b.h}cm体重${b.w}kg`) } catch {} }
      const res = await fetch('/api/mypage-advice', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({context: ctx.join('、') || 'ジュニアサッカー選手'})
      })
      const data = await res.json()
      setAiAdvice(data.advice || '')
    } catch {}
    setAiLoading(false)
  }

  const startTrial = () => {
    localStorage.setItem('trialStart', new Date().toISOString())
    setTrialDaysLeft(3)
  }

  const isActive = !!(memberPlan || (trialDaysLeft !== null && trialDaysLeft > 0))

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{position:'relative',height:200,overflow:'hidden'}}>
          <img src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"
            alt="マイページ" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(10,10,10,0.95))'}}>
            <div style={{position:'absolute',top:14,left:16}}>
              <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none'}}>← ホーム</Link>
            </div>
            <div style={{position:'absolute',bottom:16,left:16,right:16,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
              <div>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:9,letterSpacing:'0.15em',marginBottom:4}}>MY PAGE</p>
                <p style={{color:'white',fontSize:20,fontWeight:700,marginBottom:4}}>{childName?`${childName}選手`:'マイページ'}</p>
                {childGrade && <p style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>{childGrade}</p>}
              </div>
              <div style={{textAlign:'right'}}>
                {memberPlan ? (
                  <div style={{background:'#FFD700',borderRadius:8,padding:'4px 10px'}}>
                    <p style={{fontSize:9,fontWeight:700,color:'#1a1a1a'}}>PREMIUM</p>
                    <p style={{fontSize:10,color:'#1a1a1a'}}>{memberPlan}</p>
                  </div>
                ) : trialDaysLeft !== null && trialDaysLeft > 0 ? (
                  <div style={{background:'rgba(255,255,255,0.15)',borderRadius:8,padding:'4px 10px',border:'1px solid rgba(255,255,255,0.3)'}}>
                    <p style={{fontSize:9,color:'rgba(255,255,255,0.6)'}}>お試し中</p>
                    <p style={{fontSize:13,fontWeight:700,color:'white'}}>残り{trialDaysLeft}日</p>
                  </div>
                ) : (
                  <Link href="/member" style={{display:'block',background:'#FFD700',borderRadius:8,padding:'6px 12px',textDecoration:'none'}}>
                    <p style={{fontSize:10,fontWeight:700,color:'#1a1a1a'}}>登録する</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {!memberPlan && trialDaysLeft === null && (
          <div style={{margin:'12px 16px 0',borderRadius:12,overflow:'hidden'}}>
            <div style={{position:'relative',height:90}}>
              <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80"
                alt="お試し" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.72)',display:'flex',alignItems:'center',padding:'0 14px',gap:10}}>
                <div style={{flex:1}}>
                  <p style={{color:'#FFD700',fontSize:12,fontWeight:700,marginBottom:2}}>🎁 3日間無料お試し</p>
                  <p style={{color:'rgba(255,255,255,0.65)',fontSize:10}}>登録不要・カード不要で全機能を体験</p>
                </div>
                <button onClick={startTrial}
                  style={{padding:'8px 14px',borderRadius:8,background:'#FFD700',border:'none',
                    color:'#1a1a1a',fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}}>
                  今すぐ試す
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{display:'flex',background:'#111',borderBottom:'1px solid rgba(255,255,255,0.08)',marginTop:12}}>
          {(['home','status','settings'] as const).map((key)=>{
            const labels = {home:'ホーム',status:'ステータス',settings:'設定'}
            return (
              <button key={key} onClick={()=>setTab(key)}
                style={{flex:1,padding:'11px',fontSize:11,border:'none',background:'transparent',cursor:'pointer',
                  borderBottom:`2px solid ${tab===key?'#FFD700':'transparent'}`,
                  color:tab===key?'#FFD700':'rgba(255,255,255,0.35)',fontWeight:tab===key?600:400}}>
                {labels[key]}
              </button>
            )
          })}
        </div>

        <div style={{padding:16}}>

          {tab==='home' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>

              <div style={{borderRadius:14,overflow:'hidden'}}>
                <div style={{position:'relative',height:130}}>
                  <img src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80"
                    alt="アドバイス" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.72)',padding:'14px'}}>
                    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
                      <div style={{width:26,height:26,borderRadius:'50%',background:'#FFD700',
                        display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>🤖</div>
                      <p style={{fontSize:9,color:'rgba(255,255,255,0.45)',letterSpacing:'0.1em'}}>TODAY'S ADVICE</p>
                    </div>
                    {aiLoading ? (
                      <p style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>アドバイスを生成中...</p>
                    ) : (
                      <p style={{fontSize:11,color:'rgba(255,255,255,0.85)',lineHeight:1.7}}>{aiAdvice||'読み込み中...'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',marginBottom:8}}>QUICK ACCESS</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {[
                    {href:'/teams',emoji:'🗺️',title:'チームを探す',image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80'},
                    {href:'/foot-camera',emoji:'👟',title:'AI足型診断',image:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80'},
                    {href:'/body-check',emoji:'📊',title:'体格診断',image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'},
                    {href:'/nutrition',emoji:'🥗',title:'栄養ガイド',image:'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&q=80'},
                  ].map(item=>(
                    <Link key={item.href} href={item.href}
                      style={{position:'relative',height:90,borderRadius:10,overflow:'hidden',textDecoration:'none',display:'block'}}>
                      <img src={item.image} alt={item.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.55)',
                        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
                        <span style={{fontSize:20}}>{item.emoji}</span>
                        <p style={{fontSize:10,fontWeight:600,color:'white'}}>{item.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {isActive ? (
                <div style={{background:'#111',borderRadius:12,padding:'14px',border:'1px solid rgba(255,215,0,0.2)'}}>
                  <p style={{fontSize:10,color:'#FFD700',letterSpacing:'0.1em',marginBottom:10}}>PREMIUM CONTENT</p>
                  {[
                    {href:'/teams',title:'セレクション申込URL・締切日',emoji:'📅'},
                    {href:'/teams',title:'チームWEB・SNSリンク',emoji:'🔗'},
                    {href:'/position',title:'ポジション別詳細資料',emoji:'🎯'},
                  ].map(item=>(
                    <Link key={item.title} href={item.href}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'10px',marginBottom:4,
                        borderRadius:8,background:'rgba(255,215,0,0.05)',border:'1px solid rgba(255,215,0,0.1)',textDecoration:'none'}}>
                      <span style={{fontSize:16}}>{item.emoji}</span>
                      <p style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>{item.title}</p>
                      <span style={{marginLeft:'auto',color:'rgba(255,255,255,0.2)',fontSize:12}}>›</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{borderRadius:12,overflow:'hidden'}}>
                  <div style={{position:'relative',height:110}}>
                    <img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80"
                      alt="プレミアム" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.75)',
                      display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px'}}>
                      <div>
                        <p style={{color:'#FFD700',fontSize:11,fontWeight:700,marginBottom:2}}>🔒 プレミアム会員限定</p>
                        <p style={{color:'rgba(255,255,255,0.65)',fontSize:10,lineHeight:1.5}}>セレクション情報・チームリンク</p>
                      </div>
                      <Link href="/member"
                        style={{padding:'8px 14px',borderRadius:8,background:'#FFD700',
                          color:'#1a1a1a',fontSize:11,fontWeight:700,textDecoration:'none',flexShrink:0}}>
                        ¥500/月〜
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab==='status' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:4}}>診断した内容がここに表示されます</p>

              <div style={{borderRadius:12,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{position:'relative',height:100}}>
                  <img src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80"
                    alt="足型" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.72)',padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
                    <span style={{fontSize:26,flexShrink:0}}>👟</span>
                    <div style={{flex:1}}>
                      <p style={{color:'rgba(255,255,255,0.45)',fontSize:9,letterSpacing:'0.1em',marginBottom:3}}>AI足型診断</p>
                      {footResult ? (
                        <>
                          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:2}}>
                            {(footResult.footType||[]).map((t:string)=>(
                              <span key={t} style={{fontSize:9,padding:'1px 6px',borderRadius:6,background:'rgba(255,215,0,0.2)',color:'#FFD700'}}>{t}</span>
                            ))}
                          </div>
                          <p style={{fontSize:10,color:'rgba(255,255,255,0.55)'}}>おすすめ: {(footResult.recommend||[]).join('・')}</p>
                        </>
                      ) : <p style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>未診断</p>}
                    </div>
                    <Link href="/foot-camera"
                      style={{padding:'5px 10px',borderRadius:7,background:'rgba(255,255,255,0.1)',
                        color:'white',fontSize:10,textDecoration:'none',flexShrink:0}}>
                      {footResult?'再診断':'診断する'}
                    </Link>
                  </div>
                </div>
              </div>

              <div style={{borderRadius:12,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{position:'relative',height:100}}>
                  <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"
                    alt="体格" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.72)',padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
                    <span style={{fontSize:26,flexShrink:0}}>📊</span>
                    <div style={{flex:1}}>
                      <p style={{color:'rgba(255,255,255,0.45)',fontSize:9,letterSpacing:'0.1em',marginBottom:3}}>体格診断</p>
                      {bodyResult ? (
                        <>
                          <p style={{fontSize:12,fontWeight:600,color:'white',marginBottom:1}}>{bodyResult.h}cm / {bodyResult.w}kg</p>
                          <p style={{fontSize:10,color:'rgba(255,255,255,0.55)'}}>{bodyResult.grade} · BMI {bodyResult.bmi}</p>
                        </>
                      ) : <p style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>未診断</p>}
                    </div>
                    <Link href="/body-check"
                      style={{padding:'5px 10px',borderRadius:7,background:'rgba(255,255,255,0.1)',
                        color:'white',fontSize:10,textDecoration:'none',flexShrink:0}}>
                      {bodyResult?'再診断':'診断する'}
                    </Link>
                  </div>
                </div>
              </div>

              {footResult?.score && (
                <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>足型スコア</p>
                  {[['快適性','comfort','#457b9d'],['スピード','speed','#e63946'],['コントロール','control','#2d6a4f']].map(([label,key,color])=>(
                    <div key={key} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:11,color:'rgba(255,255,255,0.6)'}}>{label}</span>
                        <span style={{fontSize:11,fontWeight:500,color:'white'}}>{footResult.score[key]}</span>
                      </div>
                      <div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:2}}>
                        <div style={{height:'100%',width:`${footResult.score[key]}%`,background:color,borderRadius:2}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!footResult && !bodyResult && (
                <div style={{textAlign:'center',padding:'30px 20px'}}>
                  <p style={{fontSize:32,marginBottom:10}}>📋</p>
                  <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:16}}>まだ診断データがありません</p>
                  <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                    <Link href="/foot-camera"
                      style={{padding:'8px 16px',borderRadius:8,background:'#FFD700',color:'#1a1a1a',fontSize:11,fontWeight:700,textDecoration:'none'}}>
                      足型診断
                    </Link>
                    <Link href="/body-check"
                      style={{padding:'8px 16px',borderRadius:8,background:'rgba(255,255,255,0.1)',color:'white',fontSize:11,textDecoration:'none'}}>
                      体格診断
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab==='settings' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:12}}>お子さんの情報</p>
                <div style={{marginBottom:10}}>
                  <label style={{fontSize:11,color:'rgba(255,255,255,0.5)',display:'block',marginBottom:4}}>お名前</label>
                  <input value={childName} onChange={e=>setChildName(e.target.value)} placeholder="例: 太郎"
                    style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',
                      background:'rgba(255,255,255,0.05)',color:'white',fontSize:13,outline:'none'}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,color:'rgba(255,255,255,0.5)',display:'block',marginBottom:4}}>学年</label>
                  <select value={childGrade} onChange={e=>setChildGrade(e.target.value)}
                    style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',
                      background:'#1a1a1a',color:'white',fontSize:13,outline:'none'}}>
                    <option value="">選択してください</option>
                    {['小1','小2','小3','小4','小5','小6','中1','中2','中3'].map(g=>(
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <button onClick={()=>{localStorage.setItem('childName',childName);localStorage.setItem('childGrade',childGrade);alert('保存しました！')}}
                  style={{width:'100%',padding:'10px',borderRadius:8,background:'#FFD700',border:'none',color:'#1a1a1a',fontSize:12,fontWeight:700,cursor:'pointer'}}>
                  保存する
                </button>
              </div>
              <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>プラン情報</p>
                {memberPlan ? (
                  <div style={{background:'rgba(255,215,0,0.1)',borderRadius:8,padding:'10px 12px',border:'1px solid rgba(255,215,0,0.2)'}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#FFD700',marginBottom:2}}>✓ プレミアム会員</p>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>プラン: {memberPlan}</p>
                  </div>
                ) : trialDaysLeft !== null && trialDaysLeft > 0 ? (
                  <div>
                    <div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'10px 12px',marginBottom:8}}>
                      <p style={{fontSize:12,color:'white',marginBottom:2}}>お試し期間中</p>
                      <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>残り {trialDaysLeft} 日</p>
                    </div>
                    <Link href="/member" style={{display:'block',padding:'10px',borderRadius:8,background:'#FFD700',color:'#1a1a1a',fontSize:12,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
                      正式登録する（¥500/月〜）
                    </Link>
                  </div>
                ) : (
                  <Link href="/member" style={{display:'block',padding:'10px',borderRadius:8,background:'#FFD700',color:'#1a1a1a',fontSize:12,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
                    会員登録する（¥500/月〜）
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
