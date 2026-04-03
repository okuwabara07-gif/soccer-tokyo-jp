'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const WARDS = ['千代田区','中央区','港区','新宿区','文京区','台東区','墨田区','江東区','品川区','目黒区','大田区','世田谷区','渋谷区','中野区','杉並区','豊島区','北区','荒川区','板橋区','練馬区','足立区','葛飾区','江戸川区']

const BLOCKS: Record<string,string> = {
  '千代田区':'第6ブロック','中央区':'第6ブロック','港区':'第6ブロック','新宿区':'第6ブロック',
  '文京区':'第3ブロック','台東区':'第1ブロック','墨田区':'第1ブロック','江東区':'第2ブロック',
  '品川区':'第6ブロック','目黒区':'第7ブロック','大田区':'第8ブロック','世田谷区':'第7ブロック',
  '渋谷区':'第6ブロック','中野区':'第5ブロック','杉並区':'第5ブロック','豊島区':'第3ブロック',
  '北区':'第3ブロック','荒川区':'第1ブロック','板橋区':'第3ブロック','練馬区':'第4ブロック',
  '足立区':'第1ブロック','葛飾区':'第2ブロック','江戸川区':'第2ブロック'
}

const NEWS = [
  {id:'1',team:'FC東京U-15深川',type:'セレクション',text:'2026年セレクション申込受付開始！締切6/30',date:'2日前',urgent:true},
  {id:'2',team:'バディSCジュニアユース',type:'体験練習会',text:'5月の体験練習会の日程が公開されました',date:'3日前',urgent:false},
  {id:'3',team:'FCトッカーノU-15',type:'セレクション',text:'2026年セレクション情報が更新されました',date:'5日前',urgent:false},
]

const ALERTS = [
  {id:'1',name:'FC東京U-15深川',status:'受付中',deadline:'6/30',category:'ジュニアユース'},
  {id:'2',name:'東京ヴェルディJY',status:'情報待ち',deadline:'7月予定',category:'ジュニアユース'},
  {id:'3',name:'バディSCジュニアユース',status:'情報待ち',deadline:'8月予定',category:'ジュニアユース'},
]

