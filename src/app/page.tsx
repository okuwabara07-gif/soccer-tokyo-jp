'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const HERO_IMAGES = [
  { url:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80', pos:'center 30%' },
  { url:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900&q=80', pos:'center 40%' },
  { url:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80', pos:'center 50%' },
  { url:'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=900&q=80', pos:'center 35%' },
  { url:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=900&q=80', pos:'center 40%' },
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

    // iOSの場合は常に表示
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const isStandalone = (window.navigator as any).standalone
    if (isIOS && !isStandalone) setShowInstall(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
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

          {/* 画像インジケーター */}
          <div style={{position:'absolute',bottom:16,left:'50%',transform:'translateX(-50%)',
            display:'flex',gap:5}}>
            {HERO_IMAGES.map((_,i)=>(
              <div key={i} style={{width:i===heroIdx?16:5,height:5,borderRadius:3,
                background:i===heroIdx?'#FFD700':'rgba(255,255,255,0.3)',
                transition:'all 0.3s',cursor:'pointer'}}
                onClick={()=>setHeroIdx(i)}/>
            ))}
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
