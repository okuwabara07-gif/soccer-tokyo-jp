'use client'
import { useEffect, useState } from 'react'
import { supabase, NutritionPost } from '@/lib/supabase'
import Link from 'next/link'

const TIPS = [
  { icon: '🍚', title: '炭水化物', desc: 'エネルギー源。ご飯・パン・パスタを毎食しっかり食べる' },
  { icon: '🍗', title: 'タンパク質', desc: '筋肉の材料。肉・魚・卵・豆腐を積極的に摂る' },
  { icon: '🥦', title: 'ビタミン・ミネラル', desc: '疲労回復・骨の強化。野菜・果物・乳製品を毎日' },
  { icon: '💧', title: '水分補給', desc: '練習前後・練習中こまめに。スポーツドリンクも活用' },
  { icon: '😴', title: '睡眠', desc: '成長ホルモンは睡眠中に分泌。8〜9時間の睡眠を確保' },
]

export default function NutritionPage() {
  const [posts, setPosts] = useState<NutritionPost[]>([])

  useEffect(() => {
    supabase.from('nutrition_posts').select('*').then(({data})=>setPosts(data||[]))
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-400 text-sm">← 戻る</Link>
          <h1 className="text-xl font-medium">栄養・食事情報</h1>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-green-800 mb-3">ジュニア選手の5大栄養ポイント</p>
          <div className="flex flex-col gap-3">
            {TIPS.map(t=>(
              <div key={t.title} className="flex gap-3 items-start">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div>
                  <div className="text-xs font-medium text-green-800">{t.title}</div>
                  <div className="text-xs text-gray-600">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {posts.map(p=>(
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">{p.category}</span>
                <span className="text-xs text-gray-400">{p.age_group}</span>
              </div>
              <h2 className="text-sm font-medium mb-2">{p.title}</h2>
              <p className="text-xs text-gray-500 mb-3">{p.content}</p>
              {p.affili_url && (
                <a href={p.affili_url} target="_blank" rel="noopener noreferrer sponsored"
                  className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg inline-block">
                  おすすめ商品を見る →
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-800 mb-3">試合・練習別 食事タイミング</p>
          {[
            ['試合3時間前','炭水化物中心の食事（うどん・おにぎり）'],
            ['試合1時間前','バナナ・ゼリー飲料など消化の良いもの'],
            ['試合直後','プロテイン・おにぎりで素早く回復'],
            ['練習後30分','タンパク質＋炭水化物でゴールデンタイムを活用'],
          ].map(([time, tip])=>(
            <div key={time} className="flex gap-2 text-xs mb-2">
              <span className="text-amber-700 font-medium flex-shrink-0 min-w-24">{time}</span>
              <span className="text-gray-600">{tip}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
