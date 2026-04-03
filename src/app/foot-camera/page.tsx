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

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/shoes" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← シューズ選びに戻る</Link>
          <h1 style={{color:'white',fontSize:22,fontWeight:300,marginBottom:4}}>AI足型診断</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>足の写真を撮ると最適なシューズを提案します</p>
        </div>
        <div style={{padding:16}}>
          <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px',marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:500,marginBottom:8}}>撮影のコツ</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['真上から撮影','足全体が映るように'],['明るい場所で','影が入らないように'],['白い床の上','コントラストをつけて'],['靴下は脱いで','素足で撮影']].map(([t,d])=>(
                <div key={t} style={{background:'#f8f8f6',borderRadius:8,padding:'8px 10px'}}>
                  <p style={{fontSize:11,fontWeight:500,marginBottom:2}}>{t}</p>
                  <p style={{fontSize:9,color:'#999'}}>{d}</p>
                </div>
              ))}
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{display:'none'}}/>

          {!image ? (
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
              <button onClick={()=>fileRef.current?.click()}
                style={{width:'100%',padding:'16px',borderRadius:12,background:'#1a1a1a',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>
                カメラで撮影する
              </button>
              <button onClick={()=>{if(fileRef.current){fileRef.current.removeAttribute('capture');fileRef.current.click()}}}
                style={{width:'100%',padding:'14px',borderRadius:12,background:'white',color:'#1a1a1a',border:'1px solid #e8e8e4',fontSize:13,cursor:'pointer'}}>
                ライブラリから選ぶ
              </button>
            </div>
          ) : (
            <div style={{marginBottom:12}}>
              <img src={image} alt="足" style={{width:'100%',borderRadius:12,marginBottom:10,maxHeight:300,objectFit:'cover'}}/>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{setImage(null);setResult(null)}}
                  style={{flex:1,padding:'10px',borderRadius:10,background:'white',border:'1px solid #e8e8e4',fontSize:12,cursor:'pointer',color:'#666'}}>
                  撮り直す
                </button>
                <button onClick={analyze} disabled={loading}
                  style={{flex:2,padding:'10px',borderRadius:10,background:'#1a1a1a',color:'white',border:'none',fontSize:12,fontWeight:500,cursor:'pointer',opacity:loading?0.6:1}}>
                  {loading?'AI解析中...':'この写真で診断する'}
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'24px',textAlign:'center'}}>
              <p style={{fontSize:13,color:'#666',marginBottom:6}}>AIが足型を解析中...</p>
              <p style={{fontSize:11,color:'#bbb'}}>幅・甲の高さ・アーチを分析しています</p>
            </div>
          )}

          {result && !result.error && (
            <div>
              <div style={{background:'#0a0a0a',borderRadius:12,padding:'14px 16px',marginBottom:10}}>
                <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:8}}>AI診断結果</p>
                <p style={{fontSize:13,color:'white',lineHeight:1.7,marginBottom:10}}>{result.analysis}</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {result.footType?.map((t:string)=>(
                    <span key={t} style={{fontSize:10,padding:'3px 10px',borderRadius:10,background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)'}}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px',marginBottom:10}}>
                <p style={{fontSize:11,fontWeight:500,color:'#1D9E75',marginBottom:8}}>おすすめブランド</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                  {result.recommend?.map((b:string)=>(
                    <span key={b} style={{fontSize:11,padding:'4px 12px',borderRadius:10,background:'#E1F5EE',color:'#085041',fontWeight:500}}>{b}</span>
                  ))}
                </div>
                <p style={{fontSize:11,color:'#666',lineHeight:1.6}}>{result.reason}</p>
              </div>
              <Link href="/shoes" style={{display:'block',padding:'12px',borderRadius:10,background:'#1a1a1a',color:'white',fontSize:13,textAlign:'center',textDecoration:'none'}}>
                ランキングを見る →
              </Link>
            </div>
          )}

          {result?.error && (
            <div style={{background:'#FCEBEB',borderRadius:10,padding:'12px 14px'}}>
              <p style={{fontSize:11,color:'#791F1F'}}>{result.error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
