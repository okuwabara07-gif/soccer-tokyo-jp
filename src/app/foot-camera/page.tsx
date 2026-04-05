'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function FootCameraPage() {
  const [image, setImage] = useState<string|null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setImage(reader.result as string); setResult(null); setShowGuide(false) }
    reader.readAsDataURL(file)
  }

  const analyze = async () => {
    if (!image) return
    setLoading(true)
    try {
      const res = await fetch('/api/analyze-foot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: '解析に失敗しました。' })
    }
    setLoading(false)
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

      // 半透明オーバーレイ
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillRect(0, img.height * 0.6, img.width, img.height * 0.4)

      // 手書き風フォント設定
      const handFont = 'bold 28px "Comic Sans MS", cursive'
      ctx.font = handFont

      // 足型タグを画像上に配置
      const tags = result.footType || []
      const positions = [
        { x: img.width * 0.15, y: img.height * 0.2 },
        { x: img.width * 0.65, y: img.height * 0.15 },
        { x: img.width * 0.1, y: img.height * 0.55 },
        { x: img.width * 0.55, y: img.height * 0.5 },
      ]
      tags.slice(0, 4).forEach((tag: string, i: number) => {
        const pos = positions[i]
        // 手書き風の丸囲み
        ctx.save()
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 3
        ctx.setLineDash([6, 3])
        const tw = ctx.measureText(tag).width
        ctx.beginPath()
        ctx.roundRect(pos.x - 8, pos.y - 28, tw + 20, 40, 12)
        ctx.stroke()
        ctx.restore()
        // テキスト
        ctx.fillStyle = '#FFD700'
        ctx.font = handFont
        ctx.fillText(tag, pos.x + 2, pos.y)
      })

      // 矢印風の線
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      if (tags.length > 0) {
        ctx.beginPath()
        ctx.moveTo(positions[0].x + 60, positions[0].y)
        ctx.lineTo(img.width * 0.35, img.height * 0.35)
        ctx.stroke()
      }

      // 下部おすすめ表示
      ctx.setLineDash([])
      ctx.fillStyle = 'white'
      ctx.font = 'bold 32px sans-serif'
      ctx.fillText('おすすめ ▶ ' + (result.recommend || []).slice(0, 2).join(' / '), 20, img.height * 0.72)

      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = '22px sans-serif'
      ctx.fillText(result.reason?.slice(0, 40) + '...', 20, img.height * 0.82)

      // ウォーターマーク
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font = '18px sans-serif'
      ctx.fillText('soccer-tokyo-jp.vercel.app', img.width - 320, img.height - 20)

      // ダウンロード
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

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:'-apple-system,sans-serif'}}>
      <canvas ref={canvasRef} style={{display:'none'}}/>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        {/* ヒーロー画像 */}
        {showGuide && (
          <div style={{position:'relative',height:220,overflow:'hidden'}}>
            <img src="/spike-hero.png" alt="サッカースパイク" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(10,10,10,0.9))'}}>
              <div style={{position:'absolute',bottom:20,left:16,right:16}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:10,letterSpacing:'0.15em',marginBottom:4}}>AI POWERED</p>
                <h1 style={{color:'white',fontSize:24,fontWeight:300,marginBottom:4}}>足型診断</h1>
                <p style={{color:'rgba(255,255,255,0.6)',fontSize:11}}>写真1枚で最適なスパイクをAIが提案</p>
              </div>
            </div>
          </div>
        )}

        {!showGuide && (
          <div style={{background:'#0a0a0a',padding:'16px 16px 8px'}}>
            <Link href="/shoes" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none'}}>← 戻る</Link>
          </div>
        )}

        <div style={{padding:'12px 16px 24px'}}>

          {/* 撮影ガイド */}
          {showGuide && (
            <>
              <div style={{position:'relative',background:'#111',borderRadius:16,overflow:'hidden',marginBottom:12,height:200}}>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {/* 足型ガイドライン */}
                  <svg viewBox="0 0 200 200" width="160" height="160">
                    <ellipse cx="100" cy="140" rx="55" ry="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="6,4"/>
                    <ellipse cx="85" cy="95" rx="30" ry="50" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="2" strokeDasharray="6,3"/>
                    <line x1="55" y1="95" x2="50" y2="95" stroke="rgba(255,215,0,0.8)" strokeWidth="1.5"/>
                    <line x1="115" y1="95" x2="120" y2="95" stroke="rgba(255,215,0,0.8)" strokeWidth="1.5"/>
                    <text x="100" y="90" textAnchor="middle" fontSize="9" fill="rgba(255,215,0,0.8)">← 幅を測定 →</text>
                    <line x1="85" y1="45" x2="85" y2="40" stroke="rgba(255,215,0,0.8)" strokeWidth="1.5"/>
                    <line x1="85" y1="145" x2="85" y2="150" stroke="rgba(255,215,0,0.8)" strokeWidth="1.5"/>
                    <text x="115" y="100" fontSize="8" fill="rgba(255,215,0,0.8)">長さ</text>
                    <circle cx="85" cy="55" r="8" fill="none" stroke="rgba(100,200,100,0.7)" strokeWidth="1.5" strokeDasharray="3,2"/>
                    <circle cx="65" cy="70" r="5" fill="none" stroke="rgba(100,200,100,0.6)" strokeWidth="1"/>
                    <circle cx="105" cy="70" r="5" fill="none" stroke="rgba(100,200,100,0.6)" strokeWidth="1"/>
                    <text x="100" y="185" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">ここに足を合わせて撮影</text>
                  </svg>
                </div>
                <div style={{position:'absolute',top:10,left:10,right:10,display:'flex',gap:6,flexWrap:'wrap'}}>
                  {['真上から','素足で','明るい場所','白い床'].map(t=>(
                    <span key={t} style={{fontSize:9,padding:'2px 8px',borderRadius:10,background:'rgba(255,215,0,0.15)',color:'rgba(255,215,0,0.9)',border:'1px solid rgba(255,215,0,0.3)'}}>{t}</span>
                  ))}
                </div>
              </div>

              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{display:'none'}}/>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <button onClick={()=>fileRef.current?.click()}
                  style={{padding:'16px',borderRadius:12,border:'none',background:'#FFD700',fontSize:14,cursor:'pointer',color:'#1a1a1a',fontWeight:600}}>
                  📷 カメラで撮影する
                </button>
                <button onClick={()=>{if(fileRef.current){fileRef.current.removeAttribute('capture');fileRef.current.click()}}}
                  style={{padding:'13px',borderRadius:12,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',fontSize:12,cursor:'pointer',color:'rgba(255,255,255,0.6)'}}>
                  🖼 ライブラリから選ぶ
                </button>
              </div>
            </>
          )}

          {/* 撮影済み・解析前 */}
          {image && !result && (
            <>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{display:'none'}}/>
              <div style={{position:'relative',marginBottom:12,borderRadius:12,overflow:'hidden'}}>
                <img src={image} alt="足の写真" style={{width:'100%',objectFit:'cover',maxHeight:280,display:'block'}}/>
                {/* ガイドオーバーレイ */}
                <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="rgba(255,215,0,0.5)" strokeWidth="0.5" strokeDasharray="3,2"/>
                  <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(255,215,0,0.3)" strokeWidth="0.3" strokeDasharray="2,2"/>
                  <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,215,0,0.3)" strokeWidth="0.3" strokeDasharray="2,2"/>
                </svg>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                <button onClick={()=>{setImage(null);setShowGuide(true)}}
                  style={{flex:1,padding:'11px',borderRadius:10,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',fontSize:12,cursor:'pointer',color:'rgba(255,255,255,0.6)'}}>
                  撮り直す
                </button>
                <button onClick={analyze} disabled={loading}
                  style={{flex:2,padding:'11px',borderRadius:10,border:'none',background:loading?'#444':'#FFD700',color:loading?'#999':'#1a1a1a',fontSize:13,fontWeight:600,cursor:loading?'not-allowed':'pointer'}}>
                  {loading ? '🔍 AI解析中...' : '✨ 足型を診断する'}
                </button>
              </div>
            </>
          )}

          {/* ローディング */}
          {loading && (
            <div style={{background:'#111',borderRadius:12,padding:'24px',textAlign:'center',marginBottom:12}}>
              <div style={{fontSize:36,marginBottom:12}}>🦶</div>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:4}}>AIが足型を分析中...</p>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>幅・甲・アーチ・つま先を計測しています</p>
            </div>
          )}

          {/* 診断結果 */}
          {result && !result.error && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>

              {/* 写真+手書きオーバーレイ */}
              {image && (
                <div style={{position:'relative',borderRadius:12,overflow:'hidden'}}>
                  <img src={image} alt="診断結果" style={{width:'100%',objectFit:'cover',maxHeight:260,display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)'}}>
                    {/* 手書き風タグ */}
                    {(result.footType||[]).slice(0,3).map((tag:string, i:number) => {
                      const positions = [
                        {top:'12%',left:'8%'},
                        {top:'20%',right:'8%'},
                        {top:'38%',left:'12%'},
                      ]
                      return (
                        <div key={tag} style={{position:'absolute',...positions[i],
                          background:'rgba(255,215,0,0.15)',border:'2px dashed rgba(255,215,0,0.8)',
                          borderRadius:8,padding:'3px 10px',
                          fontSize:12,color:'#FFD700',fontWeight:700,
                          fontFamily:'"Comic Sans MS", cursive',
                          backdropFilter:'blur(2px)'}}>
                          {tag}
                        </div>
                      )
                    })}
                  </div>
                  <div style={{position:'absolute',bottom:12,left:12,right:12}}>
                    <p style={{color:'white',fontSize:14,fontWeight:600,marginBottom:2}}>
                      おすすめ: {(result.recommend||[]).slice(0,2).join(' / ')}
                    </p>
                    <p style={{color:'rgba(255,255,255,0.7)',fontSize:10}}>{result.reason?.slice(0,50)}...</p>
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
                      <div style={{height:5,background:'rgba(255,255,255,0.1)',borderRadius:3}}>
                        <div style={{height:'100%',width:`${result.score[key]}%`,background:color,borderRadius:3}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 詳細分析 */}
              <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:8}}>AI分析</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                  {(result.footType||[]).map((t:string)=>(
                    <span key={t} style={{fontSize:11,padding:'3px 10px',borderRadius:10,background:'rgba(255,215,0,0.1)',color:'#FFD700',border:'1px solid rgba(255,215,0,0.3)'}}>{t}</span>
                  ))}
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.7)',lineHeight:1.7,marginBottom:6}}>{result.analysis}</p>
                {result.size_advice && (
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',padding:'6px 10px',background:'rgba(255,255,255,0.05)',borderRadius:8}}>{result.size_advice}</p>
                )}
              </div>

              {/* 購入リンク */}
              {(result.products||[]).length > 0 && (
                <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>おすすめを購入する</p>
                  {result.products.map((p:any)=>(
                    <div key={p.brand} style={{marginBottom:10}}>
                      <p style={{fontSize:12,fontWeight:600,color:'white',marginBottom:6}}>{p.brand}</p>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                        <a href={p.links.amazon} target="_blank" rel="noopener noreferrer sponsored"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px',borderRadius:8,background:'#ff9900',textDecoration:'none'}}>
                          <span style={{fontSize:13}}>📦</span>
                          <span style={{fontSize:11,fontWeight:600,color:'white'}}>Amazon</span>
                        </a>
                        <a href={p.links.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px',borderRadius:8,background:'#bf0000',textDecoration:'none'}}>
                          <span style={{fontSize:13}}>🛒</span>
                          <span style={{fontSize:11,fontWeight:600,color:'white'}}>楽天</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* アクションボタン */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <button onClick={saveImage}
                  style={{padding:'12px',borderRadius:10,border:'none',background:'#FFD700',fontSize:12,cursor:'pointer',color:'#1a1a1a',fontWeight:600}}>
                  💾 画像を保存
                </button>
                <button onClick={share}
                  style={{padding:'12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.2)',background:'transparent',fontSize:12,cursor:'pointer',color:'white'}}>
                  📤 シェア
                </button>
              </div>
              <button onClick={()=>{setImage(null);setResult(null);setShowGuide(true)}}
                style={{padding:'11px',borderRadius:10,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',fontSize:12,cursor:'pointer',color:'rgba(255,255,255,0.4)'}}>
                もう一度診断する
              </button>
              <Link href="/shoes"
                style={{display:'block',padding:'11px',borderRadius:10,background:'rgba(255,255,255,0.05)',textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.5)',textDecoration:'none'}}>
                スパイクランキングを見る →
              </Link>
            </div>
          )}

          {result?.error && (
            <div style={{background:'#1a0000',borderRadius:12,border:'1px solid rgba(255,0,0,0.2)',padding:'16px',textAlign:'center'}}>
              <p style={{fontSize:13,color:'#ff6b6b',marginBottom:8}}>{result.error}</p>
              <button onClick={()=>{setResult(null)}}
                style={{padding:'8px 20px',borderRadius:8,border:'none',background:'#FFD700',color:'#1a1a1a',fontSize:12,cursor:'pointer',fontWeight:600}}>
                やり直す
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
