'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const UNSPLASH = 'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=480&h=260&fit=crop&auto=format'

export default function Home() {
  const [counts, setCounts] = useState({jy:0,u12:0,academy:0,total:0})
  const [selected, setSelected] = useState<string|null>(null)
  const [sponsors, setSponsors] = useState<any[]>([])

  useEffect(()=>{
    supabase.from('teams').select('category').then(({data})=>{
      if(!data) return
      const jy = data.filter(t=>t.category==='ジュニアユース').length
      const u12 = data.filter(t=>['U12','U10','U8','U8〜U12'].includes(t.category)).length
      const academy = data.filter(t=>t.category?.includes('スクール')||t.category?.includes('U8〜U15')||t.category?.includes('U12〜U15')).length
      setCounts({jy,u12,academy,total:data.length})
    })
    supabase.from('sponsors').select('*').eq('is_active',true).eq('position','top').then(({data})=>setSponsors(data||[]))
  },[])

  const share = (type: string) => {
    const url = 'https://soccer-tokyo-jp.vercel.app'
    const text = '関東ジュニアサッカー情報局 - U8〜ジュニアユースのセレクション情報'
    if(type==='x') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
    if(type==='line') window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text+'\n'+url)}`)
    if(type==='instagram') { navigator.clipboard.writeText(url); alert('URLをコピーしました！Instagramに貼り付けてください') }
    if(type==='facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
  }

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{background:'#0a0a0a',padding:'0 0 0'}}>
          <div style={{position:'relative',height:200,overflow:'hidden'}}>
            <img src={UNSPLASH} alt="soccer" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.5}} onError={e=>(e.currentTarget.style.display='none')}/>
            <div style={{position:'absolute',inset:0,padding:'16px 16px 0',display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingBottom:16}}>
              <div style={{fontSize:9,letterSpacing:'0.15em',color:'rgba(255,255,255,0.5)',marginBottom:4}}>KANTO JUNIOR SOCCER</div>
              <h1 style={{fontSize:22,fontWeight:300,color:'white',letterSpacing:'-0.02em',marginBottom:2}}>関東ジュニアサッカー情報局</h1>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>U8〜ジュニアユース {counts.total}チーム掲載中</p>
            </div>
          </div>

          <div style={{display:'flex',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
            {[['/',  '🏠','ホーム'],['/teams','⚽','チーム'],['/calendar','📅','日程'],['/nutrition','🥗','栄養'],['/mypage','👤','マイページ']].map(([href,icon,label])=>(
              <Link key={String(href)} href={String(href)}
                style={{flex:1,padding:'10px 4px',textAlign:'center',textDecoration:'none',borderBottom:href==='/'?'2px solid white':'2px solid transparent'}}>
                <div style={{fontSize:16,marginBottom:2}}>{icon}</div>
                <div style={{fontSize:9,color:href==='/'?'white':'rgba(255,255,255,0.4)'}}>{label}</div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{padding:'14px 14px 0'}}>

          <div style={{background:'#1a1a1a',borderRadius:12,padding:'14px 16px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <p style={{fontSize:13,fontWeight:500,color:'white',marginBottom:1}}>パパママ応援プラン</p>
              <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>6ヶ月限定・申込URL閲覧可能</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{fontSize:20,fontWeight:300,color:'#c9a84c'}}>¥4,500</p>
              <p style={{fontSize:9,color:'rgba(255,255,255,0.3)',textDecoration:'line-through'}}>通常 ¥6,000</p>
            </div>
          </div>

          {sponsors.length>0 && sponsors.map(s=>(
            <a key={s.id} href={s.link_url||'mailto:info@aokae.co.jp'} target="_blank" rel="noopener noreferrer"
              style={{display:'block',marginBottom:12,textDecoration:'none'}}>
              {s.image_url ? (
                <img src={s.image_url} alt={s.name} style={{width:'100%',height:80,objectFit:'cover',borderRadius:10}}/>
              ) : (
                <div style={{background:'white',border:'1.5px dashed #ccc',borderRadius:10,padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <p style={{fontSize:9,color:'#999',marginBottom:2,letterSpacing:'0.1em'}}>SPONSOR</p>
                    <p style={{fontSize:13,fontWeight:500,color:'#666'}}>スポンサー募集中</p>
                    <p style={{fontSize:10,color:'#aaa'}}>掲載料：¥10,000〜/月 · info@aokae.co.jp</p>
                  </div>
                  <div style={{background:'#1a1a1a',borderRadius:8,padding:'6px 12px',flexShrink:0}}>
                    <p style={{fontSize:10,color:'white',fontWeight:500}}>掲載のご案内</p>
                  </div>
                </div>
              )}
            </a>
          ))}

          <div style={{background:'white',border:'1px solid #e8e8e4',borderRadius:24,padding:'8px 14px',display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="チーム名・区・カテゴリで検索（かな・カナ・英語OK）"
              onClick={()=>window.location.href='/teams'}
              readOnly
              style={{flex:1,border:'none',background:'transparent',fontSize:12,color:'#999',outline:'none',cursor:'pointer'}}/>
          </div>

          <div style={{display:'flex',gap:6,overflow:'auto',paddingBottom:12,scrollbarWidth:'none'}}>
            {['全て','J下部','街クラブ','U12','U10','東京都','受付中'].map((f,i)=>(
              <span key={f} onClick={()=>window.location.href=`/teams${i>0?`?type=${encodeURIComponent(f)}`:''}`}
                style={{flexShrink:0,padding:'5px 12px',borderRadius:20,border:`1px solid ${i===0?'#1a1a1a':'#e8e8e4'}`,fontSize:11,
                background:i===0?'#1a1a1a':'white',color:i===0?'white':'#666',cursor:'pointer'}}>
                {f}
              </span>
            ))}
          </div>

          <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>何を探していますか？</p>

          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
            <button onClick={()=>setSelected(selected==='jy'?null:'jy')}
              style={{width:'100%',padding:'14px',borderRadius:12,border:`1.5px solid ${selected==='jy'?'#1a1a1a':'#eeeeea'}`,background:'white',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:10,background:'#E6F1FB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>⚽</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{fontSize:14,fontWeight:500,color:'#1a1a1a'}}>ジュニアユースを探す</p>
                  <span style={{fontSize:11,padding:'2px 8px',borderRadius:8,background:'#E6F1FB',color:'#0C447C',fontWeight:500}}>{counts.jy}チーム</span>
                </div>
                <p style={{fontSize:11,color:'#999',marginTop:2}}>中学生年代（U13〜U15）のクラブチーム</p>
              </div>
            </button>

            {selected==='jy' && (
              <div style={{background:'#E6F1FB',border:'1px solid #B5D4F4',borderRadius:12,padding:'12px 14px'}}>
                <p style={{fontSize:11,fontWeight:500,color:'#0C447C',marginBottom:10}}>エリアを選んでください</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
                  {[['東京都','#EEEDFE','#3C3489'],['神奈川県','#FAEEDA','#633806'],['埼玉県','#E6F1FB','#0C447C'],['千葉県','#E1F5EE','#085041']].map(([pref,bg,co])=>(
                    <Link key={pref} href={`/teams?pref=${encodeURIComponent(pref)}&cat=${encodeURIComponent('ジュニアユース')}`}
                      style={{padding:'10px 8px',borderRadius:8,background:bg,color:co,textAlign:'center',fontSize:13,fontWeight:500,textDecoration:'none',display:'block'}}>
                      {pref}
                    </Link>
                  ))}
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  <Link href="/teams?type=J%E4%B8%8B%E9%83%A8&cat=%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%83%A6%E3%83%BC%E3%82%B9" style={{fontSize:11,padding:'4px 10px',borderRadius:10,background:'white',border:'1px solid #B5D4F4',color:'#185FA5',textDecoration:'none'}}>J下部のみ</Link>
                  <Link href="/teams?cat=%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%83%A6%E3%83%BC%E3%82%B9" style={{fontSize:11,padding:'4px 10px',borderRadius:10,background:'#FAEEDA',border:'1px solid #EF9F27',color:'#633806',textDecoration:'none'}}>受付中のみ</Link>
                </div>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='junior'?null:'junior')}
              style={{width:'100%',padding:'14px',borderRadius:12,border:`1.5px solid ${selected==='junior'?'#1a1a1a':'#eeeeea'}`,background:'white',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:10,background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🔍</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{fontSize:14,fontWeight:500,color:'#1a1a1a'}}>ジュニアを探す</p>
                  <span style={{fontSize:11,padding:'2px 8px',borderRadius:8,background:'#E1F5EE',color:'#085041',fontWeight:500}}>{counts.u12}チーム</span>
                </div>
                <p style={{fontSize:11,color:'#999',marginTop:2}}>学年・年齢からカテゴリを探せます</p>
              </div>
            </button>

            {selected==='junior' && (
              <div style={{background:'#E1F5EE',border:'1px solid #9FE1CB',borderRadius:12,padding:'12px 14px'}}>
                <p style={{fontSize:11,fontWeight:500,color:'#085041',marginBottom:10}}>学年を選んでください</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:8}}>
                  {[['小1','U8'],['小2','U8'],['小3','U10'],['小4','U10'],['小5','U12'],['小6','U12']].map(([g,cat])=>(
                    <Link key={g} href={`/teams?cat=${encodeURIComponent(cat)}`}
                      style={{padding:'10px 4px',borderRadius:8,background:'white',border:'1px solid #9FE1CB',textAlign:'center',textDecoration:'none',display:'block'}}>
                      <p style={{fontSize:13,fontWeight:500,color:'#085041'}}>{g}</p>
                      <p style={{fontSize:10,color:'#0F6E56',marginTop:1}}>{cat}</p>
                    </Link>
                  ))}
                </div>
                <p style={{fontSize:10,color:'#aaa'}}>U8=7〜8歳 / U10=9〜10歳 / U12=11〜12歳</p>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='academy'?null:'academy')}
              style={{width:'100%',padding:'14px',borderRadius:12,border:`1.5px solid ${selected==='academy'?'#1a1a1a':'#eeeeea'}`,background:'white',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:10,background:'#FAEEDA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🏆</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{fontSize:14,fontWeight:500,color:'#1a1a1a'}}>アカデミーを探す</p>
                  <span style={{fontSize:11,padding:'2px 8px',borderRadius:8,background:'#FAEEDA',color:'#633806',fontWeight:500}}>{counts.academy}チーム</span>
                </div>
                <p style={{fontSize:11,color:'#999',marginTop:2}}>Jクラブ・専門スクール・ユニーク塾</p>
              </div>
            </button>

            {selected==='academy' && (
              <div style={{background:'#FAEEDA',border:'1px solid #EF9F27',borderRadius:12,padding:'12px 14px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {[['J1/J2下部','J下部'],['ドリブル・キック専門','スクール'],['GK・守備専門','スクール'],['フィジカル特化','スクール']].map(([label,type])=>(
                    <Link key={label} href={`/teams?type=${encodeURIComponent(type)}`}
                      style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',borderRadius:8,background:'white',textDecoration:'none'}}>
                      <p style={{fontSize:13,color:'#1a1a1a'}}>{label}</p>
                      <span style={{fontSize:12,color:'#ccc'}}>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>受付中のセレクション</p>
          <div style={{display:'flex',gap:8,overflow:'auto',paddingBottom:4,scrollbarWidth:'none',marginBottom:16}}>
            {[['FC東京U-15','締切 6/30','#FCEBEB','#A32D2D','締切間近'],['横浜F・マリノス','7月開始','#E1F5EE','#085041','受付中'],['浦和レッズJY','7月〜','#E1F5EE','#085041','受付中'],['ジェフ千葉U-15','7〜8月','#E1F5EE','#085041','受付中']].map(([name,date,bg,co,status])=>(
              <Link key={String(name)} href="/teams" style={{flexShrink:0,minWidth:140,background:'white',borderRadius:10,border:`1px solid ${bg}`,padding:'10px 12px',textDecoration:'none',display:'block'}}>
                <p style={{fontSize:10,fontWeight:500,color:co,marginBottom:3}}>{status}</p>
                <p style={{fontSize:12,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{name}</p>
                <p style={{fontSize:10,color:'#999'}}>{date}</p>
              </Link>
            ))}
          </div>

          <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>その他の機能</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
            {[['/calendar','📅','セレクション\nカレンダー'],['/body-check','📏','体格診断＆\n栄養アドバイス'],['/shoes','👟','シューズ\nランキング'],['/foot-camera','📷','AI足型\n診断'],['/nutrition','🥗','栄養・\n補助食品'],['/mypage','👤','マイページ']].map(([href,emoji,label])=>(
              <Link key={String(href)} href={String(href)}
                style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 12px',textDecoration:'none',display:'block'}}>
                <p style={{fontSize:24,marginBottom:6}}>{emoji}</p>
                <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',whiteSpace:'pre-line',lineHeight:1.4}}>{label}</p>
              </Link>
            ))}
          </div>

          <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>シェアする</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
            {[['x','#1a1a1a','𝕏 Xでシェア'],['line','#06C755','LINEでシェア'],['instagram','#E1306C','Instagramにシェア'],['facebook','#1877F2','Facebookでシェア']].map(([type,bg,label])=>(
              <button key={String(type)} onClick={()=>share(String(type))}
                style={{padding:'10px',borderRadius:10,background:bg,color:'white',border:'none',fontSize:12,fontWeight:500,cursor:'pointer'}}>
                {label}
              </button>
            ))}
          </div>

          <div style={{background:'white',borderRadius:12,border:'1.5px dashed #ccc',padding:'14px 16px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <p style={{fontSize:10,color:'#999',marginBottom:2,letterSpacing:'0.1em'}}>SPONSOR WANTED</p>
              <p style={{fontSize:14,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>スポンサー募集中</p>
              <p style={{fontSize:11,color:'#666'}}>¥10,000〜/月 · スポーツ用品・スクール歓迎</p>
              <p style={{fontSize:10,color:'#aaa',marginTop:2}}>info@aokae.co.jp</p>
            </div>
            <a href="mailto:info@aokae.co.jp"
              style={{padding:'8px 14px',borderRadius:8,background:'#1a1a1a',color:'white',fontSize:11,textDecoration:'none',flexShrink:0}}>
              お問い合わせ
            </a>
          </div>

        </div>
      </div>
    </main>
  )
}
