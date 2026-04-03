'use client'
import { useEffect, useState } from 'react'
import { supabase, CalendarEvent } from '@/lib/supabase'
import Link from 'next/link'

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const TYPE_COLOR: Record<string, string> = {
  '申込開始': 'bg-blue-50 text-blue-800 border-blue-200',
  'セレクション': 'bg-amber-50 text-amber-800 border-amber-200',
  '合否通知': 'bg-green-50 text-green-800 border-green-200',
  '入団手続': 'bg-purple-50 text-purple-800 border-purple-200',
  '新チーム始動': 'bg-red-50 text-red-800 border-red-200',
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('selection_calendar').select('*').order('event_date').then(({data})=>{
      setEvents(data||[])
      setLoading(false)
    })
  }, [])

  const byMonth = MONTHS.map((m, i) => ({
    month: m,
    events: events.filter(e => new Date(e.event_date).getMonth() === i)
  }))

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-400 text-sm">← 戻る</Link>
          <h1 className="text-xl font-medium">セレクション年間カレンダー</h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-blue-800 mb-2">セレクションの流れ</p>
          <div className="flex items-center gap-1 text-xs text-blue-700 flex-wrap">
            <span className="px-2 py-0.5 bg-blue-100 rounded">6月〜申込</span>
            <span>→</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">7〜9月セレクション</span>
            <span>→</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">10月合否</span>
            <span>→</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">4月始動</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">読み込み中...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {byMonth.filter(m=>m.events.length>0).map(({month, events})=>(
              <div key={month} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">📅 {month}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {events.map(e=>(
                    <div key={e.id} className="px-4 py-3 flex items-start gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${TYPE_COLOR[e.event_type]||'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {e.event_type}
                      </span>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">{new Date(e.event_date).toLocaleDateString('ja-JP')}</div>
                        <div className="text-sm text-gray-700">{e.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-800 mb-2">チームに入るためのアドバイス</p>
          <div className="flex flex-col gap-2">
            {[
              ['6月頃','気になるチームの体験練習会に参加する'],
              ['6〜7月','セレクション申込を忘れずに（先着順も多い）'],
              ['セレクション前','基礎技術・体力を磨く。自己アピールを準備'],
              ['合格後','入団手続きと月会費の確認'],
            ].map(([time, tip])=>(
              <div key={time} className="flex gap-2 text-xs">
                <span className="text-amber-600 font-medium flex-shrink-0">{time}</span>
                <span className="text-gray-600">{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
