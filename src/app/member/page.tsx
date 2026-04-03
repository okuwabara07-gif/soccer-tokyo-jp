'use client'
import { useState } from 'react'
import Link from 'next/link'
const PLANS = [
  { id:'papa_mama', name:'パパママ応援プラン', price:'¥4,500', sub:'6ヶ月一括', badge:'初回限定・一番お得', badgeColor:'#854F0B', badgeBg:'#FAEEDA', features:['申込URL・締切日','チーム詳細情報','ブロック別順位表','セレクション速報'], highlight:true },
  { id:'standard', name:'スタンダード', price:'¥500', sub:'月額', badge:'保護者向け', badgeColor:'#0C447C', badgeBg:'#E6F1FB', features:['申込URL・締切日','チーム詳細情報','ブロック別順位表'], highlight:false },
  { id:'premium', name:'プレミアム', price:'¥1,500', sub:'月額', badge:'本気の保護者向け', badgeColor:'#3C3489', badgeBg:'#EEEDFE', features:['スタンダード全機能','合格率データ','セレクション対策','LINE個別通知'], highlight:false },
]
export default function MemberPage() {
  const [loading, setLoading] = useState<string|null>(null)
  const handleCheckout = async (planId: string) => {
    setLoading(planId)
    const res = await fetch('/api/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:planId})})
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setLoading(null)
  }
  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← 戻る</Link>
          <h1 style={{color:'white',fontSize:22,fontWeight:300,marginBottom:4}}>会員プランを選ぶ</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>セレクション申込URL・詳細情報を閲覧できます</p>
        </div>
        <div style={{padding:16}}>
          {PLANS.map(plan=>(
            <div key={plan.id} style={{background:'white',borderRadius:14,border:plan.highlight?'2px solid #c9a84c':'1px solid #eeeeea',padding:'14px 16px',marginBottom:10,position:'relative'}}>
              {plan.highlight && <div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',background:'#c9a84c',color:'white',fontSize:9,padding:'3px 12px',borderRadius:10,fontWeight:500,whiteSpace:'nowrap'}}>一番お得</div>}
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <div>
                  <span style={{fontSize:9,padding:'2px 7px',borderRadius:8,fontWeight:500,background:plan.badgeBg,color:plan.badgeColor}}>{plan.badge}</span>
                  <p style={{fontSize:14,fontWeight:500,marginTop:4}}>{plan.name}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontSize:22,fontWeight:300,lineHeight:1}}>{plan.price}</p>
                  <p style={{fontSize:10,color:'#999'}}>{plan.sub}</p>
                </div>
              </div>
              <div style={{marginBottom:12}}>{plan.features.map(f=><div key={f} style={{fontSize:11,color:'#444',padding:'2px 0'}}>✓ {f}</div>)}</div>
              <button onClick={()=>handleCheckout(plan.id)} disabled={loading===plan.id}
                style={{width:'100%',padding:'12px',borderRadius:10,border:'none',cursor:'pointer',fontSize:13,fontWeight:500,background:plan.highlight?'#c9a84c':'#1a1a1a',color:'white'}}>
                {loading===plan.id?'処理中...':plan.name+'に登録する'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
