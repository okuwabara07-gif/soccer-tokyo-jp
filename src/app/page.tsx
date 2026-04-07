'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=900&q=80',
    pos: 'center 30%',
    label: '仲間と共に、勝利をつかめ'
  },
  {
    url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=900&q=80',
    pos: 'center 25%',
    label: '毎日の積み重ねが、未来を変える'
  },
  {
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80',
    pos: 'center 40%',
    label: '関東のグラウンドで、夢を描け'
  },
  {
    url: 'https://images.unsplash.com/photo-1600679472829-3044539ce405?w=900&q=80',
    pos: 'center 35%',
    label: 'コーチと二人三脚、限界を超えろ'
  },
  {
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80',
    pos: 'center 20%',
    label: 'チームが、もう一人の家族になる'
  },
]

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [showInstall, setShowInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // ページ読み込み時にランダムなヒーロー画像を選択
    setHeroIdx(Math.floor(Math.random() * HERO_IMAGES.length))

    // PWAインストールプロンプト
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true) }
    window.addEventListener('beforeinstallprompt', handler)

    // ヒーロー自動スライド（5秒ごと）
    const slideTimer = setInterval(() => {
      setHeroIdx(prev => (prev + 1) % HERO_IMAGES.length)
    }, 5000)

    // iOSの場合は常に表示
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const isStandalone = (window.navigator as any).standalone
    if (isIOS && !isStandalone) setShowInstall(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearInterval(slideTimer)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') setShowInstall(false)
    } else {
      // iOS向けの説明
      alert('ホーム画面に追加する方法\n\nSafariの場合：\n1. 画面下の「共有」ボタンをタップ\n2.「ホーム画面に追加」を選択\n3.「追加」をタップ')
    }
  }

  const hero = HERO_IMAGES[heroIdx]

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:'-apple-system,sans-serif'}}>

      {/* ヒーローセクション */}
      <div style={{position:'relative',height:'100svh',maxHeight:700,overflow:'hidden'}}>
        <img key={heroIdx} src={hero.url} alt="サッカー"
          style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:hero.pos,
            animation:'fadeIn 1s ease-in-out'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(10,10,10,0.95) 100%)'}}>

          {/* ヘッダー */}
          <div style={{position:'absolute',top:0,left:0,right:0,padding:'16px',
            display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:9,letterSpacing:'0.15em',marginBottom:2}}>KANTO FOOTBALL DATABASE</p>
              <p style={{color:'white',fontSize:13,fontWeight:700,lineHeight:1.2}}>
                サッカー東京・神奈川<br/>埼玉・千葉
              </p>
            </div>
            <Link href="/member"
              style={{padding:'8px 14px',borderRadius:20,background:'#FFD700',
                color:'#1a1a1a',fontSize:11,fontWeight:700,textDecoration:'none',
                whiteSpace:'nowrap',flexShrink:0}}>
              会員登録
            </Link>
          </div>

          {/* メインコピー */}
          <div style={{position:'absolute',bottom:120,left:20,right:20}}>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:10,letterSpacing:'0.2em',marginBottom:8}}>TOKYO & KANTO</p>
            <h1 style={{color:'white',fontSize:36,fontWeight:700,lineHeight:1.2,marginBottom:8,
              textShadow:'0 2px 8px rgba(0,0,0,0.6)'}}>
              チームを探す。<br/>仲間と出会う。<br/>成長する。
            </h1>
            <p style={{color:'rgba(255,255,255,0.75)',fontSize:14,fontWeight:600,lineHeight:1.6,
              textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>
              東京・関東のサッカー情報を<br/>ひとつにまとめたプラットフォーム
            </p>
          </div>

          {/* CTAボタン */}
          <div style={{position:'absolute',bottom:40,left:20,right:20,display:'flex',gap:10}}>
            <Link href="/teams"
              style={{flex:2,padding:'14px',borderRadius:12,background:'#4CAF50',
                color:'white',fontSize:14,fontWeight:700,textDecoration:'none',
                textAlign:'center',boxShadow:'0 4px 12px rgba(76,175,80,0.4)'}}>
              チームを探す
            </Link>
            <Link href="/mypage"
              style={{flex:1,padding:'14px',borderRadius:12,
                background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',
                color:'white',fontSize:13,fontWeight:500,textDecoration:'none',
                textAlign:'center',backdropFilter:'blur(4px)'}}>
              マイページ
            </Link>
          </div>

          {/* 画像インジケーター＋ラベル */}
          <div style={{position:'absolute',bottom:16,left:'50%',transform:'translateX(-50%)',
            display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:11,letterSpacing:'0.08em',
              textShadow:'0 1px 4px rgba(0,0,0,0.9)',fontWeight:500,textAlign:'center'}}>
              {HERO_IMAGES[heroIdx].label}
            </p>
            <div style={{display:'flex',gap:6}}>
              {HERO_IMAGES.map((_,i)=>(
                <div key={i}
                  onClick={()=>setHeroIdx(i)}
                  style={{width:i===heroIdx?22:6,height:6,borderRadius:3,
                    background:i===heroIdx?'#FFD700':'rgba(255,255,255,0.35)',
                    transition:'all 0.4s ease',cursor:'pointer'}}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ホーム画面追加バナー */}
      {showInstall && (
        <div style={{background:'#1a1a2e',padding:'12px 16px',
          display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <span style={{fontSize:24,flexShrink:0}}>📱</span>
          <div style={{flex:1}}>
            <p style={{fontSize:12,fontWeight:600,color:'white',marginBottom:1}}>ホーム画面に追加</p>
            <p style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>アプリのように使えます</p>
          </div>
          <button onClick={handleInstall}
            style={{padding:'7px 14px',borderRadius:8,background:'#FFD700',
              border:'none',color:'#1a1a1a',fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}}>
            追加する
          </button>
          <button onClick={()=>setShowInstall(false)}
            style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',
              fontSize:18,cursor:'pointer',flexShrink:0,padding:0}}>✕</button>
        </div>
      )}

      {/* 統計 */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'rgba(255,255,255,0.05)',margin:'0'}}>
        {[['730+','登録チーム'],['4都県','対応エリア'],['無料','チーム検索']].map(([num,label])=>(
          <div key={label} style={{background:'#111',padding:'16px 8px',textAlign:'center'}}>
            <p style={{fontSize:20,fontWeight:700,color:'#FFD700',marginBottom:2}}>{num}</p>
            <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{label}</p>
          </div>
        ))}
      </div>

      {/* ジュニア・ジュニアユース向けバナー */}
      <div style={{margin:'12px 16px 0',borderRadius:14,overflow:'hidden',position:'relative'}}>
        <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80"
          alt="ジュニアサッカー" style={{width:'100%',height:120,objectFit:'cover',objectPosition:'center 30%',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(76,175,80,0.85),rgba(45,106,79,0.85))',
          display:'flex',alignItems:'center',padding:'0 16px',gap:12}}>
          <div style={{flex:1}}>
            <p style={{color:'rgba(255,255,255,0.8)',fontSize:10,letterSpacing:'0.1em',marginBottom:4}}>FOR JUNIOR & JUNIOR YOUTH</p>
            <p style={{color:'white',fontSize:15,fontWeight:700,lineHeight:1.4,marginBottom:4}}>
              ジュニア・ジュニアユースの<br/>未来をサポート
            </p>
            <p style={{color:'rgba(255,255,255,0.75)',fontSize:10,lineHeight:1.6}}>
              東京・関東のU-12〜U-15チーム情報・セレクション・AI診断まで
            </p>
          </div>
          <div style={{flexShrink:0,textAlign:'center'}}>
            <div style={{fontSize:32,marginBottom:4}}>⚽</div>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:9}}>730+チーム</p>
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <div style={{padding:'16px'}}>
        <p style={{fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'0.15em',marginBottom:12}}>MENU</p>

        {/* メイン機能 */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
          {[
            {href:'/teams',emoji:'🗺️',title:'チームを探す',desc:'730+チームをマップで検索',color:'#4CAF50',image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80'},
            {href:'/foot-camera',emoji:'👟',title:'AI足型診断',desc:'写真1枚でスパイク提案',color:'#FFD700',image:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80'},
          ].map(item=>(
            <Link key={item.href} href={item.href}
              style={{position:'relative',height:130,borderRadius:14,overflow:'hidden',textDecoration:'none',display:'block'}}>
              <img src={item.image} alt={item.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.85) 100%)'}}>
                <div style={{position:'absolute',bottom:10,left:10,right:10}}>
                  <span style={{fontSize:16}}>{item.emoji}</span>
                  <p style={{fontSize:12,fontWeight:700,color:'white',marginBottom:1}}>{item.title}</p>
                  <p style={{fontSize:9,color:'rgba(255,255,255,0.6)'}}>{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* サブ機能 */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:8}}>
          {[
            {href:'/body-check',emoji:'📊',title:'体格診断',color:'#e63946'},
            {href:'/nutrition',emoji:'🥗',title:'栄養ガイド',color:'#2d6a4f'},
            {href:'/shoes',emoji:'⚽',title:'スパイク選び',color:'#457b9d'},
          ].map(item=>(
            <Link key={item.href} href={item.href}
              style={{padding:'14px 8px',borderRadius:12,background:'#111',
                border:`1px solid ${item.color}30`,textDecoration:'none',textAlign:'center',display:'block'}}>
              <span style={{fontSize:22,display:'block',marginBottom:4}}>{item.emoji}</span>
              <p style={{fontSize:10,fontWeight:600,color:'white'}}>{item.title}</p>
            </Link>
          ))}
        </div>

        {/* 情報系 */}
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {[
            {href:'/rules',emoji:'📋',title:'新ルール＆用語検索',desc:'2025年最新ルール・AI質問対応',color:'#854F0B'},
            {href:'/position',emoji:'🎯',title:'ポジション別資料',desc:'練習方法・有名選手・季節アイテム',color:'#534AB7'},
            {href:'/calendar',emoji:'📅',title:'セレクションカレンダー',desc:'締切情報・申込URL',color:'#185FA5'},
            {href:'/matching',emoji:'🤝',title:'チームマッチング',desc:'7つの質問で最適チームを提案（会員限定）',color:'#4CAF50'},
            {href:'/manga',emoji:'📚',title:'サッカー漫画ランキング',desc:'少年に読ませたいおすすめ漫画TOP5',color:'#e63946'},
          ].map(item=>(
            <Link key={item.href} href={item.href}
              style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
                borderRadius:12,background:'#111',border:`1px solid ${item.color}20`,textDecoration:'none'}}>
              <span style={{fontSize:22,flexShrink:0}}>{item.emoji}</span>
              <div style={{flex:1}}>
                <p style={{fontSize:12,fontWeight:600,color:'white',marginBottom:1}}>{item.title}</p>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{item.desc}</p>
              </div>
              <span style={{color:'rgba(255,255,255,0.2)',fontSize:16}}>›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 会員プランCTA */}
      <div style={{margin:'0 16px 16px',borderRadius:14,overflow:'hidden'}}>
        <div style={{position:'relative',height:120}}>
          <img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80"
            alt="会員" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.65)',
            display:'flex',alignItems:'center',padding:'0 16px',justifyContent:'space-between'}}>
            <div>
              <p style={{color:'#FFD700',fontSize:10,fontWeight:600,marginBottom:3}}>PREMIUM MEMBER</p>
              <p style={{color:'white',fontSize:14,fontWeight:700,marginBottom:2}}>セレクション情報を解放</p>
              <p style={{color:'rgba(255,255,255,0.6)',fontSize:10}}>申込URL・締切日・チーム詳細</p>
            </div>
            <Link href="/member"
              style={{padding:'10px 16px',borderRadius:10,background:'#FFD700',
                color:'#1a1a1a',fontSize:12,fontWeight:700,textDecoration:'none',
                whiteSpace:'nowrap',flexShrink:0}}>
              ¥500/月〜
            </Link>
          </div>
        </div>
      </div>

      {/* サッカー用品・スパイクおすすめ */}
      <div style={{margin:'0 16px 16px',padding:'16px',background:'#111',borderRadius:14,border:'1px solid rgba(255,255,255,0.08)'}}>
        <p style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',marginBottom:12,textAlign:'center'}}>PR・おすすめサービス</p>
        <div style={{display:'flex',flexDirection:'column',gap:'10px',alignItems:'center'}}>
          {/* Renta! 漫画レンタル */}
          <div style={{textAlign:'center'}}>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',marginBottom:'6px'}}>サッカー漫画をレンタルで読む</p>
            <a href="https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767207&pid=892590463"
              target="_blank" rel="nofollow noopener noreferrer sponsored"
              style={{display:'inline-block'}}>
              <img src="https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3767207&pid=892590463"
                border="0" alt="Renta!漫画レンタル" style={{display:'block'}}/>
            </a>
          </div>
          {/* BookLive */}
          <div style={{textAlign:'center'}}>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',marginBottom:'6px'}}>電子書籍をお得に購入</p>
            <a href="https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767207&pid=892590475"
              target="_blank" rel="nofollow noopener noreferrer sponsored"
              style={{display:'inline-block'}}>
              <img src="https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3767207&pid=892590475"
                border="0" alt="BookLive電子書籍" style={{display:'block'}}/>
            </a>
          </div>
        </div>
      </div>

      {/* Amazon用品ショッピング */}
      <div style={{margin:'0 16px 16px',padding:'16px',background:'#111',borderRadius:14,border:'1px solid rgba(255,180,0,0.2)'}}>
        <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',marginBottom:12}}>SOCCER GOODS</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
          {[
            {e:'👟',l:'スパイク',k:'ジュニア サッカー スパイク'},
            {e:'⚽',l:'ボール',k:'サッカーボール 5号'},
            {e:'👕',l:'ユニフォーム',k:'ジュニア サッカー ユニフォーム'},
            {e:'🚩',l:'審判グッズ',k:'サッカー 審判 グッズ'},
          ].map(item=>(
            <a key={item.k}
              href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(item.k)}&tag=haircolorab22-22`}
              target="_blank" rel="noopener noreferrer sponsored"
              style={{padding:'10px 4px',borderRadius:10,background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.06)',textDecoration:'none',textAlign:'center',display:'block'}}>
              <span style={{fontSize:22,display:'block',marginBottom:3}}>{item.e}</span>
              <p style={{fontSize:9,color:'white',fontWeight:600,marginBottom:1}}>{item.l}</p>
              <p style={{fontSize:8,color:'#FF9900'}}>Amazon</p>
            </a>
          ))}
        </div>
      </div>
      {/* SNS・共有セクション */}
      <div style={{margin:'0 16px 16px',padding:'16px',background:'#111',borderRadius:14,border:'1px solid rgba(255,255,255,0.08)'}}>
        <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',marginBottom:12}}>SNS・シェア</p>

        {/* Instagramフォローバナー */}
        <a href="https://www.instagram.com/soccer_kanto_jp/"
          target="_blank" rel="noopener noreferrer"
          style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
            background:'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
            borderRadius:12,textDecoration:'none',marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.2)',
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>📸</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700,color:'white',marginBottom:2}}>@soccer_kanto_jp</p>
            <p style={{fontSize:10,color:'rgba(255,255,255,0.8)'}}>関東ジュニアサッカー情報局 公式Instagram</p>
          </div>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:16}}>›</span>
        </a>

        {/* LINE・Twitter シェアボタン */}
        <p style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginBottom:8}}>このサイトをシェア</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <a href="https://line.me/R/msg/text/?関東ジュニアサッカー情報局%0a東京・関東のサッカーチームをAIで検索%0ahttps://soccer-tokyo-jp.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              padding:'10px',borderRadius:10,background:'#06C755',
              textDecoration:'none',color:'white',fontSize:12,fontWeight:700}}>
            <span style={{fontSize:16}}>💬</span> LINEで送る
          </a>
          <a href="https://twitter.com/intent/tweet?text=関東のジュニアサッカーチームを検索できます⚽&url=https://soccer-tokyo-jp.vercel.app&hashtags=ジュニアサッカー,少年サッカー,関東サッカー"
            target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              padding:'10px',borderRadius:10,background:'#1DA1F2',
              textDecoration:'none',color:'white',fontSize:12,fontWeight:700}}>
            <span style={{fontSize:16}}>🐦</span> Xで共有
          </a>
        </div>
      </div>

      {/* フッター */}
      <div style={{padding:'16px',borderTop:'1px solid rgba(255,255,255,0.05)',textAlign:'center'}}>
        <p style={{fontSize:10,color:'rgba(255,255,255,0.2)'}}>© 2026 関東ジュニアサッカー情報局</p>
        <p style={{fontSize:9,color:'rgba(255,255,255,0.15)',marginTop:4}}>本サイトはアフィリエイト広告を含みます</p>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
    </main>
  )
}
