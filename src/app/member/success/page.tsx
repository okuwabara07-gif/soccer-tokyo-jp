'use client'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const sp = useSearchParams()
  const sessionId = sp.get('session_id')
  const [state, setState] = useState<'verifying'|'ok'|'fail'>('verifying')
  const [plan, setPlan] = useState('standard')

  useEffect(() => {
    if (!sessionId) { setState('fail'); return }
    fetch('/api/verify-checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.paid) {
          localStorage.setItem('memberPlan', d.plan)
          localStorage.setItem('memberSince', new Date().toISOString())
          setPlan(d.plan); setState('ok')
        } else { setState('fail') }
      })
      .catch(() => setState('fail'))
  }, [sessionId])

  if (state === 'verifying') {
    return <main style={{minHeight:'100vh',background:'#f8f8f6',display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:'#666'}}>決済を確認しています…</p></main>
  }
  if (state === 'fail') {
    return (
      <main style={{minHeight:'100vh',background:'#f8f8f6',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{maxWidth:400,padding:24,textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
          <h1 style={{fontSize:18,fontWeight:700,marginBottom:8}}>決済を確認できませんでした</h1>
          <p style={{fontSize:13,color:'#666',marginBottom:20,lineHeight:1.7}}>お支払いが完了していないか、リンクが無効です。お手数ですが再度お試しください。</p>
          <Link href="/member" style={{display:'block',padding:'12px',borderRadius:10,background:'#168342',color:'#fff',fontSize:13,textDecoration:'none'}}>プランページへ戻る</Link>
        </div>
      </main>
    )
  }
  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:400,padding:24,textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <h1 style={{fontSize:20,fontWeight:700,marginBottom:8}}>登録完了！</h1>
        <p style={{fontSize:13,color:'#666',marginBottom:8,lineHeight:1.7}}>ご登録ありがとうございます。<br/>すべてのセレクション情報にアクセスできます。</p>
        <div style={{background:'#f0f7f0',borderRadius:10,padding:'10px 14px',marginBottom:20,border:'1px solid #c8e6c9'}}>
          <p style={{fontSize:12,color:'#2d6a2d',fontWeight:600}}>✓ セレクション情報がすべて閲覧可能になりました</p>
          <p style={{fontSize:12,color:'#2d6a2d'}}>✓ チーム詳細・公式/SNSリンクが閲覧可能になりました</p>
        </div>
        <Link href="/selection" style={{display:'block',padding:'12px',borderRadius:10,background:'#168342',color:'#fff',fontSize:13,textDecoration:'none',marginBottom:10}}>セレクション情報を見る →</Link>
        <Link href="/mypage" style={{display:'block',padding:'12px',borderRadius:10,background:'#B08D5E',color:'#fff',fontSize:13,textDecoration:'none',marginBottom:10}}>マイページへ →</Link>
        <Link href="/" style={{display:'block',padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',color:'#666',fontSize:13,textDecoration:'none'}}>トップへ戻る</Link>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return <Suspense fallback={<div>読み込み中...</div>}><SuccessContent /></Suspense>
}
