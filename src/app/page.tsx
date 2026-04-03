'use client'
import { useState } from 'react'
import Link from 'next/link'

const UNSPLASH_IMGS = [
  'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=480&h=280&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=480&h=280&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=480&h=280&fit=crop&auto=format',
]

const SELECTIONS = [
  {name:'FC東京U-15', deadline:'6/30締切', status:'締切間近', color:'#A32D2D', bg:'#FCEBEB'},
  {name:'横浜F・マリノスJY', deadline:'7月開始', status:'受付中', color:'#0F6E56', bg:'#E1F5EE'},
  {name:'浦和レッズJY', deadline:'7月開始', status:'受付中', color:'#0F6E56', bg:'#E1F5EE'},
  {name:'ジェフ千葉U-15', deadline:'7〜8月', status:'受付中', color:'#0F6E56', bg:'#E1F5EE'},
]

export default function Home() {
  const [selected, setSelected] = useState<string|null>(null)
  const [imgIdx] = useState(0)

  const share = () => {
    const text = '関東ジュニアサッカー情報局 - U8〜ジュニアユースのセレクション・チーム情報 → https://soccer-tokyo-jp.vercel.app'
    if (navigator.share) navigator.share({title:'関東ジュニアサッカー情報局', text, url:'https://soccer-tokyo-jp.vercel.app'})
    else { navigator.clipboard.writeText(text); alert('URLをコピーしました！') }
  }

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{position:'relative',height:260,overflow:'hidden',background:'#0a0a0a'}}>
          <img src={UNSPLASH_IMGS[imgIdx]} alt="soccer"
            style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.6}}
            onError={e=>(e.currentTarget.style.display='none')}/>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'20px 16px'}}>
            <div style={{fontSize:9,letterSpacing:'0.15em',color:'rgba(255,255,255,0.5)',marginBottom:6,textTransform:'uppercase'}}>Kanto Junior Soccer</div>
            <h1 style={{fontSize:24,fontWeight:300,color:'white',letterSpacing:'-0.02em',lineHeight:1.2,marginBottom:4}}>
              関東ジュニア<br/>サッカー情報局
            </h1>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>U8〜ジュニアユース セレクション・チーム情報</p>
          </div>
          <button onClick={share}
            style={{position:'absolute',top:16,right:16,background:'rgba(255,255,255,0.15)',border:'none',borderRadius:20,padding:'6px 12px',color:'white',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
            <span style={{fontSize:14}}>📤</span> シェア
          </button>
        </div>

        <div style={{background:'#1a1a1a',padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <p style={{fontSize:11,fontWeight:500,color:'white',marginBottom:1}}>パパママ応援プラン</p>
            <p style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>6ヶ月限定 · 今すぐ登録</p>
          </div>
          <div style={{textAlign:'right'}}>
            <p style={{fontSize:18,fontWeight:300,color:'white'}}>¥4,500</p>
            <p style={{fontSize:9,color:'rgba(255,255,255,0.3)',textDecoration:'line-through'}}>通常 ¥6,000</p>
          </div>
        </div>

        <div style={{padding:'14px 16px 0',background:'white'}}>
          <div style={{background:'#f8f8f6',border:'1px solid #e8e8e4',borderRadius:24,padding:'8px 14px',display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="チーム名・区・カテゴリで検索..." readOnly onClick={()=>window.location.href='/teams'}
              style={{flex:1,border:'none',background:'transparent',fontSize:12,color:'#999',outline:'none',cursor:'pointer'}}/>
          </div>
          <div style={{display:'flex',gap:6,overflow:'auto',paddingBottom:12,scrollbarWidth:'none'}}>
            {['全て','J下部','街クラブ','U12','U10','東京都','受付中'].map((f,i)=>(
              <span key={f} style={{flexShrink:0,padding:'5px 12px',borderRadius:20,border:`1px solid ${i===0?'#1a1a1a':'#e8e8e4'}`,fontSize:10,
                background:i===0?'#1a1a1a':'white',color:i===0?'white':'#666',whiteSpace:'nowrap',cursor:'pointer'}}
                onClick={()=>window.location.href=`/teams${i>0?`?type=${f}`:''}`}>
                {f}
              </span>
            ))}
          </div>
        </div>

        <div style={{padding:'16px',background:'#f8f8f6'}}>

          <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:10,textTransform:'uppercase'}}>何を探していますか？</p>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>

            <button onClick={()=>setSelected(selected==='jy'?null:'jy')}
              style={{width:'100%',padding:'14px',borderRadius:12,border:`1px solid ${selected==='jy'?'#1a1a1a':'#eeeeea'}`,background:'white',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:10,background:'#f0f0ec',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>⚽</div>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>ジュニアユースを探す</p>
                <p style={{fontSize:10,color:'#999'}}>中学生年代（U13〜U15）のクラブチーム</p>
                <div style={{display:'flex',gap:4,marginTop:4,flexWrap:'wrap'}}>
                  {['J下部組織','街クラブ','セレクション情報'].map(t=>(
                    <span key={t} style={{fontSize:8,padding:'1px 6px',borderRadius:8,background:'#f0f0ec',color:'#666'}}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{color:'#ccc',fontSize:18}}>›</span>
            </button>

            {selected==='jy' && (
              <div style={{background:'#f0f7ff',border:'1px solid #cce0ff',borderRadius:12,padding:'12px 14px'}}>
                <p style={{fontSize:10,fontWeight:500,color:'#0C447C',marginBottom:10}}>エリアを選んでください</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
                  {[['東京都','#EEEDFE','#3C3489'],['神奈川県','#FAEEDA','#633806'],['埼玉県','#E6F1FB','#0C447C'],['千葉県','#E1F5EE','#085041']].map(([pref,bg,co])=>(
                    <Link key={pref} href={`/teams?pref=${pref}&cat=ジュニアユース`}
                      style={{padding:'10px 8px',borderRadius:8,background:bg,color:co,textAlign:'center',fontSize:12,fontWeight:500,textDecoration:'none',display:'block'}}>
                      {pref}
                    </Link>
                  ))}
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  <Link href="/teams?type=J下部&cat=ジュニアユース" style={{fontSize:10,padding:'4px 10px',borderRadius:10,background:'white',border:'1px solid #cce0ff',color:'#185FA5',textDecoration:'none'}}>J下部のみ</Link>
                  <Link href="/teams?cat=ジュニアユース" style={{fontSize:10,padding:'4px 10px',borderRadius:10,background:'#FAEEDA',border:'1px solid #EF9F27',color:'#633806',textDecoration:'none'}}>受付中のみ</Link>
                </div>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='junior'?null:'junior')}
              style={{width:'100%',padding:'14px',borderRadius:12,border:`1px solid ${selected==='junior'?'#1a1a1a':'#eeeeea'}`,background:'white',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:10,background:'#f0f7f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🔍</div>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>ジュニアを探す</p>
                <p style={{fontSize:10,color:'#999'}}>学年・年齢からカテゴリを探せます</p>
                <div style={{display:'flex',gap:4,marginTop:4,flexWrap:'wrap'}}>
                  {['小1〜小6','U8/U10/U12','年齢で検索'].map(t=>(
                    <span key={t} style={{fontSize:8,padding:'1px 6px',borderRadius:8,background:'#f0f7f0',color:'#2d6a2d'}}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{color:'#ccc',fontSize:18}}>›</span>
            </button>

            {selected==='junior' && (
              <div style={{background:'#f0fff8',border:'1px solid #b2dfdb',borderRadius:12,padding:'12px 14px'}}>
                <p style={{fontSize:10,fontWeight:500,color:'#085041',marginBottom:10}}>学年を選んでください</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:8}}>
                  {[['小1','U8'],['小2','U8'],['小3','U10'],['小4','U10'],['小5','U12'],['小6','U12'],['中1','JY'],['中2','JY'],['中3','JY']].map(([g,cat])=>(
                    <Link key={g} href={`/teams?cat=${cat==='JY'?'ジュニアユース':cat}`}
                      style={{padding:'8px 4px',borderRadius:8,background:'white',border:'1px solid #b2dfdb',textAlign:'center',textDecoration:'none',display:'block'}}>
                      <p style={{fontSize:12,fontWeight:500,color:'#085041'}}>{g}</p>
                      <p style={{fontSize:9,color:'#0F6E56',marginTop:1}}>{cat}</p>
                    </Link>
                  ))}
                </div>
                <p style={{fontSize:9,color:'#aaa'}}>U8=7〜8歳 / U10=9〜10歳 / U12=11〜12歳</p>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='academy'?null:'academy')}
              style={{width:'100%',padding:'14px',borderRadius:12,border:`1px solid ${selected==='academy'?'#1a1a1a':'#eeeeea'}`,background:'white',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:10,background:'#fff8f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🏆</div>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>アカデミーを探す</p>
                <p style={{fontSize:10,color:'#999'}}>Jクラブ・専門スクール・ユニーク塾</p>
                <div style={{display:'flex',gap:4,marginTop:4,flexWrap:'wrap'}}>
                  {['J1/J2下部','ドリブル塾','GK専門'].map(t=>(
                    <span key={t} style={{fontSize:8,padding:'1px 6px',borderRadius:8,background:'#fff8f0',color:'#854F0B'}}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{color:'#ccc',fontSize:18}}>›</span>
            </button>

            {selected==='academy' && (
              <div style={{background:'#fff8f0',border:'1px solid #ffe0b2',borderRadius:12,padding:'12px 14px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {[
                    ['J1下部','#1a1a1a','white','J1リーグクラブ直系'],
                    ['J2/J3下部','#444','white','Jリーグ下部組織'],
                    ['ドリブル・キック専門','#854F0B','#fff8f0','個人技特化スクール'],
                    ['GK・守備専門','#185FA5','#E6F1FB','ポジション特化'],
                    ['フィジカル特化','#0F6E56','#E1F5EE','体づくり重視'],
                  ].map(([label,co,bg,desc])=>(
                    <Link key={label} href={`/teams?type=${encodeURIComponent(label==='J1下部'?'J下部':'スクール')}`}
                      style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',borderRadius:8,background:bg,textDecoration:'none'}}>
                      <div>
                        <p style={{fontSize:12,fontWeight:500,color:co}}>{label}</p>
                        <p style={{fontSize:9,color:'#999'}}>{desc}</p>
                      </div>
                      <span style={{fontSize:10,color:'#ccc'}}>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:10,textTransform:'uppercase'}}>受付中のセレクション</p>
          <div style={{display:'flex',gap:8,overflow:'auto',paddingBottom:4,scrollbarWidth:'none',marginBottom:16}}>
            {SELECTIONS.map(s=>(
              <Link key={s.name} href="/teams" style={{flexShrink:0,minWidth:140,background:'white',borderRadius:10,border:`1px solid ${s.bg}`,padding:'10px 12px',textDecoration:'none',display:'block'}}>
                <p style={{fontSize:9,fontWeight:500,color:s.color,marginBottom:3}}>{s.status}</p>
                <p style={{fontSize:11,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{s.name}</p>
                <p style={{fontSize:9,color:'#999'}}>{s.deadline}</p>
              </Link>
            ))}
          </div>

          <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:10,textTransform:'uppercase'}}>その他の機能</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
            {[
              ['/calendar','📅','セレクション\nカレンダー'],
              ['/body-check','📏','体格診断＆\n栄養アドバイス'],
              ['/shoes','👟','シューズ\nランキング'],
              ['/nutrition','🥗','栄養・\n補助食品'],
            ].map(([href,emoji,label])=>(
              <Link key={String(href)} href={String(href)}
                style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 12px',textDecoration:'none',display:'block'}}>
                <p style={{fontSize:22,marginBottom:6}}>{emoji}</p>
                <p style={{fontSize:11,fontWeight:500,color:'#1a1a1a',whiteSpace:'pre-line',lineHeight:1.4}}>{label}</p>
              </Link>
            ))}
          </div>

          <div style={{display:'flex',gap:8}}>
            <a href="https://twitter.com/intent/tweet?text=関東ジュニアサッカー情報局%20-%20U8〜ジュニアユースのセレクション情報&url=https://soccer-tokyo-jp.vercel.app"
              target="_blank" rel="noopener noreferrer"
              style={{flex:1,padding:'10px',borderRadius:10,background:'#1a1a1a',color:'white',fontSize:11,textAlign:'center',textDecoration:'none',display:'block'}}>
              X(Twitter)でシェア
            </a>
          </div>
          <a href="https://line.me/R/msg/text/?関東ジュニアサッカー情報局%0Ahttps://soccer-tokyo-jp.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{display:'block',marginTop:6,padding:'10px',borderRadius:10,background:'#06C755',color:'white',fontSize:11,textAlign:'center',textDecoration:'none'}}>
            LINEでシェア
          </a>

        </div>
      </div>
    </main>
  )
}
