'use client'
import { useState, useEffect } from 'react'
import { supabase, Team } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const PREFS = ['全て','東京都','神奈川県','埼玉県','千葉県']
const CATS = ['全て','ジュニアユース','U12','U10','U8']
const TYPES = ['全て','J下部','街クラブ','スクール']

function TeamsContent() {
  const searchParams = useSearchParams()
  const [teams, setTeams] = useState<Team[]>([])
  const [pref, setPref] = useState(searchParams.get('pref')||'全て')
  const [cat, setCat] = useState(searchParams.get('cat')||'全て')
  const [type, setType] = useState(searchParams.get('type')||'全て')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function fetch() {
      setLoading(true)
      let q = supabase.from('teams').select('*')
      if(pref!=='全て') q = q.eq('prefecture', pref)
      if(cat!=='全て') q = q.eq('category', cat)
      if(type!=='全て') q = q.eq('type', type)
      if(search) q = q.ilike('name', `%${search}%`)
      const {data} = await q
      setTeams(data||[])
      setLoading(false)
    }
    fetch()
  },[pref,cat,type,search])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-gray-400 text-sm">← 戻る</Link>
          <h1 className="text-lg font-medium">チームを探す</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="チーム名・地域で検索..." className="flex-1 text-sm outline-none bg-transparent"/>
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">都県</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PREFS.map(p=>(
              <button key={p} onClick={()=>setPref(p)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${pref===p?'bg-blue-500 text-white border-blue-500':'bg-white text-gray-600 border-gray-200'}`}>{p}</button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">カテゴリ</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${cat===c?'bg-purple-500 text-white border-purple-500':'bg-white text-gray-600 border-gray-200'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">タイプ</div>
          <div className="flex gap-2">
            {TYPES.map(t=>(
              <button key={t} onClick={()=>setType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${type===t?'bg-green-500 text-white border-green-500':'bg-white text-gray-600 border-gray-200'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700">
          広告：サッカースパイク・用品はこちら →
          <a href="https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F" target="_blank" rel="noopener noreferrer sponsored" className="underline ml-1">楽天で見る</a>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">読み込み中...</div>
        ) : teams.length === 0 ? (
          <div className="text-center text-gray-400 py-8">該当するチームが見つかりませんでした</div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-500">{teams.length}件のチームが見つかりました</div>
            {teams.map(team=>(
              <div key={team.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${team.is_jleague?'bg-blue-50 text-blue-800':'bg-purple-50 text-purple-800'}`}>{team.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{team.category}</span>
                  </div>
                  {team.selection_start && (
                    <span className="text-xs text-amber-600 font-medium">受付中</span>
                  )}
                </div>
                <div className="font-medium text-sm mb-1">{team.name}</div>
                <div className="text-xs text-gray-500 mb-2">{team.prefecture} {team.area}</div>
                {team.description && <div className="text-xs text-gray-600 mb-2 leading-relaxed">{team.description}</div>}
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  {team.selection_start && <div>📅 セレクション：{team.selection_start}〜{team.selection_end}</div>}
                  {team.practice_days && <div>⏰ 練習：{team.practice_days}</div>}
                  {team.access && <div>📍 {team.access}</div>}
                  {team.is_free && <div className="text-green-600 font-medium">✓ セレクション無料</div>}
                </div>
                {team.apply_url && (
                  <a href={team.apply_url} target="_blank" rel="noopener noreferrer"
                    className="mt-3 block text-center text-xs py-2 px-4 bg-blue-500 text-white rounded-lg">
                    申込・詳細はこちら →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function TeamsPage() {
  return <Suspense fallback={<div className="text-center py-8">読み込み中...</div>}><TeamsContent /></Suspense>
}