export default function MyPage() {
  const [tab, setTab] = useState<'home'|'child'|'alert'|'settings'>('home')
  const [ward, setWard] = useState('')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [saved, setSaved] = useState(false)
  const [editChild, setEditChild] = useState(false)

  useEffect(()=>{
    const s = localStorage.getItem('mypage')
    if(s){const d=JSON.parse(s);setWard(d.ward||'');setChildName(d.childName||'');setChildAge(d.childAge||'')}
  },[])

  const save = () => {
    localStorage.setItem('mypage', JSON.stringify({ward,childName,childAge}))
    setSaved(true)
    setEditChild(false)
    setTimeout(()=>setSaved(false),2000)
  }

  const block = BLOCKS[ward] || ''
  const nearbyNews = ward ? NEWS : []

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:13,textDecoration:'none',display:'block',marginBottom:8}}>← トップへ</Link>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <h1 style={{color:'white',fontSize:22,fontWeight:300,marginBottom:4}}>マイページ</h1>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,background:'#c9a84c',color:'white',fontWeight:500}}>スタンダード会員</span>
            </div>
            <div style={{textAlign:'right'}}>
              {ward && <p style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginBottom:1}}>{ward}</p>}
              {block && <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{block}</p>}
            </div>
          </div>
        </div>

        <div style={{display:'flex',background:'white',borderBottom:'1px solid #eeeeea'}}>
          {[['home','ホーム'],['child','お子さん'],['alert','アラート'],['settings','設定']].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id as any)}
              style={{flex:1,padding:'12px 4px',fontSize:11,border:'none',background:'transparent',cursor:'pointer',
                borderBottom:`2px solid ${tab===id?'#1a1a1a':'transparent'}`,color:tab===id?'#1a1a1a':'#999'}}>
              {label}
            </button>
          ))}
        </div>

        <div style={{padding:16}}>

          {tab==='home' && (
            <div>
              {!ward && (
                <div style={{background:'#fff8e1',border:'1px solid #ffe082',borderRadius:12,padding:'12px 14px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:500,color:'#f57f17',marginBottom:2}}>地域を設定してください</p>
                    <p style={{fontSize:11,color:'#795548'}}>近くのチーム情報をお届けします</p>
                  </div>
                  <button onClick={()=>setTab('child')}
                    style={{padding:'6px 12px',borderRadius:8,background:'#f57f17',color:'white',border:'none',fontSize:11,cursor:'pointer',flexShrink:0}}>
                    設定する
                  </button>
                </div>
              )}

              {ward && (
                <>
                  <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>📍 {ward}周辺のニュース</p>
                  {nearbyNews.map(n=>(
                    <div key={n.id} style={{background:'white',borderRadius:12,border:`1px solid ${n.urgent?'#ffe082':'#eeeeea'}`,padding:'12px',marginBottom:8,borderLeft:`3px solid ${n.urgent?'#f57f17':'#1D9E75'}`}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:10,padding:'1px 7px',borderRadius:8,background:n.urgent?'#fff8e1':'#E1F5EE',color:n.urgent?'#f57f17':'#085041',fontWeight:500}}>{n.type}</span>
                        <span style={{fontSize:10,color:'#bbb'}}>{n.date}</span>
                      </div>
                      <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{n.team}</p>
                      <p style={{fontSize:12,color:'#666',lineHeight:1.5}}>{n.text}</p>
                    </div>
                  ))}
                </>
              )}

              <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,marginTop:14}}>クイックアクセス</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
                {[
                  ['/teams','⚽','チームを探す'],
                  ['/calendar','📅','カレンダー'],
                  ['/foot-camera','📷','AI足型診断'],
                  ['/shoes','👟','シューズ選び'],
                  ['/nutrition','🥗','栄養アドバイス'],
                  ['/body-check','📏','体格診断'],
                ].map(([href,emoji,label])=>(
                  <Link key={String(href)} href={String(href)}
                    style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 12px',textDecoration:'none',display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:22}}>{emoji}</span>
                    <span style={{fontSize:13,fontWeight:500,color:'#1a1a1a'}}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tab==='child' && (
            <div>
              <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:12}}>お子さんの情報</p>

              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 16px',marginBottom:12}}>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:'#666',display:'block',marginBottom:6}}>お住まいの区</label>
                  <select value={ward} onChange={e=>setWard(e.target.value)}
                    style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13,background:'white',outline:'none'}}>
                    <option value="">選択してください</option>
                    {WARDS.map(w=><option key={w} value={w}>{w}</option>)}
                  </select>
                  {ward && <p style={{fontSize:11,color:'#1D9E75',marginTop:4}}>{block}に所属するチームが表示されます</p>}
                </div>

                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:'#666',display:'block',marginBottom:6}}>お子さんの名前</label>
                  <input value={childName} onChange={e=>setChildName(e.target.value)}
                    placeholder="例：田中 太郎"
                    style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13,outline:'none'}}/>
                </div>

                <div style={{marginBottom:16}}>
                  <label style={{fontSize:12,color:'#666',display:'block',marginBottom:6}}>学年・年齢</label>
                  <select value={childAge} onChange={e=>setChildAge(e.target.value)}
                    style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13,background:'white',outline:'none'}}>
                    <option value="">選択してください</option>
                    {[['小1（U8）','U8'],['小2（U8）','U8'],['小3（U10）','U10'],['小4（U10）','U10'],['小5（U12）','U12'],['小6（U12）','U12'],['中1（JY）','JY'],['中2（JY）','JY'],['中3（JY）','JY']].map(([l,v])=>(
                      <option key={v+l} value={v}>{l}</option>
                    ))}
                  </select>
                </div>

                <button onClick={save}
                  style={{width:'100%',padding:'12px',borderRadius:10,background:'#1a1a1a',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>
                  {saved?'✅ 保存しました！':'保存する'}
                </button>
              </div>

              {ward && childName && (
                <div style={{background:'#E1F5EE',borderRadius:12,padding:'12px 14px',border:'1px solid #9FE1CB'}}>
                  <p style={{fontSize:12,fontWeight:500,color:'#085041',marginBottom:4}}>設定完了</p>
                  <p style={{fontSize:12,color:'#0F6E56',lineHeight:1.7}}>
                    {childName}さん（{childAge}）の情報を保存しました。<br/>
                    {ward}（{block}）周辺のチーム情報をお届けします。
                  </p>
                </div>
              )}
            </div>
          )}

          {tab==='alert' && (
            <div>
              <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:4}}>セレクションアラート</p>
              <p style={{fontSize:12,color:'#666',marginBottom:12,lineHeight:1.6}}>最大5チームのセレクション開始をお知らせします</p>

              {ALERTS.map((a,i)=>(
                <div key={a.id} style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'12px',marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                        <span style={{fontSize:11,color:'#999',fontWeight:500}}>#{i+1}</span>
                        <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a'}}>{a.name}</p>
                      </div>
                      <p style={{fontSize:11,color:'#999'}}>{a.category} · 締切目安：{a.deadline}</p>
                    </div>
                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,flexShrink:0,
                      background:a.status==='受付中'?'#FAEEDA':'#f0f0ec',
                      color:a.status==='受付中'?'#633806':'#888',fontWeight:500}}>{a.status}</span>
                  </div>
                  {a.status==='受付中' && (
                    <Link href="/teams" style={{display:'block',padding:'8px',borderRadius:8,background:'#1a1a1a',color:'white',fontSize:11,textAlign:'center',textDecoration:'none'}}>
                      申込ページへ →
                    </Link>
                  )}
                </div>
              ))}

              <Link href="/teams"
                style={{display:'block',padding:'12px',borderRadius:10,border:'2px dashed #e8e8e4',background:'white',color:'#999',fontSize:12,textAlign:'center',textDecoration:'none',marginTop:4}}>
                + チームを追加（あと{5-ALERTS.length}チーム）
              </Link>

              <div style={{marginTop:14,background:'#E6F1FB',borderRadius:12,padding:'12px 14px',border:'1px solid #85B7EB'}}>
                <p style={{fontSize:12,fontWeight:500,color:'#0C447C',marginBottom:4}}>アラートの仕組み</p>
                <p style={{fontSize:11,color:'#185FA5',lineHeight:1.7}}>
                  登録したチームのセレクション申込が開始されると、このページに「受付中」と表示されます。
                  プレミアム会員はLINEでも通知が届きます。
                </p>
              </div>
            </div>
          )}

          {tab==='settings' && (
            <div>
              <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10}}>アカウント設定</p>
              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',overflow:'hidden',marginBottom:14}}>
                {[
                  ['プラン・お支払い','/member','現在：スタンダード ¥500/月'],
                  ['通知設定','#','セレクション速報・締切通知'],
                  ['地域・お子さん情報','#',''],
                  ['お気に入りチーム管理','#','3チーム登録中'],
                  ['メールアドレス変更','#',''],
                ].map(([label,href,sub],i)=>(
                  <Link key={String(label)} href={String(href)}
                    style={{padding:'14px',borderBottom:i<4?'1px solid #f5f5f5':'none',display:'flex',justifyContent:'space-between',alignItems:'center',textDecoration:'none'}}>
                    <div>
                      <p style={{fontSize:13,color:'#1a1a1a'}}>{label}</p>
                      {sub && <p style={{fontSize:11,color:'#999',marginTop:1}}>{sub}</p>}
                    </div>
                    <span style={{fontSize:16,color:'#ccc'}}>›</span>
                  </Link>
                ))}
              </div>

              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px',marginBottom:14}}>
                <p style={{fontSize:12,fontWeight:500,marginBottom:8}}>マイページ活用アドバイス</p>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {[
                    ['地域を設定する','近くのチームのセレクション情報が自動表示されます'],
                    ['アラートに5チーム登録','申込開始を見逃さなくなります'],
                    ['AI足型診断を試す','お子さんに合ったシューズが見つかります'],
                    ['体格診断で栄養管理','東京都平均と比較して食事プランが得られます'],
                    ['プレミアムにアップ','合格率データ・LINE通知が使えるようになります'],
                  ].map(([t,d])=>(
                    <div key={t} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                      <span style={{fontSize:12,color:'#1D9E75',flexShrink:0,marginTop:1}}>✓</span>
                      <div>
                        <p style={{fontSize:12,fontWeight:500,color:'#1a1a1a',marginBottom:1}}>{t}</p>
                        <p style={{fontSize:11,color:'#666',lineHeight:1.5}}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button style={{width:'100%',padding:'12px',borderRadius:10,border:'1px solid #FCEBEB',background:'#FCEBEB',color:'#791F1F',fontSize:13,cursor:'pointer'}}>
                ログアウト
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
