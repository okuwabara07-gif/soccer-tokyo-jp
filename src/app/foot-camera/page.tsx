'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

export default function FootCameraPage() {
  const [image, setImage] = useState<string|null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
    setResult(null)
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
      setResult({ error: '解析に失敗しました。もう一度お試しください。' })
    }
    setLoading(false)
  }

  const share = () => {
    if (!result) return
    const text = `AI足型診断結果：${result.footType?.join('・')} → おすすめは${result.recommend?.join('・')}！ https://soccer-tokyo-jp.vercel.app/foot-camera`
    if (navigator.share) navigator.share({ title: 'AI足型診断', text })
    else { navigator.clipboard.writeText(text); alert('コピーしました！') }
  }

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/shoes" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← シューズ選びに戻る</Link>
          <h1 style={{color:'white',fontSize:22,fontWeight:300,marginBottom:4}}>AI足型診断</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>写真を撮るだけでAIが最適なスパイクを提案</p>
        </div>

        <div style={{padding:16}}>
          {!result && (
            <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px',marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:500,marginBottom:8,color:'#1a1a1a'}}>撮影のコツ</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {[['真上から撮影','足全体が映るように'],['明るい場所で','影が入らないように'],['白い床の上','コントラストをつけて'],['靴下は脱いで','素足で撮影']].map(([t,d])=>(
                  <div key={t} style={{background:'#f8f8f6',borderRadius:8,padding:'8px 10px'}}>
                    <p style={{fontSize:11,fontWeight:500,marginBottom:2}}>{t}</p>
                    <p style={{fontSize:9,color:'#999'}}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{display:'none'}}/>

          {!image ? (
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
              <button onClick={()=>fileRef.current?.click()}
                style={{padding:'16px',borderRadius:12,border:'2px dashed #d0d0cc',background:'white',fontSize:13,cursor:'pointer',color:'#1a1a1a',fontWeight:500}}>
                📷 カメラで撮影する
              </button>
              <button onClick={()=>{if(fileRef.current){fileRef.current.removeAttribute('capture');fileRef.current.click()}}}
                style={{padding:'14px',borderRadius:12,border:'1px solid #eeeeea',background:'white',fontSize:12,cursor:'pointer',color:'#666'}}>
                🖼 ライブラリから選ぶ
              </button>
            </div>
          ) : (
            <div style={{marginBottom:12}}>
              <img src={image} alt="足の写真" style={{width:'100%',borderRadius:12,marginBottom:8,objectFit:'cover',maxHeight:240}}/>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{setImage(null);setResult(null)}}
                  style={{flex:1,padding:'10px',borderRadius:10,border:'1px solid #e8e8e4',background:'white',fontSize:12,cursor:'pointer',color:'#666'}}>
                  撮り直す
                </button>
                <button onClick={analyze} disabled={loading}
                  style={{flex:2,padding:'10px',borderRadius:10,border:'none',background:loading?'#e8e8e4':'#1a1a1a',color:loading?'#999':'white',fontSize:13,fontWeight:500,cursor:loading?'not-allowed':'pointer'}}>
                  {loading ? '🔍 AI解析中...' : '✨ 足型を診断する'}
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'24px',textAlign:'center',marginBottom:12}}>
              <div style={{fontSize:32,marginBottom:12}}>🦶</div>
              <p style={{fontSize:13,color:'#666',marginBottom:4}}>AIが足型を分析中...</p>
              <p style={{fontSize:11,color:'#999'}}>幅・甲の高さ・アーチを計測しています</p>
            </div>
          )}

          {result && !result.error && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{background:'#0a0a0a',borderRadius:12,padding:'16px'}}>
                <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',marginBottom:8}}>AI診断結果</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                  {(result.footType||[]).map((t:string)=>(
                    <span key={t} style={{fontSize:11,padding:'3px 10px',borderRadius:10,background:'rgba(255,255,255,0.1)',color:'white'}}>{t}</span>
                  ))}
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.7)',lineHeight:1.7,marginBottom:8}}>{result.analysis}</p>
                {result.size_advice && (
                  <div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'8px 10px'}}>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:3}}>サイズアドバイス</p>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>{result.size_advice}</p>
                  </div>
                )}
              </div>

              {result.score && (
                <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                  <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:10}}>足型スコア</p>
                  {[['快適性','comfort','#457b9d'],['スピード','speed','#e63946'],['コントロール','control','#2d6a4f']].map(([label,key,color])=>(
                    <div key={key} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:11,color:'#666'}}>{label}</span>
                        <span style={{fontSize:11,fontWeight:500}}>{result.score[key]}</span>
                      </div>
                      <div style={{height:4,background:'#f0f0ec',borderRadius:2}}>
                        <div style={{height:'100%',width:`${result.score[key]}%`,background:color,borderRadius:2,transition:'width 0.5s'}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:8}}>おすすめブランド</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                  {(result.recommend||[]).map((b:string)=>(
                    <span key={b} style={{fontSize:12,padding:'4px 14px',borderRadius:10,background:'#1a1a1a',color:'white',fontWeight:500}}>{b}</span>
                  ))}
                </div>
                <p style={{fontSize:11,color:'#666',lineHeight:1.7}}>{result.reason}</p>
              </div>

              {(result.products||[]).length > 0 && (
                <div>
                  <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:8}}>おすすめを探す</p>
                  {result.products.map((p:any)=>(
                    <div key={p.brand} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px 14px',marginBottom:8}}>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:8}}>{p.brand}</p>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                        <a href={p.links.amazon} target="_blank" rel="noopener noreferrer sponsored"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px',borderRadius:8,background:'#fff3cd',textDecoration:'none',border:'1px solid #ffc107'}}>
                          <span style={{fontSize:14}}>📦</span>
                          <span style={{fontSize:11,fontWeight:500,color:'#856404'}}>Amazon</span>
                        </a>
                        <a href={p.links.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px',borderRadius:8,background:'#fff0f0',textDecoration:'none',border:'1px solid #ffb3b3'}}>
                          <span style={{fontSize:14}}>🛒</span>
                          <span style={{fontSize:11,fontWeight:500,color:'#cc0000'}}>楽天</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(result.avoid||[]).length > 0 && (
                <div style={{background:'#fff8f8',borderRadius:12,border:'1px solid #ffd4d4',padding:'12px 14px'}}>
                  <p style={{fontSize:10,color:'#cc0000',marginBottom:6}}>避けた方がよいブランド</p>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {result.avoid.map((b:string)=>(
                      <span key={b} style={{fontSize:11,padding:'3px 10px',borderRadius:10,background:'rgba(204,0,0,0.08)',color:'#cc0000'}}>{b}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{setImage(null);setResult(null)}}
                  style={{flex:1,padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',background:'white',fontSize:12,cursor:'pointer',color:'#666'}}>
                  もう一度診断
                </button>
                <button onClick={share}
                  style={{flex:1,padding:'12px',borderRadius:10,border:'none',background:'#1a1a1a',fontSize:12,cursor:'pointer',color:'white'}}>
                  📤 結果をシェア
                </button>
              </div>

              <Link href="/shoes"
                style={{display:'block',padding:'12px',borderRadius:10,background:'#f0f0ec',textAlign:'center',fontSize:12,color:'#666',textDecoration:'none'}}>
                スパイクランキングを見る →
              </Link>
            </div>
          )}

          {result?.error && (
            <div style={{background:'#fff8f8',borderRadius:12,border:'1px solid #ffd4d4',padding:'16px',textAlign:'center'}}>
              <p style={{fontSize:13,color:'#cc0000',marginBottom:8}}>{result.error}</p>
              <button onClick={()=>setResult(null)}
                style={{padding:'8px 20px',borderRadius:8,border:'none',background:'#1a1a1a',color:'white',fontSize:12,cursor:'pointer'}}>
                やり直す
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
