'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Team = {
  id: number; name: string; category: string; area: string;
  prefecture: string; lat?: number; lng?: number;
  website?: string; instagram?: string; twitter?: string; facebook?: string;
  description?: string;
}

const PREFS = [
  { key:'東京都', label:'東京', color:'#e63946' },
  { key:'神奈川県', label:'神奈川', color:'#457b9d' },
  { key:'埼玉県', label:'埼玉', color:'#2d6a4f' },
  { key:'千葉県', label:'千葉', color:'#854F0B' },
]

const CATEGORIES = [
  { key:'all', label:'すべて' },
  { key:'ジュニア', label:'ジュニア' },
  { key:'ジュニアユース', label:'ジュニアユース' },
  { key:'アカデミー', label:'ユニークなスクール' },
]

declare global { interface Window { initMap: () => void; google: any } }

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedPref, setSelectedPref] = useState('東京都')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team|null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [userLat, setUserLat] = useState<number|null>(null)
  const [userLng, setUserLng] = useState<number|null>(null)
  const [locating, setLocating] = useState(false)
  const [nearbyMode, setNearbyMode] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const userMarkerRef = useRef<any>(null)
  const infoWindowRef = useRef<any>(null)

  useEffect(() => {
    const plan = localStorage.getItem('memberPlan')
    setIsPremium(!!plan)
  }, [])

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('prefecture', selectedPref)
        .order('name')
      setTeams(data || [])
      setSelectedTeam(null)
      setQuery('')
      setNearbyMode(false)
    }
    fetchTeams()
  }, [selectedPref])

  const filteredTeams = teams.filter(t => {
    const matchCat = category === 'all' || t.category === category
    const matchQ = query === '' || t.name.includes(query) || t.area?.includes(query)
    if (nearbyMode && userLat && userLng) {
      const dist = Math.sqrt(Math.pow((t.lat||0) - userLat, 2) + Math.pow((t.lng||0) - userLng, 2)) * 111
      return matchCat && matchQ && dist <= 5
    }
    return matchCat && matchQ
  })

  const getCurrentLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLat(pos.coords.latitude)
        setUserLng(pos.coords.longitude)
        setNearbyMode(true)
        setLocating(false)
        if (mapInstanceRef.current && window.google) {
          mapInstanceRef.current.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          mapInstanceRef.current.setZoom(13)
        }
      },
      () => { setLocating(false); alert('位置情報の取得に失敗しました') }
    )
  }

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return
    const prefCenter: Record<string, {lat:number,lng:number}> = {
      '東京都': {lat:35.6895,lng:139.6917},
      '神奈川県': {lat:35.4478,lng:139.6425},
      '埼玉県': {lat:35.8617,lng:139.6455},
      '千葉県': {lat:35.6074,lng:140.1065},
    }
    const center = prefCenter[selectedPref] || {lat:35.6895,lng:139.6917}
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center, zoom: 11,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      zoomControl: true, zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
    })
    infoWindowRef.current = new window.google.maps.InfoWindow()
  }, [selectedPref])

  useEffect(() => {
    if (window.google?.maps) { initMap() }
    else {
      window.initMap = initMap
      if (!document.querySelector('script[src*="maps.googleapis"]')) {
        const s = document.createElement('script')
        s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&language=ja`
        s.async = true; s.defer = true; document.head.appendChild(s)
      }
    }
  }, [initMap])

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    // ユーザー位置マーカー
    if (userMarkerRef.current) userMarkerRef.current.setMap(null)
    if (nearbyMode && userLat && userLng) {
      userMarkerRef.current = new window.google.maps.Marker({
        position: {lat: userLat, lng: userLng},
        map: mapInstanceRef.current,
        title: '現在地',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10, fillColor: '#4285F4', fillOpacity: 1,
          strokeColor: '#fff', strokeWeight: 2
        },
        zIndex: 200
      })
      // 5km円
      new window.google.maps.Circle({
        map: mapInstanceRef.current,
        center: {lat: userLat, lng: userLng},
        radius: 5000,
        fillColor: '#4285F4', fillOpacity: 0.05,
        strokeColor: '#4285F4', strokeOpacity: 0.3, strokeWeight: 1,
      })
    }

    filteredTeams.forEach(team => {
      if (!team.lat || !team.lng) return
      const isSelected = selectedTeam?.id === team.id
      const isSearched = query !== '' && (team.name.includes(query) || team.area?.includes(query))
      const color = isSearched ? '#e63946' : isSelected ? '#FFD700' : '#4CAF50'
      const scale = isSelected ? 18 : isSearched ? 16 : 12

      const marker = new window.google.maps.Marker({
        position: {lat: team.lat, lng: team.lng},
        map: mapInstanceRef.current,
        title: team.name,
        icon: {
          path: 'M 0,-1 0.588,0.809 -0.951,-0.309 0.951,-0.309 -0.588,0.809 Z',
          scale, fillColor: color, fillOpacity: 1,
          strokeColor: '#fff', strokeWeight: isSelected ? 2 : 1
        },
        zIndex: isSelected ? 100 : isSearched ? 80 : 1
      })
      marker.addListener('click', () => {
        setSelectedTeam(team)
        infoWindowRef.current?.setContent(`<div style="font-size:12px;font-weight:600;padding:4px">${team.name}</div>`)
        infoWindowRef.current?.open(mapInstanceRef.current, marker)
      })
      markersRef.current.push(marker)
    })
  }, [filteredTeams, selectedTeam, nearbyMode, userLat, userLng, query])

  const pref = PREFS.find(p => p.key === selectedPref)!

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:520,margin:'0 auto'}}>

        {/* ヘッダー */}
        <div style={{background:'#0a0a0a',padding:'14px 16px 0'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <Link href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none'}}>← 戻る</Link>
            <p style={{color:'white',fontSize:13,fontWeight:600}}>チームを探す</p>
            <div style={{width:40}}/>
          </div>

          {/* 都道府県タブ */}
          <div style={{display:'flex',gap:0,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            {PREFS.map(p=>(
              <button key={p.key} onClick={()=>setSelectedPref(p.key)}
                style={{flex:1,padding:'10px 4px',border:'none',background:'transparent',cursor:'pointer',
                  borderBottom:`3px solid ${selectedPref===p.key?p.color:'transparent'}`,
                  fontSize:12,fontWeight:selectedPref===p.key?700:400,
                  color:selectedPref===p.key?p.color:'rgba(255,255,255,0.4)',
                  transition:'all 0.2s'}}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 検索バー */}
        <div style={{background:'white',padding:'12px 16px',borderBottom:'1px solid #eeeeea'}}>
          <div style={{display:'flex',gap:8,marginBottom:10}}>
            <div style={{flex:1,position:'relative'}}>
              <input value={query} onChange={e=>setQuery(e.target.value)}
                placeholder={`${PREFS.find(p=>p.key===selectedPref)?.label}のチームを検索...`}
                style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e8e8e4',
                  fontSize:13,outline:'none',background:'#f8f8f6'}}/>
              {query && (
                <button onClick={()=>setQuery('')}
                  style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',
                    background:'none',border:'none',color:'#999',cursor:'pointer',fontSize:16}}>✕</button>
              )}
            </div>
            <button onClick={getCurrentLocation} disabled={locating}
              style={{padding:'10px 12px',borderRadius:10,border:'1px solid #e8e8e4',
                background:nearbyMode?pref.color:'white',
                color:nearbyMode?'white':'#666',fontSize:11,cursor:'pointer',
                fontWeight:nearbyMode?700:400,whiteSpace:'nowrap',flexShrink:0}}>
              {locating?'取得中...':nearbyMode?'📍 5km圏内':'📍 現在地'}
            </button>
          </div>

          {/* カテゴリ */}
          <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:2}}>
            {CATEGORIES.map(c=>(
              <button key={c.key} onClick={()=>setCategory(c.key)}
                style={{padding:'5px 12px',borderRadius:16,border:'none',cursor:'pointer',
                  whiteSpace:'nowrap',fontSize:11,flexShrink:0,
                  background:category===c.key?'#1a1a1a':'#f0f0ec',
                  color:category===c.key?'white':'#666',
                  fontWeight:category===c.key?600:400}}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 件数 */}
        <div style={{padding:'8px 16px',background:'#f8f8f6',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <p style={{fontSize:12,color:'#888'}}>
            {nearbyMode ? `現在地から5km圏内 ` : ''}<span style={{fontWeight:700,color:'#1a1a1a'}}>{filteredTeams.length}</span>チーム
          </p>
          {nearbyMode && (
            <button onClick={()=>{setNearbyMode(false);setUserLat(null);setUserLng(null)}}
              style={{fontSize:10,color:'#e63946',background:'none',border:'none',cursor:'pointer'}}>
              解除
            </button>
          )}
        </div>

        {/* Googleマップ（やや小ぶり） */}
        <div style={{padding:'0 16px 12px'}}>
          <div style={{position:'relative',borderRadius:14,overflow:'hidden',border:'1px solid #e8e8e4'}}>
            {!isPremium && (
              <div style={{position:'absolute',inset:0,zIndex:10,
                background:'rgba(10,10,10,0.55)',backdropFilter:'blur(3px)',
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
                <span style={{fontSize:28}}>🔒</span>
                <p style={{fontSize:13,fontWeight:700,color:'white'}}>地図フル操作は会員限定</p>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.6)'}}>チーム一覧は下からご覧いただけます</p>
                <Link href="/member"
                  style={{padding:'8px 20px',borderRadius:10,background:'#FFD700',
                    color:'#1a1a1a',fontSize:12,fontWeight:700,textDecoration:'none',marginTop:4}}>
                  ¥500/月で解放する
                </Link>
              </div>
            )}
            <div ref={mapRef} style={{height:240,width:'100%'}}/>
          </div>
        </div>

        {/* チームリスト */}
        <div style={{padding:'0 16px 16px'}}>
          {filteredTeams.length === 0 ? (
            <div style={{textAlign:'center',padding:'40px 20px',color:'#bbb'}}>
              <p style={{fontSize:32,marginBottom:8}}>🔍</p>
              <p style={{fontSize:14}}>チームが見つかりません</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {filteredTeams.slice(0,50).map(team=>{
                const isSelected = selectedTeam?.id === team.id
                const isSearched = query !== '' && (team.name.includes(query) || team.area?.includes(query))
                return (
                  <div key={team.id}
                    onClick={()=>setSelectedTeam(isSelected?null:team)}
                    style={{background:'white',borderRadius:12,padding:'12px 14px',
                      border:`1px solid ${isSearched?'#e63946':isSelected?pref.color:'#eeeeea'}`,
                      cursor:'pointer',transition:'all 0.2s',
                      boxShadow:isSelected?`0 2px 8px ${pref.color}20`:'none'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:3}}>
                          {isSearched && <span style={{fontSize:9,padding:'1px 6px',borderRadius:6,background:'#e63946',color:'white',fontWeight:600}}>検索一致</span>}
                          <span style={{fontSize:9,padding:'1px 6px',borderRadius:6,background:'#f0f0ec',color:'#666'}}>{team.category}</span>
                        </div>
                        <p style={{fontSize:13,fontWeight:600,color:'#1a1a1a',marginBottom:2}}>{team.name}</p>
                        <p style={{fontSize:10,color:'#999'}}>{team.area}</p>
                      </div>
                      <span style={{fontSize:12,color:'#ccc'}}>{isSelected?'▲':'▼'}</span>
                    </div>

                    {isSelected && (
                      <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid #f0f0ec'}}>
                        {team.description && (
                          <p style={{fontSize:11,color:'#666',lineHeight:1.6,marginBottom:8}}>{team.description}</p>
                        )}
                        {isPremium ? (
                          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                            {team.website && (
                              <a href={team.website} target="_blank" rel="noopener noreferrer"
                                style={{padding:'6px 14px',borderRadius:8,background:'#1a1a1a',
                                  color:'white',fontSize:11,fontWeight:600,textDecoration:'none'}}>
                                🌐 WEB
                              </a>
                            )}
                            {team.instagram && (
                              <a href={`https://instagram.com/${team.instagram.replace('@','')}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{padding:'6px 14px',borderRadius:8,background:'#e1306c',
                                  color:'white',fontSize:11,fontWeight:600,textDecoration:'none'}}>
                                📷 Instagram
                              </a>
                            )}
                            {team.twitter && (
                              <a href={`https://twitter.com/${team.twitter.replace('@','')}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{padding:'6px 14px',borderRadius:8,background:'#1d9bf0',
                                  color:'white',fontSize:11,fontWeight:600,textDecoration:'none'}}>
                                𝕏 Twitter
                              </a>
                            )}
                            {!team.website && !team.instagram && !team.twitter && (
                              <p style={{fontSize:10,color:'#bbb'}}>リンク情報なし</p>
                            )}
                          </div>
                        ) : (
                          <Link href="/member"
                            style={{display:'flex',alignItems:'center',gap:6,padding:'8px 12px',
                              borderRadius:8,background:'#fff8e6',border:'1px solid #FFD700',
                              textDecoration:'none'}}>
                            <span style={{fontSize:14}}>🔒</span>
                            <div>
                              <p style={{fontSize:11,fontWeight:600,color:'#856404'}}>会員登録でWEB・SNSリンクを見る</p>
                              <p style={{fontSize:9,color:'#aaa'}}>¥500/月〜</p>
                            </div>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              {filteredTeams.length > 50 && (
                <p style={{textAlign:'center',fontSize:11,color:'#bbb',padding:'8px'}}>
                  他 {filteredTeams.length - 50} チーム（検索で絞り込んでください）
                </p>
              )}
            </div>
          )}
        </div>

        {/* アフィリエイトバナー */}
        <div style={{padding:'0 16px 16px'}}>
          <div style={{background:'#0a0f1e',borderRadius:12,padding:'16px'}}>
            <p style={{fontSize:10,color:'#7ab3ff',letterSpacing:'0.1em',marginBottom:10}}>RECOMMENDED</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
              <a href={`https://www.amazon.co.jp/s?k=サッカースパイク+ジュニア&tag=haircolorab22-22`}
                target="_blank" rel="noopener noreferrer sponsored"
                style={{display:'flex',alignItems:'center',gap:6,padding:'10px',borderRadius:8,
                  background:'rgba(255,153,0,0.1)',border:'1px solid rgba(255,153,0,0.2)',textDecoration:'none'}}>
                <span style={{fontSize:16}}>📦</span>
                <div>
                  <p style={{fontSize:10,fontWeight:600,color:'#ff9900'}}>Amazon</p>
                  <p style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>スパイク検索</p>
                </div>
              </a>
              <a href={`https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F`}
                target="_blank" rel="noopener noreferrer sponsored"
                style={{display:'flex',alignItems:'center',gap:6,padding:'10px',borderRadius:8,
                  background:'rgba(255,0,0,0.1)',border:'1px solid rgba(255,0,0,0.2)',textDecoration:'none'}}>
                <span style={{fontSize:16}}>🛒</span>
                <div>
                  <p style={{fontSize:10,fontWeight:600,color:'#ff6666'}}>楽天</p>
                  <p style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>スパイク検索</p>
                </div>
              </a>
            </div>
            <Link href="/foot-camera"
              style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                padding:'10px 12px',background:'rgba(255,215,0,0.08)',borderRadius:8,
                border:'1px solid rgba(255,215,0,0.2)',textDecoration:'none'}}>
              <div>
                <p style={{fontSize:11,fontWeight:600,color:'white'}}>⚽ スパイク選びに迷ったら</p>
                <p style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>AI足型診断で最適なスパイクを</p>
              </div>
              <span style={{color:'#FFD700',fontSize:12}}>→</span>
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
