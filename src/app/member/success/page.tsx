'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'standard'

  useEffect(() => {
    localStorage.setItem('memberPlan', plan)
    localStorage.setItem('memberSince', new Date().toISOString())
  }, [plan])

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:400,margin:'0 auto',padding:24,textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <h1 style={{fontSize:20,fontWeight:500,marginBottom:8}}>登録完了！</h1>
        <p style={{fontSize:13,color:'#666',marginBottom:8,lineHeight:1.7}}>
          ご登録ありがとうございます。<br/>
          すべてのセレクション情報にアクセスできます。
        </p>
        <div style={{background:'#f0f7f0',borderRadius:10,padding:'10px 14px',marginBottom:20,border:'1px solid #c8e6c9'}}>
          <p style={{fontSize:12,color:'#2d6a2d',fontWeight:500}}>✓ チームのWEB・SNSリンクが閲覧可能になりました</p>
          <p style={{fontSize:12,color:'#2d6a2d'}}>✓ セレクション申込URLが閲覧可能になりました</p>
          <p style={{fontSize:12,color:'#2d6a2d'}}>✓ チーム詳細情報が閲覧可能になりました</p>
        </div>
        <Link href="/teams" style={{display:'block',padding:'12px',borderRadius:10,background:'#1a1a1a',color:'white',fontSize:13,textDecoration:'none',marginBottom:10}}>
          チームを探す →
        </Link>
        <Link href="/mypage" style={{display:'block',padding:'12px',borderRadius:10,background:'#c9a84c',color:'white',fontSize:13,textDecoration:'none',marginBottom:10}}>
          マイページへ →
        </Link>
        <Link href="/" style={{display:'block',padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',color:'#666',fontSize:13,textDecoration:'none'}}>
          トップへ戻る
        </Link>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
