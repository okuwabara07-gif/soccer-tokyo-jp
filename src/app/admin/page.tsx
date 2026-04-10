'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = 'aokae2026'

type Team = {
  id: string; name: string; category: string; area: string;
  prefecture: string; block: string; type: string;
  website?: string; instagram?: string; twitter?: string;
  description?: string; practice_days?: string; fee?: number;
  is_free?: boolean; is_jleague?: boolean; lat?: number; lng?: number;
  name_kana?: string; access?: string;
}

const PREFS = ['東京都','神奈川県','埼玉県','千葉県']
const CATEGORIES = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U18','女子U12','女子U15']
const TYPES = ['クラブチーム','スクール','Jリーグ系','街クラブ','小学校','中学校','フットサル']

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'list'|'add'|'stats'>('list')
  const [filterPref, setFilterPref] = useState('東京都')
  const [filterQ, setFilterQ] = useState('')
  const [editTeam, setEditTeam] = useState<Team|null>(null)
  const [msg, setMsg] = useState('')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 50

  const [form, setForm] = useState<Partial<Team>>({
    prefecture: '東京都', category: 'U12', type: 'クラブチーム',
    is_free: false, is_jleague: false, fee: 5000
  })

  const [stats, setStats] = useState<{prefecture:string,count:number}[]>([])

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
      localStorage.setItem('isAdmin', 'true')
    }
    else setPwError(true)
  }

  const fetchTeams = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('prefecture', filterPref)
      .order('area')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    setTeams(data || [])
    setLoading(false)
  }

  const fetchStats = async () => {
    const results = []
    for (const pref of PREFS) {
      const { count } = await supabase
        .from('teams').select('*', { count: 'exact', head: true })
        .eq('prefecture', pref)
      results.push({ prefecture: pref, count: count || 0 })
    }
    setStats(results)
  }

  useEffect(() => {
    if (authed && tab === 'list') fetchTeams()
    if (authed && tab === 'stats') fetchStats()
  }, [authed, tab, filterPref, page])

  const deleteTeam = async (id: string) => {
    if (!confirm('削除しますか？')) return
    await supabase.from('teams').delete().eq('id', id)
    setMsg('削除しました')
    fetchTeams()
  }

  const saveTeam = async () => {
    if (editTeam) {
      await supabase.from('teams').update(editTeam).eq('id', editTeam.id)
      setMsg('更新しました')
      setEditTeam(null)
    }
    fetchTeams()
  }

  const addTeam = async () => {
    if (!form.name || !form.area) { setMsg('チーム名とエリアは必須です'); return }
    const { error } = await supabase.from('teams').insert([form])
    if (error) { setMsg('エラー: ' + error.message); return }
    setMsg('追加しました！')
    setForm({ prefecture: '東京都', category: 'U12', type: 'クラブチーム', is_free: false, is_jleague: false, fee: 5000 })
  }

  const filteredTeams = teams.filter(t =>
    filterQ === '' || t.name.includes(filterQ) || t.area?.includes(filterQ)
  )

  if (!authed) return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{background:'#1a1a1a',borderRadius:16,padding:'2rem',width:320,textAlign:'center'}}>
        <p style={{fontSize:24,marginBottom:8}}>⚽</p>
        <p style={{color:'white',fontSize:18,fontWeight:700,marginBottom:4}}>管理者ログイン</p>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:24}}>サッカー情報局 管理画面</p>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&login()}
          placeholder="パスワードを入力"
          style={{width:'100%',padding:'12px',borderRadius:10,border:`1px solid ${pwError?'#e63946':'rgba(255,255,255,0.1)'}`,
            background:'rgba(255,255,255,0.05)',color:'white',fontSize:14,marginBottom:12,outline:'none'}}/>
        {pwError && <p style={{color:'#e63946',fontSize:12,marginBottom:8}}>パスワードが違います</p>}
        <button onClick={login}
          style={{width:'100%',padding:'12px',borderRadius:10,background:'#e63946',
            color:'white',fontWeight:700,fontSize:14,border:'none',cursor:'pointer'}}>
          ログイン
        </button>
      </div>
    </main>
  )

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{background:'#0a0a0a',padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <p style={{color:'white',fontWeight:700,fontSize:16}}>⚽ 管理画面</p>
        <button onClick={()=>{setAuthed(false);localStorage.removeItem('isAdmin')}}
          style={{color:'rgba(255,255,255,0.4)',fontSize:12,background:'none',border:'none',cursor:'pointer'}}>
          ログアウト
        </button>
      </div>

      {msg && (
        <div style={{background:'#1D9E75',color:'white',padding:'10px 20px',fontSize:13,textAlign:'center'}}>
          {msg}
          <button onClick={()=>setMsg('')} style={{marginLeft:12,background:'none',border:'none',color:'white',cursor:'pointer'}}>✕</button>
        </div>
      )}

      <div style={{display:'flex',borderBottom:'1px solid #e8e8e4',background:'white'}}>
        {(['list','add','stats'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:'12px 20px',border:'none',borderBottom:`3px solid ${tab===t?'#e63946':'transparent'}`,
              background:'transparent',cursor:'pointer',fontSize:13,
              fontWeight:tab===t?700:400,color:tab===t?'#e63946':'#666'}}>
            {t==='list'?'チーム一覧':t==='add'?'チーム追加':'統計'}
          </button>
        ))}
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'16px'}}>

        {tab === 'stats' && (
          <div>
            <h2 style={{fontSize:16,fontWeight:700,marginBottom:16}}>都道府県別チーム数</h2>
            {stats.map(s=>(
              <div key={s.prefecture} style={{background:'white',borderRadius:10,padding:'12px 16px',marginBottom:8,
                display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid #e8e8e4'}}>
                <span style={{fontWeight:600}}>{s.prefecture}</span>
                <span style={{fontSize:24,fontWeight:700,color:'#e63946'}}>{s.count.toLocaleString()}件</span>
              </div>
            ))}
            <div style={{background:'#0a0a0a',borderRadius:10,padding:'12px 16px',marginTop:8,
              display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'white',fontWeight:600}}>合計</span>
              <span style={{fontSize:24,fontWeight:700,color:'#FFD700'}}>
                {stats.reduce((a,b)=>a+b.count,0).toLocaleString()}件
              </span>
            </div>
          </div>
        )}

        {tab === 'add' && (
          <div style={{background:'white',borderRadius:12,padding:'20px',border:'1px solid #e8e8e4'}}>
            <h2 style={{fontSize:16,fontWeight:700,marginBottom:16}}>新規チーム追加</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[
                ['チーム名*','name','text'],
                ['読み仮名','name_kana','text'],
                ['エリア*','area','text'],
                ['ブロック','block','text'],
                ['WEBサイト','website','text'],
                ['Instagram','instagram','text'],
                ['Twitter/X','twitter','text'],
                ['練習日','practice_days','text'],
                ['アクセス','access','text'],
                ['月会費(円)','fee','number'],
              ].map(([label,key,type])=>(
                <div key={key as string}>
                  <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>{label}</label>
                  <input type={type as string} value={(form as any)[key as string] || ''}
                    onChange={e=>setForm({...form,[key as string]:type==='number'?parseInt(e.target.value):e.target.value})}
                    style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13,outline:'none'}}/>
                </div>
              ))}
              <div>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>都道府県</label>
                <select value={form.prefecture} onChange={e=>setForm({...form,prefecture:e.target.value})}
                  style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13}}>
                  {PREFS.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>カテゴリ</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                  style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13}}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>種別</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                  style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13}}>
                  {TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:16,marginTop:12}}>
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}>
                <input type="checkbox" checked={form.is_free||false} onChange={e=>setForm({...form,is_free:e.target.checked})}/>
                無料体験あり
              </label>
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}>
                <input type="checkbox" checked={form.is_jleague||false} onChange={e=>setForm({...form,is_jleague:e.target.checked})}/>
                Jリーグ系
              </label>
            </div>
            <div style={{marginTop:12}}>
              <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>説明</label>
              <textarea value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}
                rows={3} style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13,resize:'vertical',outline:'none'}}/>
            </div>
            <button onClick={addTeam}
              style={{marginTop:16,padding:'12px 32px',background:'#e63946',color:'white',
                fontWeight:700,fontSize:14,border:'none',borderRadius:10,cursor:'pointer'}}>
              追加する
            </button>
          </div>
        )}

        {tab === 'list' && (
          <div>
            <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
              <select value={filterPref} onChange={e=>{setFilterPref(e.target.value);setPage(0)}}
                style={{padding:'8px 12px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13}}>
                {PREFS.map(p=><option key={p}>{p}</option>)}
              </select>
              <input value={filterQ} onChange={e=>setFilterQ(e.target.value)}
                placeholder="チーム名・エリアで絞り込み..."
                style={{flex:1,padding:'8px 12px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:13,outline:'none'}}/>
              <button onClick={fetchTeams}
                style={{padding:'8px 16px',background:'#0a0a0a',color:'white',borderRadius:8,border:'none',cursor:'pointer',fontSize:13}}>
                更新
              </button>
            </div>

            <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
              <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0}
                style={{padding:'6px 12px',borderRadius:8,border:'1px solid #e8e8e4',background:'white',cursor:'pointer',fontSize:12}}>
                ← 前
              </button>
              <span style={{fontSize:12,color:'#888'}}>{page*PAGE_SIZE+1}〜{(page+1)*PAGE_SIZE}件</span>
              <button onClick={()=>setPage(page+1)}
                style={{padding:'6px 12px',borderRadius:8,border:'1px solid #e8e8e4',background:'white',cursor:'pointer',fontSize:12}}>
                次 →
              </button>
            </div>

            {loading ? (
              <p style={{textAlign:'center',padding:'40px',color:'#888'}}>読み込み中...</p>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {filteredTeams.map(team=>(
                  <div key={team.id} style={{background:'white',borderRadius:10,padding:'12px 14px',
                    border:'1px solid #e8e8e4'}}>
                    {editTeam?.id === team.id ? (
                      <div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                          {[['チーム名','name'],['読み仮名','name_kana'],['エリア','area'],['ブロック','block'],
                            ['WEB','website'],['Instagram','instagram'],['Twitter','twitter'],
                            ['練習日','practice_days'],['アクセス','access']].map(([label,key])=>(
                            <div key={key}>
                              <label style={{fontSize:10,color:'#888',display:'block'}}>{label}</label>
                              <input value={(editTeam as any)[key]||''} 
                                onChange={e=>setEditTeam({...editTeam,[key]:e.target.value})}
                                style={{width:'100%',padding:'6px 8px',borderRadius:6,border:'1px solid #e8e8e4',fontSize:12,outline:'none'}}/>
                            </div>
                          ))}
                        </div>
                        <div style={{display:'flex',gap:8}}>
                          <button onClick={saveTeam}
                            style={{padding:'8px 20px',background:'#1D9E75',color:'white',borderRadius:8,border:'none',cursor:'pointer',fontSize:12,fontWeight:600}}>
                            保存
                          </button>
                          <button onClick={()=>setEditTeam(null)}
                            style={{padding:'8px 20px',background:'#f0f0ec',color:'#666',borderRadius:8,border:'none',cursor:'pointer',fontSize:12}}>
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:3}}>
                            <span style={{fontSize:10,padding:'1px 6px',borderRadius:6,background:'#f0f0ec',color:'#666'}}>{team.category}</span>
                            <span style={{fontSize:10,padding:'1px 6px',borderRadius:6,background:'#f0f0ec',color:'#666'}}>{team.type}</span>
                            {team.website && <span style={{fontSize:10,padding:'1px 6px',borderRadius:6,background:'#e1f5ee',color:'#0F6E56'}}>WEB✓</span>}
                            {team.instagram && <span style={{fontSize:10,padding:'1px 6px',borderRadius:6,background:'#fce4ec',color:'#e1306c'}}>IG✓</span>}
                          </div>
                          <p style={{fontSize:13,fontWeight:600,marginBottom:2}}>{team.name}</p>
                          <p style={{fontSize:10,color:'#999'}}>{team.area} / {team.block}</p>
                        </div>
                        <div style={{display:'flex',gap:6}}>
                          <button onClick={()=>setEditTeam(team)}
                            style={{padding:'6px 12px',background:'#378ADD',color:'white',borderRadius:8,border:'none',cursor:'pointer',fontSize:11,fontWeight:600}}>
                            編集
                          </button>
                          <button onClick={()=>deleteTeam(team.id)}
                            style={{padding:'6px 12px',background:'#e63946',color:'white',borderRadius:8,border:'none',cursor:'pointer',fontSize:11,fontWeight:600}}>
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
