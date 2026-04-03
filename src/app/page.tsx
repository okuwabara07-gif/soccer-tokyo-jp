'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [selected, setSelected] = useState<string|null>(null)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-2">関東ジュニアサッカー情報局</h1>
          <p className="text-sm text-gray-500">U8〜ジュニアユースのチーム・セレクション情報</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-3">何を探していますか？</p>
          <div className="flex flex-col gap-3">

            <button onClick={()=>setSelected(selected==='jy'?null:'jy')}
              className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 bg-white transition-all ${selected==='jy'?'border-blue-400 border-2':'border-gray-200'}`}>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">⚽</div>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">ジュニアユースを探す</div>
                <div className="text-xs text-gray-500">中学生年代（U13〜U15）のクラブチーム</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">J下部組織</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">街クラブ</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">セレクション情報</span>
                </div>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

            {selected==='jy' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-medium text-blue-800 mb-3">どのエリアで探しますか？</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[['東京都','bg-purple-100 text-purple-800 border-purple-200'],['神奈川県','bg-amber-100 text-amber-800 border-amber-200'],['埼玉県','bg-blue-100 text-blue-800 border-blue-200'],['千葉県','bg-green-100 text-green-800 border-green-200']].map(([pref,cls])=>(
                    <Link key={pref} href={`/teams?pref=${pref}&cat=ジュニアユース`}
                      className={`p-2 rounded-lg border text-center text-xs font-medium ${cls}`}>{pref}</Link>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link href="/teams?type=J下部&cat=ジュニアユース" className="text-xs px-3 py-1 rounded-full border border-blue-300 bg-white text-blue-700">J下部のみ</Link>
                  <Link href="/teams?cat=ジュニアユース" className="text-xs px-3 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-700">受付中のみ</Link>
                </div>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='unknown'?null:'unknown')}
              className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 bg-white transition-all ${selected==='unknown'?'border-green-400 border-2':'border-gray-200'}`}>
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">🔍</div>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">カテゴリ名がわからない</div>
                <div className="text-xs text-gray-500">学年・年齢から探せます</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-800">小1〜小6</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-800">中1〜中3</span>
                </div>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

            {selected==='unknown' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-medium text-green-800 mb-3">お子さんの学年を選んでください</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[['小1','U8'],['小2','U8'],['小3','U10'],['小4','U10'],['小5','U12'],['小6','U12'],['中1','JY'],['中2','JY'],['中3','JY']].map(([g,cat])=>(
                    <Link key={g} href={`/teams?cat=${cat==='JY'?'ジュニアユース':cat}`}
                      className="p-2 rounded-lg border border-green-200 bg-white text-center cursor-pointer hover:bg-green-50">
                      <div className="text-xs font-medium text-green-800">{g}</div>
                      <div className="text-xs text-green-600 mt-0.5">{cat}</div>
                    </Link>
                  ))}
                </div>
                <div className="bg-white rounded-lg p-2 text-xs text-gray-500">
                  U8=7〜8歳 / U10=9〜10歳 / U12=11〜12歳 / JY=13〜15歳
                </div>
              </div>
            )}

            <button onClick={()=>setSelected(selected==='academy'?null:'academy')}
              className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 bg-white transition-all ${selected==='academy'?'border-amber-400 border-2':'border-gray-200'}`}>
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">🏆</div>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">アカデミーを探す</div>
                <div className="text-xs text-gray-500">Jクラブ・プロ育成型のスクール</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">FC東京</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">浦和レッズ</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">Jリーグ系</span>
                </div>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

            {selected==='academy' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-medium text-amber-800 mb-3">Jクラブ系アカデミーを探す</p>
                <div className="flex flex-col gap-2">
                  {[['FC東京アカデミー','東京都'],['東京ヴェルディアカデミー','東京都'],['浦和レッズアカデミー','埼玉県'],['横浜F・マリノスアカデミー','神奈川県'],['柏レイソルアカデミー','千葉県']].map(([name,pref])=>(
                    <Link key={name} href={`/teams?type=J下部&pref=${pref}`}
                      className="flex justify-between items-center p-2 bg-white rounded-lg border border-amber-100">
                      <div>
                        <div className="text-xs font-medium">{name}</div>
                        <div className="text-xs text-gray-400">{pref}</div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded border border-amber-300 text-amber-700">詳細 ›</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-600">受付中のセレクション</p>
            <Link href="/calendar" className="text-xs text-blue-500">年間カレンダー ›</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[['FC東京U-15','締切 6/30','border-red-200 bg-red-50','締切間近'],['横浜F・マリノス','7月開始予定','border-green-200 bg-green-50','受付中'],['浦和レッズJY','7月セレクション','border-green-200 bg-green-50','受付中'],['ジェフ千葉U-15','7〜8月','border-green-200 bg-green-50','受付中']].map(([name,date,cls,status])=>(
              <div key={name} className={`flex-shrink-0 border rounded-xl p-3 min-w-32 ${cls}`}>
                <div className={`text-xs font-medium mb-1 ${status==='締切間近'?'text-red-600':'text-green-600'}`}>{status}</div>
                <div className="text-xs font-medium">{name}</div>
                <div className="text-xs text-gray-400 mt-1">{date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Link href="/teams" className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">🗺️</div>
            <div className="text-xs font-medium">地図で探す</div>
          </Link>
          <Link href="/calendar" className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">📅</div>
            <div className="text-xs font-medium">カレンダー</div>
          </Link>
          <Link href="/nutrition" className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">🥗</div>
            <div className="text-xs font-medium">栄養・食事</div>
          </Link>
        </div>

      </div>
    </main>
  )
}
