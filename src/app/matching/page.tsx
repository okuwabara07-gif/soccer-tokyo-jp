'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const QUESTIONS = [
  {
    id: 'goal',
    title: 'お子さんのサッカーの目標は？',
    emoji: '🎯',
    image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80',
    options: [
      { value: 'pro', label: 'プロ・Jリーグを目指したい', icon: '⭐' },
      { value: 'selection', label: 'セレクションに合格したい', icon: '🏆' },
      { value: 'enjoy', label: 'サッカーを楽しみたい', icon: '😊' },
      { value: 'health', label: '健康・友達づくりが目的', icon: '👫' },
    ]
  },
  {
    id: 'level',
    title: '現在のサッカー経験は？',
    emoji: '📊',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    options: [
      { value: 'beginner', label: 'まったくの初心者', icon: '🌱' },
      { value: 'basic', label: '少し経験がある（1〜2年）', icon: '🌿' },
      { value: 'intermediate', label: 'ある程度できる（3年以上）', icon: '🌳' },
      { value: 'advanced', label: 'かなり上手い（チーム経験あり）', icon: '🏅' },
    ]
  },
  {
    id: 'style',
    title: 'どんな指導スタイルが希望？',
    emoji: '👨‍🏫',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&q=80',
    options: [
      { value: 'strict', label: '厳しく本格的な指導', icon: '💪' },
      { value: 'balanced', label: '楽しさと厳しさのバランス', icon: '⚖️' },
      { value: 'fun', label: '楽しく伸び伸びと', icon: '🎉' },
      { value: 'technical', label: '技術重視・丁寧な指導', icon: '🎓' },
    ]
  },
  {
    id: 'frequency',
    title: '練習頻度はどのくらいを希望？',
    emoji: '📅',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
    options: [
      { value: 'low', label: '週1〜2回（他の習い事もある）', icon: '🌙' },
      { value: 'medium', label: '週3〜4回（しっかり練習したい）', icon: '☀️' },
      { value: 'high', label: '週5〜6回（本気でやりたい）', icon: '🔥' },
      { value: 'any', label: 'こだわらない', icon: '🤷' },
    ]
  },
  {
    id: 'budget',
    title: '月々の費用はどのくらいを想定？',
    emoji: '💰',
    image: 'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=600&q=80',
    options: [
      { value: 'low', label: '〜5,000円', icon: '💴' },
      { value: 'medium', label: '5,000〜10,000円', icon: '💵' },
      { value: 'high', label: '10,000〜20,000円', icon: '💶' },
      { value: 'any', label: 'こだわらない', icon: '🤷' },
    ]
  },
  {
    id: 'distance',
    title: '通える距離は？',
    emoji: '📍',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
    options: [
      { value: 'walk', label: '徒歩・自転車圏内', icon: '🚲' },
      { value: 'near', label: '車で15分以内', icon: '🚗' },
      { value: 'medium', label: '車で30分以内', icon: '🚙' },
      { value: 'any', label: 'こだわらない', icon: '🤷' },
    ]
  },
  {
    id: 'type',
    title: 'チームのタイプは？',
    emoji: '⚽',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80',
    options: [
      { value: 'jleague', label: 'Jリーグ系クラブ', icon: '🏟️' },
      { value: 'street', label: '街クラブ（地域密着）', icon: '🏘️' },
      { value: 'school', label: 'スクール・アカデミー', icon: '🏫' },
      { value: 'any', label: 'こだわらない', icon: '🤷' },
    ]
  },
]

