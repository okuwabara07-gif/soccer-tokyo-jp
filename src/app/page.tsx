'use client'
import { useState } from 'react'
import Link from 'next/link'

const SELECTIONS = [
  {name:'FC東京U-15深川', area:'江東区', deadline:'6/30', status:'受付中', color:'#E24B4A', bg:'#FCEBEB'},
  {name:'東京ヴェルディJY', area:'稲城市', deadline:'7月〜', status:'情報あり', color:'#1D9E75', bg:'#E1F5EE'},
  {name:'横浜F・マリノスJY', area:'横浜市', deadline:'7月〜', status:'受付中', color:'#E24B4A', bg:'#FCEBEB'},
  {name:'浦和レッズJY', area:'さいたま市', deadline:'7月〜', status:'受付中', color:'#E24B4A', bg:'#FCEBEB'},
]

export default function Home() {
  const [selected, setSelected] = useState<string|null>(null)

  return (
    <main style={{minHeight:'100vh',background:'#f5f5f7',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{background:'#1a1a1a',padding:'20px 16px 20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:2}}>KANTO JUNIOR SOCCER</p>
              <p style={{fontSize:20,fontWeight:300,color:'white'}}>関東ジュニアサッカー情報局</p>
            </div>
            <Link href="/mypage" style={{width:38,height:38,borderRadius:'50%',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,textDecoration:'none'}}>👤</Link>
          </div>

          <div style={{background:'rgba(255,255,255,0.06)',borderRadius:16,padding:14,display:'flex',alignItems:'center',gap:16}}>
            <div style={{position:'relative',width:72,height:72,flexShrink:0}}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                <circle cx="36" cy="36" r="30" fill="none" stroke="#EF9F27" strokeWidth="6"
                  strokeDasharray="188.5" strokeDashoffset="37.7" strokeLinecap="round" transform="rotate(-90 36 36)"/>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontSize:16,fontWeight:500,color:'white'}}>80%</span>
                <span style={{fontSize:8,color:'rgba(255,255,255,0.4)'}}>達成</span>
              </div>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:500,color:'white',marginBottom:4}}>今週の目標</p>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:8}}>気になるチーム4/5チーム確認済み</p>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                <span style={{fontSize:10,padding:'3px 8px',borderRadius:10,background:'rgba(239,159,39,0.2)',color:'#EF9F27'}}>受付中 2件</span>
                <span style={{fontSize:10,padding:'3px 8px',borderRadius:10,background:'rgba(29,158,117,0.2)',color:'#1D9E75'}}>締切間近</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{padding:'14px 14px 0'}}>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:14}}>
            {[['180+','登録チーム','#1a1a1a'],['15','ブロック','#378ADD'],['4','都県','#1D9E75'],['U8-JY','カテゴリ','#EF9F27']].map(([v,l,c])=>(
              <div key={String(l)} style={{background:'white',borderRadius:12,padding:'10px 8px',textAlign:'center'}}>
                <p style={{fontSize:16,fontWeight:500,color:String(c),marginBottom:2}}>{v}</p>
                <p style={{fontSize:9,color:'#999'}}>{l}</p>
              </div>
            ))}
          </div>

          <div style={{background:'white',borderRadius:16,padding:'8px 12px',display:'flex',alignItems:'center',gap:8,marginBottom:14,border:'1px solid #e8e8e4'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="チーム名・区・カテゴリで検索..." onClick={()=>window.location.href='/teams'}
              readOnly style={{flex:1,border:'none',background:'transparent',fontSize:13,outline:'none',cursor:'pointer',color:'#999'}}/>
          </div>

          <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>何を探していますか？</p>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>

            <button onClick={()=>setSelected(selected==='jy'?null:'jy')}
              style={{background:'white',borderRadius:16,border:selected==='jy'?'2px solid #1a1a1a':'1px solid #eeeeea',padding:'14px',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12,width:'100%'}}>
              <div style={{width:48,height:48,borderRadius:14,background:'#FFE8DC',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>⚽</div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:500,color:'#1a1a1a',marginBottom:3}}>ジュニアユースを探す</p>
                <p style={{fontSize:12,color:'#999',marginBottom:6}}>中学生年代（U13〜U15）のクラブチーム</p>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {['J下部組織','街クラブ','セレクション情報'].map(t=>(
                    <span key={t} style={{fontSize:10,padding:'2px 8px',borderRadius:8,background:'#FFE8DC',color:'#99472A'}}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{color:'#ccc',fontSize:20}}>›</span>
            </button>

            {selected==='jy' && (
              <div style={{background:'#f8f8f6',borderRadius:12,padding:'12px 14px',border:'1px solid #e8e8e4'}}>
                <p style={{fontSize:12,fontWeight:500,color:'#1a1a1a',marginBottom:10}}>エリアを選んでください</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
                  {[['東京都','#E8E0FF','#2D1F5C'],['神奈川県','#FFE8DC','#5C2510'],['埼玉県','#D8F5E8','#0D3320'],['千葉県','#FFE0D8','#5C1A0D']].map(([p,bg,co])=>(
                    <Link key={p} href={`/teams?pref=${p}&cat=ジュニアユース`}
                      style={{padding:'12px 8px',borderRadius:10,background:String(bg),color:String(co),textAlign:'center',fontSize:13,fontWeight:500,textDecoration:'none',display:'block'}}>
                      {p}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='junior'?null:'junior')}
              style={{background:'white',borderRadius:16,border:selected==='junior'?'2px solid #1a1a1a':'1px solid #eeeeea',padding:'14px',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12,width:'100%'}}>
              <div style={{width:48,height:48,borderRadius:14,background:'#D8F5E8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🔍</div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:500,color:'#1a1a1a',marginBottom:3}}>ジュニアを探す</p>
                <p style={{fontSize:12,color:'#999',marginBottom:6}}>学年・年齢からカテゴリを探せます</p>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {['小1〜小6','U8/U10/U12','年齢で検索'].map(t=>(
                    <span key={t} style={{fontSize:10,padding:'2px 8px',borderRadius:8,background:'#D8F5E8',color:'#0D3320'}}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{color:'#ccc',fontSize:20}}>›</span>
            </button>

            {selected==='junior' && (
              <div style={{background:'#f8f8f6',borderRadius:12,padding:'12px 14px',border:'1px solid #e8e8e4'}}>
                <p style={{fontSize:12,fontWeight:500,color:'#1a1a1a',marginBottom:10}}>学年を選んでください</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:8}}>
                  {[['小1','U8'],['小2','U8'],['小3','U10'],['小4','U10'],['小5','U12'],['小6','U12']].map(([g,cat])=>(
                    <Link key={g} href={`/teams?cat=${cat}`}
                      style={{padding:'10px 4px',borderRadius:10,background:'white',border:'1px solid #e8e8e4',textAlign:'center',textDecoration:'none',display:'block'}}>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a'}}>{g}</p>
                      <p style={{fontSize:10,color:'#1D9E75',marginTop:1}}>{cat}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='academy'?null:'academy')}
              style={{background:'white',borderRadius:16,border:selected==='academy'?'2px solid #1a1a1a':'1px solid #eeeeea',padding:'14px',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12,width:'100%'}}>
              <div style={{width:48,height:48,borderRadius:14,background:'#E8E0FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🏆</div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:500,color:'#1a1a1a',marginBottom:3}}>アカデミーを探す</p>
                <p style={{fontSize:12,color:'#999',marginBottom:6}}>Jクラブ・専門スクール・ユニーク塾</p>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {['J1/J2下部','ドリブル塾','GK専門'].map(t=>(
                    <span key={t} style={{fontSize:10,padding:'2px 8px',borderRadius:8,background:'#E8E0FF',color:'#2D1F5C'}}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{color:'#ccc',fontSize:20}}>›</span>
            </button>

          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            <div style={{background:'#FFE8DC',borderRadius:16,padding:14}}>
              <p style={{fontSize:10,color:'#99472A',marginBottom:6}}>📅 セレクション</p>
              <p style={{fontSize:14,fontWeight:500,color:'#5C2510',lineHeight:1.4,marginBottom:4}}>受付中<br/>2チーム</p>
              <Link href="/calendar" style={{fontSize:11,color:'#99472A',textDecoration:'none'}}>カレンダーを見る →</Link>
            </div>
            <div style={{background:'#E8E0FF',borderRadius:16,padding:14}}>
              <p style={{fontSize:10,color:'#4A3580',marginBottom:6}}>⚽ チーム情報</p>
              <p style={{fontSize:14,fontWeight:500,color:'#2D1F5C',lineHeight:1.4,marginBottom:4}}>180+チーム<br/>登録済み</p>
              <Link href="/teams" style={{fontSize:11,color:'#4A3580',textDecoration:'none'}}>チームを探す →</Link>
            </div>
            <div style={{background:'#D8F5E8',borderRadius:16,padding:14}}>
              <p style={{fontSize:10,color:'#1A6640',marginBottom:6}}>📷 AI診断</p>
              <p style={{fontSize:14,fontWeight:500,color:'#0D3320',lineHeight:1.4,marginBottom:4}}>足型から<br/>シューズ提案</p>
              <Link href="/foot-camera" style={{fontSize:11,color:'#1A6640',textDecoration:'none'}}>診断する →</Link>
            </div>
            <div style={{background:'#FFE0D8',borderRadius:16,padding:14}}>
              <p style={{fontSize:10,color:'#993322',marginBottom:6}}>🥗 栄養管理</p>
              <p style={{fontSize:14,fontWeight:500,color:'#5C1A0D',lineHeight:1.4,marginBottom:4}}>体格診断＆<br/>食事プラン</p>
              <Link href="/body-check" style={{fontSize:11,color:'#993322',textDecoration:'none'}}>診断する →</Link>
            </div>
          </div>

          <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>受付中のセレクション</p>
          <div style={{background:'white',borderRadius:16,padding:14,marginBottom:14}}>
            <svg width="100%" height="70" viewBox="0 0 300 70" style={{marginBottom:6}}>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#378ADD" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#378ADD" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,55 L50,45 L100,25 L150,35 L200,15 L250,30 L300,10" fill="none" stroke="#378ADD" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M0,55 L50,45 L100,25 L150,35 L200,15 L250,30 L300,10 L300,70 L0,70Z" fill="url(#lg)"/>
              <circle cx="200" cy="15" r="5" fill="#E24B4A"/>
              <circle cx="200" cy="15" r="2.5" fill="white"/>
            </svg>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#bbb'}}>
              <span>4月</span><span>5月</span><span>6月</span><span>7月</span><span>8月</span><span>9月</span><span>10月</span>
            </div>
          </div>

          <div style={{display:'flex',gap:6,overflow:'auto',paddingBottom:4,marginBottom:14,scrollbarWidth:'none' as any}}>
            {SELECTIONS.map(s=>(
              <Link key={s.name} href="/teams" style={{flexShrink:0,minWidth:150,background:'white',borderRadius:14,border:`1px solid ${s.bg}`,padding:'12px',textDecoration:'none',display:'block',borderLeft:`3px solid ${s.color}`}}>
                <p style={{fontSize:10,fontWeight:500,color:s.color,marginBottom:3}}>{s.status}</p>
                <p style={{fontSize:12,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{s.name}</p>
                <p style={{fontSize:10,color:'#999'}}>{s.area} · {s.deadline}</p>
              </Link>
            ))}
          </div>

          <div style={{background:'#1a1a1a',borderRadius:16,padding:'14px 16px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <p style={{fontSize:13,fontWeight:500,color:'white',marginBottom:2}}>パパママ応援プラン</p>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>申込URL・詳細情報が見られます</p>
            </div>
            <Link href="/member" style={{padding:'8px 14px',borderRadius:10,background:'#EF9F27',color:'white',fontSize:12,fontWeight:500,textDecoration:'none',flexShrink:0}}>
              ¥4,500
            </Link>
          </div>

          <div style={{display:'flex',gap:8,marginBottom:20}}>
            <a href="https://twitter.com/intent/tweet?text=関東ジュニアサッカー情報局&url=https://soccer-tokyo-jp.vercel.app"
              target="_blank" rel="noopener noreferrer"
              style={{flex:1,padding:'12px',borderRadius:12,background:'#1a1a1a',color:'white',fontSize:12,textAlign:'center',textDecoration:'none'}}>
              𝕏 シェア
            </a>
            <a href="https://line.me/R/msg/text/?関東ジュニアサッカー情報局%0Ahttps://soccer-tokyo-jp.vercel.app"
              target="_blank" rel="noopener noreferrer"
              style={{flex:1,padding:'12px',borderRadius:12,background:'#06C755',color:'white',fontSize:12,textAlign:'center',textDecoration:'none'}}>
              LINE
            </a>
          </div>

        </div>

        <div style={{display:'flex',background:'white',borderTop:'1px solid #f0f0f0',padding:'8px 0 4px'}}>
          {[['/','🏠','ホーム'],['/teams','⚽','チーム'],['/calendar','📅','日程'],['/nutrition','🥗','栄養'],['/mypage','👤','マイページ']].map(([href,emoji,label])=>(
            <Link key={String(href)} href={String(href)}
              style={{flex:1,textAlign:'center',textDecoration:'none',padding:'4px 0'}}>
              <span style={{fontSize:20,display:'block'}}>{emoji}</span>
              <span style={{fontSize:9,color:'#999'}}>{label}</span>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
