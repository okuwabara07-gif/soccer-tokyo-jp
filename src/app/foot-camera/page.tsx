'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

export default function FootCameraPage() {
  const [image, setImage] = useState<string|null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string|null>(null)
  const [loadingStars, setLoadingStars] = useState<{x:number,y:number,size:number,delay:number}[]>([])
  const [loadingMsg, setLoadingMsg] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setImage(reader.result as string); setResult(null); setShowGuide(false) }
    reader.readAsDataURL(file)
  }

  const LOADING_MSGS = [
    '足の幅を計測中...', '甲の高さを解析中...', 'アーチを確認中...',
    'つま先の形を分析中...', 'ブランドをマッチング中...', '選手データと照合中...',
    'おすすめを選定中...', 'もうすぐ完了...✨'
  ]

  const analyze = async () => {
    if (!image) return
    setLoading(true)
    setLoadingMsg(0)
    // 星をランダム生成
    const stars = Array.from({length: 30}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 16 + 8,
      delay: Math.random() * 3
    }))
    setLoadingStars(stars)
    // メッセージをローテーション
    let msgIdx = 0
    const msgTimer = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length
      setLoadingMsg(msgIdx)
    }, 1800)
    try {
      const res = await fetch('/api/analyze-foot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      const data = await res.json()
      setResult(data)
      // マイページ用に自動保存
      if (data && !data.error) {
        localStorage.setItem('footDiagnosis', JSON.stringify({
          ...data,
          diagnosedAt: new Date().toISOString()
        }))
      }
      setSelectedBrand(data.recommend?.[0] || null)
    } catch {
      setResult({ error: '解析に失敗しました。' })
    } finally {
      clearInterval(msgTimer)
      setLoading(false)
      setLoadingStars([])
    }
  }

  const saveImage = async () => {
    if (!image || !result || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, img.height * 0.55, img.width, img.height * 0.45)
      const tags = result.footType || []
      const positions = [{x:0.08,y:0.18},{x:0.62,y:0.14},{x:0.06,y:0.45},{x:0.58,y:0.42}]
      tags.slice(0,4).forEach((tag:string, i:number) => {
        const px = img.width * positions[i].x
        const py = img.height * positions[i].y
        ctx.font = 'bold 26px sans-serif'
        const tw = ctx.measureText(tag).width
        ctx.fillStyle = 'rgba(0,0,0,0.75)'
        ctx.beginPath()
        ctx.roundRect(px-6, py-26, tw+16, 36, 8)
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.setLineDash([5,3])
        ctx.beginPath()
        ctx.roundRect(px-6, py-26, tw+16, 36, 8)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#ffffff'
        ctx.fillText(tag, px+2, py)
      })
      ctx.fillStyle = 'white'
      ctx.font = 'bold 30px sans-serif'
      ctx.fillText('おすすめ: ' + (result.recommend||[]).slice(0,2).join(' / '), 20, img.height*0.68)
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.font = '20px sans-serif'
      const reason = result.reason?.slice(0,45) + '...'
      ctx.fillText(reason, 20, img.height*0.78)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '16px sans-serif'
      ctx.fillText('soccer-tokyo-jp.vercel.app', img.width-300, img.height-18)
      const link = document.createElement('a')
      link.download = 'foot-diagnosis.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = image
  }

  const share = () => {
    if (!result) return
    const text = `AI足型診断：${(result.footType||[]).join('・')} → ${(result.recommend||[]).join('/')}がおすすめ！ https://soccer-tokyo-jp.vercel.app/foot-camera`
    if (navigator.share) navigator.share({ title: 'AI足型診断結果', text })
    else { navigator.clipboard.writeText(text); alert('コピーしました！') }
  }

  const selectedCatalog = result?.brandCatalog?.find((b:any) => b.name === selectedBrand)

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:'-apple-system,sans-serif'}}>
      <canvas ref={canvasRef} style={{display:'none'}}/>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{background:'#0a0a0a',padding:'10px 16px 4px',display:'flex',alignItems:'center'}}>
          <Link href="/" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.7)',fontSize:12,padding:'6px 12px',borderRadius:8,textDecoration:'none'}}>
            ← ホームへ
          </Link>
        </div>

        {showGuide && (
          <div style={{position:'relative',height:200,overflow:'hidden'}}>
            <img src="/spike-hero.png" alt="スパイク" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 30%'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(10,10,10,0.95))'}}>
              <div style={{position:'absolute',bottom:16,left:16,right:16}}>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:9,letterSpacing:'0.2em',marginBottom:4}}>AI POWERED DIAGNOSIS</p>
                <h1 style={{color:'white',fontSize:22,fontWeight:300,marginBottom:2}}>AI足型診断</h1>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>写真1枚で最適なスパイクをAIが提案</p>
              </div>
            </div>
          </div>
        )}

        <div style={{background:'#0a0a0a',padding:'14px 16px 6px',display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>{setShowGuide(true);setImage(null);setResult(null);setSelectedBrand(null)}}
            style={{background:'rgba(255,255,255,0.08)',border:'none',color:'rgba(255,255,255,0.7)',fontSize:12,cursor:'pointer',padding:'6px 12px',borderRadius:8,display:'flex',alignItems:'center',gap:4}}>
            ← 戻る
          </button>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:12}}>AI足型診断</p>
        </div>

        <div style={{padding:'12px 16px 32px'}}>

          {/* ガイド画面 */}
          {showGuide && (
            <>
              <div style={{background:'#111',borderRadius:14,overflow:'hidden',marginBottom:12,height:220,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg viewBox="0 0 280 260" width="260" height="240">
                  {/* グリッド */}
                  {[1,2,3,4].map(i=>(
                    <line key={"v"+i} x1={i*56} y1="0" x2={i*56} y2="260" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
                  ))}
                  {[1,2,3,4].map(i=>(
                    <line key={"h"+i} x1="0" y1={i*52} x2="280" y2={i*52} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
                  ))}
                  {/* 中心十字線 */}
                  <line x1="140" y1="10" x2="140" y2="250" stroke="rgba(255,215,0,0.15)" strokeWidth="0.8" strokeDasharray="4,3"/>
                  <line x1="10" y1="130" x2="270" y2="130" stroke="rgba(255,215,0,0.15)" strokeWidth="0.8" strokeDasharray="4,3"/>
                  {/* 足の輪郭メイン */}
                  <ellipse cx="120" cy="130" rx="44" ry="98" fill="rgba(255,215,0,0.04)" stroke="rgba(255,215,0,0.6)" strokeWidth="2" strokeDasharray="10,5"/>
                  {/* かかと */}
                  <ellipse cx="120" cy="210" rx="32" ry="20" fill="none" stroke="rgba(255,215,0,0.35)" strokeWidth="1.5" strokeDasharray="5,3"/>
                  {/* つま先 */}
                  <ellipse cx="120" cy="50" rx="26" ry="16" fill="none" stroke="rgba(255,215,0,0.35)" strokeWidth="1.5" strokeDasharray="5,3"/>
                  {/* 幅の計測線 */}
                  <line x1="76" y1="118" x2="164" y2="118" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeDasharray="4,3"/>
                  <line x1="76" y1="112" x2="76" y2="124" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
                  <line x1="164" y1="112" x2="164" y2="124" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
                  <text x="120" y="110" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">← 幅を測定 →</text>
                  {/* 長さの計測線 */}
                  <line x1="174" y1="50" x2="174" y2="210" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeDasharray="4,3"/>
                  <line x1="168" y1="50" x2="180" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
                  <line x1="168" y1="210" x2="180" y2="210" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
                  <text x="185" y="133" fontSize="8" fill="rgba(255,255,255,0.65)">長さ</text>
                  {/* コーナーマーカー */}
                  <path d="M 60 30 L 60 50 L 80 50" fill="none" stroke="rgba(255,215,0,0.5)" strokeWidth="2"/>
                  <path d="M 200 30 L 200 50 L 180 50" fill="none" stroke="rgba(255,215,0,0.5)" strokeWidth="2"/>
                  <path d="M 60 230 L 60 210 L 80 210" fill="none" stroke="rgba(255,215,0,0.5)" strokeWidth="2"/>
                  <path d="M 200 230 L 200 210 L 180 210" fill="none" stroke="rgba(255,215,0,0.5)" strokeWidth="2"/>
                  {/* 中心点 */}
                  <circle cx="120" cy="130" r="5" fill="rgba(255,215,0,0.7)"/>
                  <circle cx="120" cy="130" r="10" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="1"/>
                  {/* 指示テキスト */}
                  <text x="140" y="250" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.4)">足をこのガイドに合わせて真上から撮影</text>
                </svg>
                <div style={{position:'absolute',top:10,left:10,right:10,display:'flex',gap:5,flexWrap:'wrap'}}>
                  {['📐 真上から','🧦 素足で','💡 明るい場所','⬜ 白い床'].map(t=>(
                    <span key={t} style={{fontSize:9,padding:'2px 7px',borderRadius:8,background:'rgba(255,215,0,0.12)',color:'rgba(255,215,0,0.85)',border:'1px solid rgba(255,215,0,0.25)'}}>{t}</span>
                  ))}
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{display:'none'}}/>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <button onClick={()=>fileRef.current?.click()}
                  style={{padding:'15px',borderRadius:12,border:'none',background:'#FFD700',fontSize:14,cursor:'pointer',color:'#1a1a1a',fontWeight:700,letterSpacing:'0.02em'}}>
                  📷 カメラで撮影する
                </button>
                <button onClick={()=>{if(fileRef.current){fileRef.current.removeAttribute('capture');fileRef.current.click()}}}
                  style={{padding:'12px',borderRadius:12,border:'1px solid rgba(255,255,255,0.12)',background:'transparent',fontSize:12,cursor:'pointer',color:'rgba(255,255,255,0.55)'}}>
                  🖼 ライブラリから選ぶ
                </button>
              </div>
            </>
          )}

          {/* 撮影済み */}
          {image && !result && (
            <>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{display:'none'}}/>
              <div style={{position:'relative',marginBottom:12,borderRadius:12,overflow:'hidden'}}>
                <img src={image} alt="足の写真" style={{width:'100%',objectFit:'cover',maxHeight:280,display:'block'}}/>
                <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* グリッド */}
                  <line x1="33" y1="0" x2="33" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                  <line x1="66" y1="0" x2="66" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                  <line x1="0" y1="33" x2="100" y2="33" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                  <line x1="0" y1="66" x2="100" y2="66" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3"/>
                  {/* 中心線 */}
                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,215,0,0.2)" strokeWidth="0.3" strokeDasharray="2,2"/>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,215,0,0.2)" strokeWidth="0.3" strokeDasharray="2,2"/>
                  {/* 足の輪郭 */}
                  <ellipse cx="50" cy="50" rx="27" ry="43" fill="none" stroke="rgba(255,215,0,0.5)" strokeWidth="0.5" strokeDasharray="3,2"/>
                  {/* コーナーマーカー */}
                  <path d="M 8 8 L 8 16 L 16 16" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="0.6"/>
                  <path d="M 92 8 L 92 16 L 84 16" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="0.6"/>
                  <path d="M 8 92 L 8 84 L 16 84" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="0.6"/>
                  <path d="M 92 92 L 92 84 L 84 84" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="0.6"/>
                </svg>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{setImage(null);setShowGuide(true)}}
                  style={{flex:1,padding:'11px',borderRadius:10,border:'1px solid rgba(255,255,255,0.12)',background:'transparent',fontSize:12,cursor:'pointer',color:'rgba(255,255,255,0.5)'}}>
                  撮り直す
                </button>
                <button onClick={analyze} disabled={loading}
                  style={{flex:2,padding:'11px',borderRadius:10,border:'none',background:loading?'#333':'#FFD700',color:loading?'#666':'#1a1a1a',fontSize:13,fontWeight:700,cursor:loading?'not-allowed':'pointer'}}>
                  {loading?'🔍 解析中...':'✨ 足型を診断する'}
                </button>
              </div>
            </>
          )}

          {/* ローディング - 星アニメーション */}
          {loading && (
            <div style={{background:'#0a0a14',borderRadius:14,overflow:'hidden',marginTop:12,position:'relative',height:280}}>
              {/* 星フィールド */}
              <div style={{position:'absolute',inset:0}}>
                {loadingStars.map((star,i)=>(
                  <div key={i} style={{
                    position:'absolute',
                    left:`${star.x}%`,
                    top:`${star.y}%`,
                    fontSize:star.size,
                    animation:`starPop 1.5s ease-in-out ${star.delay}s infinite`,
                    opacity:0,
                  }}>⭐</div>
                ))}
              </div>
              {/* 中央コンテンツ */}
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:10}}>
                <div style={{fontSize:52,marginBottom:16,animation:'pulse 1.5s ease-in-out infinite'}}>🦶</div>
                <p style={{fontSize:14,color:'white',fontWeight:500,marginBottom:6}}>AIが足型を分析中</p>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:20}}>{LOADING_MSGS[loadingMsg]}</p>
                {/* プログレスドット */}
                <div style={{display:'flex',gap:6}}>
                  {[0,1,2,3,4].map(i=>(
                    <div key={i} style={{
                      width:6,height:6,borderRadius:'50%',
                      background:i<=loadingMsg%5?'#FFD700':'rgba(255,255,255,0.15)',
                      transition:'background 0.3s'
                    }}/>
                  ))}
                </div>
              </div>
              <style>{`
                @keyframes starPop {
                  0%{opacity:0;transform:scale(0.3) rotate(0deg)}
                  30%{opacity:1;transform:scale(1.2) rotate(20deg)}
                  60%{opacity:0.8;transform:scale(1) rotate(-10deg)}
                  100%{opacity:0;transform:scale(0.5) rotate(30deg)}
                }
                @keyframes pulse {
                  0%,100%{transform:scale(1)}
                  50%{transform:scale(1.15)}
                }
              `}</style>
            </div>
          )}

          {/* 診断結果 */}
          {result && !result.error && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>

              {/* 写真+手書きタグ（コントラスト強化） */}
              {image && (
                <div style={{position:'relative',borderRadius:12,overflow:'hidden'}}>
                  <img src={image} alt="診断" style={{width:'100%',objectFit:'cover',maxHeight:260,display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 35%,rgba(0,0,0,0.85) 100%)'}}>
                    {(result.footType||[]).slice(0,3).map((tag:string,i:number)=>{
                      const pos = [{top:'10%',left:'6%'},{top:'18%',right:'6%'},{top:'36%',left:'8%'}][i]
                      return (
                        <div key={tag} style={{position:'absolute',...pos,
                          background:'rgba(0,0,0,0.8)',
                          border:'2px solid #ffffff',
                          borderRadius:8,padding:'4px 12px',
                          fontSize:12,color:'#ffffff',fontWeight:700,
                          backdropFilter:'blur(4px)',
                          boxShadow:'0 2px 8px rgba(0,0,0,0.5)'}}>
                          {tag}
                        </div>
                      )
                    })}
                  </div>
                  <div style={{position:'absolute',bottom:12,left:12,right:12}}>
                    <p style={{color:'white',fontSize:14,fontWeight:700,marginBottom:3,textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>
                      おすすめ: {(result.recommend||[]).slice(0,2).join(' / ')}
                    </p>
                    <p style={{color:'rgba(255,255,255,0.8)',fontSize:10,textShadow:'0 1px 3px rgba(0,0,0,0.8)'}}>{result.reason?.slice(0,50)}...</p>
                  </div>
                </div>
              )}

              {/* ブランドポジショニングチャート */}
              {result.brandCatalog && (
                <div style={{background:'#111',borderRadius:14,padding:'16px'}}>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:4}}>ブランド ポジショニングマップ</p>
                  <p style={{fontSize:9,color:'rgba(255,255,255,0.3)',marginBottom:12}}>タップするとスパイク詳細が表示されます</p>
                  <div style={{position:'relative',background:'rgba(255,255,255,0.03)',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)'}}>
                    {/* 軸ラベル */}
                    <div style={{position:'absolute',top:6,left:'50%',transform:'translateX(-50%)',fontSize:8,color:'rgba(255,255,255,0.3)'}}>軽量・スピード重視</div>
                    <div style={{position:'absolute',bottom:6,left:'50%',transform:'translateX(-50%)',fontSize:8,color:'rgba(255,255,255,0.3)'}}>耐久・安定重視</div>
                    <div style={{position:'absolute',left:6,top:'50%',transform:'translateY(-50%) rotate(-90deg)',fontSize:8,color:'rgba(255,255,255,0.3)',whiteSpace:'nowrap'}}>細め</div>
                    <div style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%) rotate(90deg)',fontSize:8,color:'rgba(255,255,255,0.3)',whiteSpace:'nowrap'}}>幅広</div>
                    {/* グリッド線 */}
                    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 100 100" preserveAspectRatio="none">
                      <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
                    </svg>
                    {/* チャート本体 */}
                    <div style={{height:220,position:'relative',padding:'20px 20px'}}>
                      {result.brandCatalog.map((brand:any) => {
                        const isRec = brand.isRecommended
                        const isAvoid = brand.isAvoid
                        const isSel = selectedBrand === brand.name
                        return (
                          <button key={brand.name} onClick={()=>setSelectedBrand(isSel ? null : brand.name)}
                            style={{
                              position:'absolute',
                              left:`${brand.position.x}%`,
                              top:`${brand.position.y}%`,
                              transform:'translate(-50%,-50%)',
                              padding: isSel ? '5px 12px' : '4px 10px',
                              borderRadius:20,
                              border: isSel ? `2px solid ${brand.color}` : isRec ? `2px solid ${brand.color}` : '1px solid rgba(255,255,255,0.15)',
                              background: isSel ? brand.color : isRec ? `${brand.color}30` : 'rgba(255,255,255,0.05)',
                              color: isSel ? 'white' : isRec ? brand.color : 'rgba(255,255,255,0.4)',
                              fontSize: isSel ? 11 : 10,
                              fontWeight: isRec ? 700 : 400,
                              cursor:'pointer',
                              whiteSpace:'nowrap',
                              zIndex: isSel ? 10 : isRec ? 5 : 1,
                              transition:'all 0.2s',
                            }}>
                            {isRec && '⭐ '}{brand.name}
                          </button>
                        )
                      })}
                      {/* あなたの足の位置 */}
                      {result.chartPosition && (
                        <div style={{
                          position:'absolute',
                          left:`${result.chartPosition.x}%`,
                          top:`${result.chartPosition.y}%`,
                          transform:'translate(-50%,-50%)',
                          width:14,height:14,
                          borderRadius:'50%',
                          background:'#FFD700',
                          border:'2px solid white',
                          boxShadow:'0 0 8px rgba(255,215,0,0.6)',
                          zIndex:20,
                        }}/>
                      )}
                    </div>
                    {result.chartPosition && (
                      <p style={{fontSize:9,color:'rgba(255,215,0,0.7)',textAlign:'center',paddingBottom:8}}>🟡 あなたの足の位置</p>
                    )}
                  </div>

                  {/* 選択ブランドのスパイク詳細 */}
                  {selectedCatalog && (
                    <div style={{marginTop:12,background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'12px',border:`1px solid ${selectedCatalog.color}40`}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                        <p style={{fontSize:13,fontWeight:700,color:'white'}}>{selectedCatalog.name}</p>
                        {selectedCatalog.isRecommended && (
                          <span style={{fontSize:9,padding:'2px 8px',borderRadius:8,background:`${selectedCatalog.color}30`,color:selectedCatalog.color,fontWeight:600}}>おすすめ</span>
                        )}
                      </div>
                      {selectedCatalog.spikes.map((spike:any, i:number)=>(
                        <div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:i<selectedCatalog.spikes.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
                          <p style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.9)',marginBottom:3}}>{spike.name}</p>
                          <p style={{fontSize:10,color:'rgba(255,255,255,0.45)',marginBottom:6}}>{spike.feature}</p>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                            <span style={{fontSize:13,fontWeight:700,color:'#FFD700'}}>
                              ¥{spike.priceMin.toLocaleString()}〜¥{spike.priceMax.toLocaleString()}
                            </span>
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
                            <a href={selectedCatalog.amazonUrl} target="_blank" rel="noopener noreferrer sponsored"
                              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'7px',borderRadius:8,background:'#ff9900',textDecoration:'none'}}>
                              <span style={{fontSize:12}}>📦</span>
                              <span style={{fontSize:10,fontWeight:700,color:'white'}}>最安値Amazon</span>
                            </a>
                            <a href={selectedCatalog.rakutenUrl} target="_blank" rel="noopener noreferrer sponsored"
                              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'7px',borderRadius:8,background:'#bf0000',textDecoration:'none'}}>
                              <span style={{fontSize:12}}>🛒</span>
                              <span style={{fontSize:10,fontWeight:700,color:'white'}}>最安値楽天</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 選手マッチング */}
              {result.playerMatch && (
                <div style={{background:'linear-gradient(135deg,#0a0a2e,#1a1a4e)',borderRadius:14,padding:'16px',border:'1px solid rgba(255,215,0,0.2)'}}>
                  <p style={{fontSize:10,color:'rgba(255,215,0,0.7)',letterSpacing:'0.15em',marginBottom:12}}>⚽ あなたと同じ足型の選手</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:12,lineHeight:1.6}}>{result.playerMatch.description}</p>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {result.playerMatch.players.map((player:any,i:number)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:12,background:'rgba(255,255,255,0.05)',borderRadius:10,padding:'10px 12px'}}>
                        <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,215,0,0.15)',border:'1px solid rgba(255,215,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>
                          {player.emoji}
                        </div>
                        <div style={{flex:1}}>
                          <p style={{fontSize:13,fontWeight:700,color:'white',marginBottom:2}}>{player.name}</p>
                          <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{player.position} · {player.team}</p>
                        </div>
                        {i===0 && <span style={{fontSize:9,padding:'2px 8px',borderRadius:8,background:'rgba(255,215,0,0.2)',color:'#FFD700',fontWeight:600,flexShrink:0}}>最も近い</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* スコア */}
              {result.score && (
                <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>足型スコア</p>
                  {[['快適性','comfort','#457b9d'],['スピード','speed','#e63946'],['コントロール','control','#2d6a4f']].map(([label,key,color])=>(
                    <div key={key} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:11,color:'rgba(255,255,255,0.6)'}}>{label}</span>
                        <span style={{fontSize:11,fontWeight:500,color:'white'}}>{result.score[key]}</span>
                      </div>
                      <div style={{height:5,background:'rgba(255,255,255,0.08)',borderRadius:3}}>
                        <div style={{height:'100%',width:`${result.score[key]}%`,background:color,borderRadius:3}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI分析詳細 */}
              <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:8}}>AI分析</p>
                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
                  {(result.footType||[]).map((t:string)=>(
                    <span key={t} style={{fontSize:11,padding:'3px 10px',borderRadius:10,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.8)',border:'1px solid rgba(255,255,255,0.12)'}}>{t}</span>
                  ))}
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.65)',lineHeight:1.75,marginBottom:6}}>{result.analysis}</p>
                {result.size_advice && (
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.4)',padding:'6px 10px',background:'rgba(255,255,255,0.04)',borderRadius:8,lineHeight:1.6}}>{result.size_advice}</p>
                )}
              </div>

              {/* アクション */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <button onClick={saveImage}
                  style={{padding:'12px',borderRadius:10,border:'none',background:'#FFD700',fontSize:12,cursor:'pointer',color:'#1a1a1a',fontWeight:700}}>
                  💾 画像を保存
                </button>
                <button onClick={share}
                  style={{padding:'12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',fontSize:12,cursor:'pointer',color:'rgba(255,255,255,0.7)'}}>
                  📤 シェア
                </button>
              </div>
              <button onClick={()=>{setImage(null);setResult(null);setSelectedBrand(null);setShowGuide(true)}}
                style={{padding:'11px',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)',background:'transparent',fontSize:12,cursor:'pointer',color:'rgba(255,255,255,0.35)'}}>
                もう一度診断する
              </button>
              <Link href="/shoes"
                style={{display:'block',padding:'11px',borderRadius:10,background:'rgba(255,255,255,0.04)',textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>
                スパイクランキングを見る →
              </Link>
            </div>
          )}

          {result?.error && (
            <div style={{background:'rgba(255,0,0,0.08)',borderRadius:12,border:'1px solid rgba(255,0,0,0.2)',padding:'16px',textAlign:'center',marginTop:12}}>
              <p style={{fontSize:13,color:'#ff6b6b',marginBottom:8}}>{result.error}</p>
              <button onClick={()=>setResult(null)}
                style={{padding:'8px 20px',borderRadius:8,border:'none',background:'#FFD700',color:'#1a1a1a',fontSize:12,cursor:'pointer',fontWeight:700}}>
                やり直す
              </button>
            </div>
          )}
        </div>
      </div>
      {/* スパイク購入リンク */}
      <div style={{padding:'0 16px 16px'}}>
        <div style={{padding:'16px',background:'rgba(255,165,0,0.1)',borderRadius:12,border:'1px solid rgba(255,165,0,0.3)'}}>
          <p style={{color:'#FFD700',fontSize:13,fontWeight:700,marginBottom:12}}>⚽ あなたの足型に合うスパイクを探す</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <a href="https://www.amazon.co.jp/s?k=%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF&tag=haircolorab22-22" target="_blank" rel="noopener noreferrer sponsored"
              style={{padding:'10px',borderRadius:10,background:'#FF9900',textDecoration:'none',
                color:'#1a1a1a',fontSize:12,fontWeight:700,textAlign:'center',display:'block'}}>
              Amazonで探す
            </a>
            <a href="https://search.rakuten.co.jp/search/mall/%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF/?af=5253b9ed.08f9d938.5253b9ee.e71aefe8" target="_blank" rel="noopener noreferrer sponsored"
              style={{padding:'10px',borderRadius:10,background:'#BF0000',textDecoration:'none',
                color:'white',fontSize:12,fontWeight:700,textAlign:'center',display:'block'}}>
              楽天で探す
            </a>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:8}}>
            <a href="https://www.amazon.co.jp/s?k=%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%AB%205%E5%8F%B7&tag=haircolorab22-22" target="_blank" rel="noopener noreferrer sponsored"
              style={{padding:'10px',borderRadius:10,background:'#1a3a5c',textDecoration:'none',
                color:'white',fontSize:12,fontWeight:700,textAlign:'center',display:'block'}}>
              ボールを探す
            </a>
            <a href="https://www.amazon.co.jp/s?k=%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E3%83%A6%E3%83%8B%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0&tag=haircolorab22-22" target="_blank" rel="noopener noreferrer sponsored"
              style={{padding:'10px',borderRadius:10,background:'#1a3a5c',textDecoration:'none',
                color:'white',fontSize:12,fontWeight:700,textAlign:'center',display:'block'}}>
              ユニフォームを探す
            </a>
          </div>
          <p style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',marginTop:8,textAlign:'center'}}>PR</p>
        </div>
      </div>
    </main>
  )
}