export default function TeamMatchingPage() {
  const [isPremium, setIsPremium] = useState(false)
  const [isTrial, setIsTrial] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [prefecture, setPrefecture] = useState('東京都')

  useEffect(() => {
    const plan = localStorage.getItem('memberPlan')
    const trialStart = localStorage.getItem('trialStart')
    setIsPremium(!!plan)
    if (trialStart) {
      const days = Math.floor((Date.now() - new Date(trialStart).getTime()) / (1000*60*60*24))
      setIsTrial(days < 3)
    }
  }, [])

  const isActive = isPremium || isTrial

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300)
    } else {
      findTeams(newAnswers)
    }
  }

  const findTeams = async (ans: Record<string, string>) => {
    setLoading(true)
    try {
      let query = supabase.from('teams').select('*').eq('prefecture', prefecture)
      if (ans.type === 'jleague') query = query.eq('is_jleague', true)
      else if (ans.type === 'street') query = query.eq('is_jleague', false)
      if (ans.level === 'beginner' || ans.goal === 'enjoy') {
        query = query.in('category', ['ジュニア','アカデミー'])
      } else if (ans.goal === 'pro' || ans.goal === 'selection') {
        query = query.in('category', ['ジュニア','ジュニアユース'])
      }
      const { data } = await query.limit(100)
      const teams = data || []

      // AIでチームをマッチング
      const res = await fetch('/api/team-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: ans, teams: teams.slice(0, 30), prefecture })
      })
      const matchResult = await res.json()
      setResult({ teams, matchResult, answers: ans })
    } catch (e) {
      setResult({ teams: [], matchResult: null, answers: ans })
    }
    setLoading(false)
    setStep(QUESTIONS.length + 1)
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  const q = QUESTIONS[step]

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        {/* ヘッダー */}
        <div style={{position:'relative',height:160,overflow:'hidden'}}>
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
            alt="チーム選び" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 30%'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(10,10,10,0.95))'}}>
            <div style={{position:'absolute',top:14,left:16}}>
              <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none'}}>← 戻る</Link>
            </div>
            <div style={{position:'absolute',bottom:14,left:16,right:16}}>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:9,letterSpacing:'0.15em',marginBottom:4}}>TEAM MATCHING</p>
              <h1 style={{color:'white',fontSize:18,fontWeight:700,marginBottom:2}}>最適なチームを探す</h1>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:10}}>7つの質問でお子さんにぴったりのチームを提案</p>
            </div>
          </div>
        </div>

        {/* 非会員の場合 */}
        {!isActive && (
          <div style={{padding:16}}>
            <div style={{borderRadius:14,overflow:'hidden',marginBottom:12}}>
              <div style={{position:'relative',height:140}}>
                <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80"
                  alt="プレミアム" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.75)',
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,padding:'0 20px'}}>
                  <span style={{fontSize:32}}>🔒</span>
                  <p style={{fontSize:14,fontWeight:700,color:'white',textAlign:'center'}}>チームマッチングは有料会員限定</p>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.6)',textAlign:'center',lineHeight:1.6}}>
                    7つの質問に答えるだけで、お子さんにぴったりのチームをAIが提案します
                  </p>
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Link href="/member"
                style={{flex:1,padding:'12px',borderRadius:10,background:'#FFD700',
                  color:'#1a1a1a',fontSize:12,fontWeight:700,textDecoration:'none',textAlign:'center',display:'block'}}>
                ¥500/月で登録する
              </Link>
              <button onClick={()=>{localStorage.setItem('trialStart',new Date().toISOString());setIsTrial(true)}}
                style={{flex:1,padding:'12px',borderRadius:10,background:'rgba(255,255,255,0.1)',
                  border:'1px solid rgba(255,255,255,0.2)',color:'white',fontSize:12,cursor:'pointer'}}>
                🎁 3日間無料体験
              </button>
            </div>
          </div>
        )}

        {/* 会員向けコンテンツ */}
        {isActive && (
          <div style={{padding:16}}>

            {/* 都道府県選択 */}
            {step === 0 && (
              <div style={{marginBottom:12}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:6}}>対象エリア</p>
                <div style={{display:'flex',gap:6}}>
                  {['東京都','神奈川県','埼玉県','千葉県'].map(p=>(
                    <button key={p} onClick={()=>setPrefecture(p)}
                      style={{flex:1,padding:'6px',borderRadius:8,border:'none',cursor:'pointer',fontSize:10,
                        background:prefecture===p?'#4CAF50':'rgba(255,255,255,0.08)',
                        color:prefecture===p?'white':'rgba(255,255,255,0.4)',fontWeight:prefecture===p?700:400}}>
                      {p.replace('都','').replace('県','')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* プログレスバー */}
            {step < QUESTIONS.length && (
              <div style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>質問 {step+1} / {QUESTIONS.length}</p>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{Math.round((step/QUESTIONS.length)*100)}%</p>
                </div>
                <div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:2}}>
                  <div style={{height:'100%',width:`${((step+1)/QUESTIONS.length)*100}%`,background:'#4CAF50',borderRadius:2,transition:'width 0.3s'}}/>
                </div>
              </div>
            )}

            {/* 質問 */}
            {step < QUESTIONS.length && q && (
              <div>
                <div style={{borderRadius:12,overflow:'hidden',marginBottom:12}}>
                  <div style={{position:'relative',height:120}}>
                    <img src={q.image} alt={q.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',
                      display:'flex',alignItems:'center',padding:'0 16px',gap:12}}>
                      <span style={{fontSize:28,flexShrink:0}}>{q.emoji}</span>
                      <p style={{fontSize:14,fontWeight:700,color:'white',lineHeight:1.4}}>{q.title}</p>
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {q.options.map(opt=>(
                    <button key={opt.value}
                      onClick={()=>handleAnswer(q.id, opt.value)}
                      style={{display:'flex',alignItems:'center',gap:12,padding:'14px',
                        borderRadius:12,border:`1px solid ${answers[q.id]===opt.value?'#4CAF50':'rgba(255,255,255,0.1)'}`,
                        background:answers[q.id]===opt.value?'rgba(76,175,80,0.15)':'rgba(255,255,255,0.04)',
                        cursor:'pointer',textAlign:'left'}}>
                      <span style={{fontSize:20,flexShrink:0}}>{opt.icon}</span>
                      <p style={{fontSize:13,color:'white',fontWeight:answers[q.id]===opt.value?600:400}}>{opt.label}</p>
                      {answers[q.id]===opt.value && <span style={{marginLeft:'auto',color:'#4CAF50',fontSize:16}}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ローディング */}
            {loading && (
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:48,marginBottom:16,animation:'pulse 1.5s infinite'}}>⚽</div>
                <p style={{fontSize:14,color:'white',fontWeight:600,marginBottom:6}}>最適なチームを探しています...</p>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>AIが{prefecture}のチームを分析中</p>
                <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}`}</style>
              </div>
            )}

            {/* 結果 */}
            {result && !loading && (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{background:'rgba(76,175,80,0.1)',borderRadius:12,padding:'14px',border:'1px solid rgba(76,175,80,0.3)'}}>
                  <p style={{fontSize:11,color:'#4CAF50',fontWeight:600,marginBottom:6}}>✓ マッチング完了！</p>
                  {result.matchResult?.advice && (
                    <p style={{fontSize:12,color:'rgba(255,255,255,0.8)',lineHeight:1.7}}>{result.matchResult.advice}</p>
                  )}
                </div>

                {result.matchResult?.recommended?.length > 0 && (
                  <div>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>おすすめチーム</p>
                    {result.matchResult.recommended.map((team:any, i:number)=>(
                      <div key={i} style={{background:'#111',borderRadius:12,padding:'12px 14px',marginBottom:8,
                        border:`1px solid ${i===0?'rgba(255,215,0,0.4)':'rgba(255,255,255,0.08)'}`}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                          <div>
                            {i===0 && <span style={{fontSize:9,padding:'1px 7px',borderRadius:6,background:'#FFD700',color:'#1a1a1a',fontWeight:700,display:'inline-block',marginBottom:4}}>⭐ 最もおすすめ</span>}
                            <p style={{fontSize:13,fontWeight:700,color:'white',marginBottom:2}}>{team.name}</p>
                            <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{team.area} · {team.category}</p>
                          </div>
                          <Link href="/teams"
                            style={{padding:'5px 10px',borderRadius:7,background:'rgba(255,255,255,0.1)',
                              color:'white',fontSize:10,textDecoration:'none',flexShrink:0}}>
                            地図で見る
                          </Link>
                        </div>
                        {team.reason && (
                          <p style={{fontSize:11,color:'rgba(255,255,255,0.6)',lineHeight:1.6,background:'rgba(255,255,255,0.04)',
                            borderRadius:8,padding:'8px 10px'}}>{team.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={reset}
                  style={{padding:'12px',borderRadius:10,background:'rgba(255,255,255,0.08)',
                    border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:12,cursor:'pointer'}}>
                  もう一度診断する
                </button>
                <Link href="/teams"
                  style={{display:'block',padding:'12px',borderRadius:10,background:'#4CAF50',
                    color:'white',fontSize:12,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
                  全チームを検索する →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
