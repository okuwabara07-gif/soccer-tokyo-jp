import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:400,margin:'0 auto',padding:24,textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <h1 style={{fontSize:20,fontWeight:500,marginBottom:8}}>登録完了！</h1>
        <p style={{fontSize:13,color:'#666',marginBottom:24,lineHeight:1.7}}>
          ご登録ありがとうございます。<br/>
          すべてのセレクション情報にアクセスできます。
        </p>
        <Link href="/teams" style={{display:'block',padding:'12px',borderRadius:10,background:'#1a1a1a',color:'white',fontSize:13,textDecoration:'none',marginBottom:10}}>
          チームを探す →
        </Link>
        <Link href="/" style={{display:'block',padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',color:'#666',fontSize:13,textDecoration:'none'}}>
          トップへ戻る
        </Link>
      </div>
    </main>
  )
}
