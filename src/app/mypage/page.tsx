'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const FAVORITE_TEAMS = [
  { id:'1', name:'FC東京U-15深川', area:'江東区', category:'ジュニアユース', status:'受付中', deadline:'6/30' },
  { id:'2', name:'東京ヴェルディJY', area:'稲城市', category:'ジュニアユース', status:'情報あり', deadline:'7月〜' },
]

const NOTIFICATIONS = [
  { id:'1', type:'deadline', text:'FC東京U-15深川 申込締切まであと7日', time:'2時間前', read:false },
  { id:'2', type:'new', text:'バディSCジュニアユース セレクション情報が更新されました', time:'1日前', read:false },
  { id:'3', type:'result', text:'セレクションカレンダーが更新されました', time:'3日前', read:true },
]

export default function MyPage() {
  const [tab, setTab] = useState<'home'|'favorites'|'notify'|'settings'>('home')
  const [plan] = useState('standard')

  const planLabel: Record<string,string> = {
    papa_mama:'パパママ応援プラン',
    standard:'スタンダード',
    premium:'プレミアム'
  }

  const unread = NOTIFICATIONS.filter(n=>!n.read).length

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← トップへ</Link>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <h1 style={{color:'white',fontSize:20,fontWeight:300,marginBottom:2}}>マイページ</h1>
              <span style={{fontSize:9,padding:'2px 8px',borderRadius:8,background:'#c9a84c',color:'white',fontWeight:500}}>{planLabel[plan]}</span>
            </div>
            <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:18}}>
              👤
            </div>
          </div>
        </div>

        <div style={{display:'flex',background:'white',borderBottom:'1px solid #eeeeea'}}>
          {[['home','ホーム'],['favorites','お気に入り'],['notify','通知'],['settings','設定']].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id as any)}
              style={{flex:1,padding:'10px 4px',fontSize:10,border:'none',background:'transparent',cursor:'pointer',
                borderBottom:`2px solid ${tab===id?'#1a1a1a':'transparent'}`,
                color:tab===id?'#1a1a1a':'#999',position:'relative'}}>
              {label}
              {id==='notify' && unread>0 && (
                <span style={{position:'absolute',top:6,right:'calc(50% - 14px)',width:14,height:14,borderRadius:'50%',background:'#E24B4A',color:'white',fontSize:8,display:'flex',alignItems:'center',justifyContent:'center'}}>{unread}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{padding:16}}>

          {tab==='home' && (
            <div>
              <div style={{background:'#1a1a1a',borderRadius:12,padding:'14px 16px',marginBottom:14}}>
                <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:6}}>現在のプラン</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <p style={{fontSize:14,fontWeight:500,color:'white',marginBottom:2}}>{planLabel[plan]}</p>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>次回更新：2026年5月1日</p>
                  </div>
                  <Link href="/member" style={{fontSize:10,padding:'6px 12px',borderRadius:8,background:'rgba(255,255,255,0.1)',color:'white',textDecoration:'none'}}>
                    プラン変更
                  </Link>
                </div>
              </div>

              <p style={{fontSize:9,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>クイックアクセス</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
                {[
                  ['/teams','⚽','チームを探す'],
                  ['/calendar','📅','カレンダー'],
                  ['/shoes','👟','シューズ選び'],
                  ['/foot-camera','📷','AI足型診断'],
                  ['/nutrition','🥗','栄養・補助食品'],
                  ['/body-check','📏','体格診断'],
                ].map(([href,emoji,label])=>(
                  <Link key={String(href)} href={String(href)}
                    style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px',textDecoration:'none',display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:20}}>{emoji}</span>
                    <span style={{fontSize:11,fontWeight:500,color:'#1a1a1a'}}>{label}</span>
                  </Link>
                ))}
              </div>

              <p style={{fontSize:9,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>最近見たチーム</p>
              {FAVORITE_TEAMS.slice(0,2).map(t=>(
                <div key={t.id} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <p style={{fontSize:12,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{t.name}</p>
                    <p style={{fontSize:10,color:'#999'}}>{t.area} · {t.category}</p>
                  </div>
                  <span style={{fontSize:9,padding:'2px 8px',borderRadius:8,
                    background:t.status==='受付中'?'#FAEEDA':'#E1F5EE',
                    color:t.status==='受付中'?'#633806':'#085041'}}>{t.status}</span>
                </div>
              ))}
            </div>
          )}

          {tab==='favorites' && (
            <div>
              <p style={{fontSize:9,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>お気に入りチーム</p>
              {FAVORITE_TEAMS.map(t=>(
                <div key={t.id} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px',marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                    <div>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{t.name}</p>
                      <p style={{fontSize:10,color:'#999'}}>{t.area} · {t.category}</p>
                    </div>
                    <span style={{fontSize:9,padding:'2px 8px',borderRadius:8,
                      background:t.status==='受付中'?'#FAEEDA':'#E1F5EE',
                      color:t.status==='受付中'?'#633806':'#085041'}}>{t.status}</span>
                  </div>
                  {t.deadline && (
                    <div style={{background:'#f8f8f6',borderRadius:8,padding:'6px 10px',display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:10,color:'#666'}}>申込締切</span>
                      <span style={{fontSize:10,fontWeight:500,color:t.status==='受付中'?'#E24B4A':'#666'}}>{t.deadline}</span>
                    </div>
                  )}
                </div>
              ))}
              <Link href="/teams" style={{display:'block',padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',background:'white',color:'#666',fontSize:12,textAlign:'center',textDecoration:'none',marginTop:8}}>
                + チームを追加する
              </Link>
            </div>
          )}

          {tab==='notify' && (
            <div>
              <p style={{fontSize:9,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>通知</p>
              {NOTIFICATIONS.map(n=>(
                <div key={n.id} style={{background:'white',borderRadius:12,border:`1px solid ${n.read?'#eeeeea':'#e0d0ff'}`,padding:'12px',marginBottom:8,
                  borderLeft:`3px solid ${n.read?'#eeeeea':'#7F77DD'}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                    <p style={{fontSize:12,color:n.read?'#666':'#1a1a1a',lineHeight:1.5,flex:1}}>{n.text}</p>
                    {!n.read && <span style={{width:6,height:6,borderRadius:'50%',background:'#7F77DD',flexShrink:0,marginTop:4}}></span>}
                  </div>
                  <p style={{fontSize:10,color:'#bbb',marginTop:4}}>{n.time}</p>
                </div>
              ))}
            </div>
          )}

          {tab==='settings' && (
            <div>
              <p style={{fontSize:9,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>アカウント設定</p>
              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',overflow:'hidden',marginBottom:14}}>
                {[
                  ['プラン・お支払い','現在：スタンダード'],
                  ['通知設定','セレクション速報・締切通知'],
                  ['お気に入り管理','2チーム登録中'],
                  ['メールアドレス変更',''],
                  ['パスワード変更',''],
                ].map(([label,sub],i)=>(
                  <div key={label} style={{padding:'12px 14px',borderBottom:i<4?'1px solid #f5f5f5':'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <p style={{fontSize:12,color:'#1a1a1a'}}>{label}</p>
                      {sub && <p style={{fontSize:10,color:'#999',marginTop:1}}>{sub}</p>}
                    </div>
                    <span style={{fontSize:14,color:'#ccc'}}>›</span>
                  </div>
                ))}
              </div>
              <button style={{width:'100%',padding:'12px',borderRadius:10,border:'1px solid #FCEBEB',background:'#FCEBEB',color:'#791F1F',fontSize:12,cursor:'pointer'}}>
                ログアウト
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
