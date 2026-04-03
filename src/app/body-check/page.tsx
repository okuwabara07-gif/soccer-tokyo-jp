'use client'
import { useState } from 'react'
import Link from 'next/link'

const TOKYO_AVG = {
  '小1': { height: 116.5, weight: 21.4 },
  '小2': { height: 122.4, weight: 24.0 },
  '小3': { height: 128.1, weight: 26.8 },
  '小4': { height: 133.5, weight: 30.0 },
  '小5': { height: 139.5, weight: 33.8 },
  '小6': { height: 146.5, weight: 38.5 },
  '中1': { height: 155.0, weight: 45.2 },
  '中2': { height: 161.5, weight: 50.1 },
  '中3': { height: 165.8, weight: 54.3 },
}

const NUTRITION_NEEDS: Record<string, any> = {
  '小1': { energy: 1350, protein: 35, calcium: 600, iron: 5.5 },
  '小2': { energy: 1450, protein: 40, calcium: 600, iron: 5.5 },
  '小3': { energy: 1550, protein: 45, calcium: 700, iron: 6.5 },
  '小4': { energy: 1650, protein: 50, calcium: 750, iron: 7.0 },
  '小5': { energy: 1800, protein: 55, calcium: 800, iron: 8.0 },
  '小6': { energy: 1950, protein: 60, calcium: 800, iron: 8.5 },
  '中1': { energy: 2300, protein: 65, calcium: 1000, iron: 10.0 },
  '中2': { energy: 2500, protein: 70, calcium: 1000, iron: 10.5 },
  '中3': { energy: 2600, protein: 70, calcium: 800, iron: 10.0 },
}

const MEAL_PLANS: Record<string, string[]> = {
  underweight: [
    '朝：ご飯2杯＋卵焼き2個＋味噌汁',
    '間食：バナナ2本＋牛乳200ml',
    '昼：カツ丼または焼き肉定食（大盛り）',
    '練習後：プロテイン＋おにぎり2個',
    '夜：鶏もも肉150g＋ご飯2杯＋野菜たっぷり',
  ],
  normal: [
    '朝：ご飯1.5杯＋納豆＋卵＋味噌汁',
    '間食：おにぎり1個＋牛乳',
    '昼：定食（炭水化物・タンパク質・野菜のバランス重視）',
    '練習後：アミノ酸＋おにぎり1個',
    '夜：魚または肉100g＋ご飯1.5杯＋サラダ',
  ],
  overweight: [
    '朝：ご飯1杯＋卵＋野菜たっぷり味噌汁',
    '間食：ヨーグルト＋果物（菓子類は控える）',
    '昼：定食（揚げ物より焼き・煮物系）',
    '練習後：プロテイン（糖質少なめ）',
    '夜：野菜中心＋タンパク質・炭水化物少なめ',
  ],
}

function getBMI(weight: number, height: number) {
  const h = height / 100
  return weight / (h * h)
}

function getStatus(bmi: number, grade: string) {
  const isJunior = grade.startsWith('小')
  if (isJunior) {
    if (bmi < 14.5) return 'underweight'
    if (bmi < 19) return 'normal'
    return 'overweight'
  } else {
    if (bmi < 16) return 'underweight'
    if (bmi < 22) return 'normal'
    return 'overweight'
  }
}

const STATUS_LABEL: Record<string, string> = {
  underweight: '体重が少なめ',
  normal: '理想的な体格',
  overweight: '体重が多め',
}
const STATUS_COLOR: Record<string, string> = {
  underweight: '#185FA5',
  normal: '#0F6E56',
  overweight: '#993C1D',
}

export default function BodyCheckPage() {
  const [grade, setGrade] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<any>(null)

  const grades = Object.keys(TOKYO_AVG)

  const diagnose = () => {
    if (!grade || !height || !weight) return
    const h = parseFloat(height)
    const w = parseFloat(weight)
    const avg = TOKYO_AVG[grade as keyof typeof TOKYO_AVG]
    const needs = NUTRITION_NEEDS[grade as keyof typeof NUTRITION_NEEDS]
    const bmi = getBMI(w, h)
    const status = getStatus(bmi, grade)
    const heightDiff = h - avg.height
    const weightDiff = w - avg.weight
    setResult({ h, w, avg, needs, bmi, status, heightDiff, weightDiff })
  }

  const share = () => {
    const text = result ? `身長${result.h}cm・体重${result.w}kgで${STATUS_LABEL[result.status]}です！関東ジュニアサッカー情報局で体格診断 → https://soccer-tokyo-jp.vercel.app/body-check` : ''
    if (navigator.share) {
      navigator.share({ title: '体格診断結果', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('コピーしました！')
    }
  }

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        <div style={{background:'#0a0a0a',padding:'20px 16px 16px'}}>
          <Link href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>← 戻る</Link>
          <h1 style={{color:'white',fontSize:22,fontWeight:300,letterSpacing:'-0.02em',marginBottom:4}}>体格診断＆栄養アドバイス</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>東京都平均と比較・必要栄養素を計算</p>
        </div>

        <div style={{padding:16}}>
          <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 16px',marginBottom:12}}>
            <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:12,textTransform:'uppercase'}}>お子さんの情報を入力</p>

            <div style={{marginBottom:10}}>
              <label style={{fontSize:11,color:'#666',display:'block',marginBottom:6}}>学年</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
                {grades.map(g=>(
                  <button key={g} onClick={()=>setGrade(g)}
                    style={{padding:'8px 4px',borderRadius:8,border:`1px solid ${grade===g?'#1a1a1a':'#e8e8e4'}`,
                      background:grade===g?'#1a1a1a':'white',color:grade===g?'white':'#666',fontSize:11,cursor:'pointer'}}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
              <div>
                <label style={{fontSize:11,color:'#666',display:'block',marginBottom:4}}>身長 (cm)</label>
                <input type="number" value={height} onChange={e=>setHeight(e.target.value)}
                  placeholder="例: 145"
                  style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:14,outline:'none'}}/>
              </div>
              <div>
                <label style={{fontSize:11,color:'#666',display:'block',marginBottom:4}}>体重 (kg)</label>
                <input type="number" value={weight} onChange={e=>setWeight(e.target.value)}
                  placeholder="例: 38"
                  style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:14,outline:'none'}}/>
              </div>
            </div>

            <button onClick={diagnose}
              style={{width:'100%',padding:'12px',borderRadius:10,background:'#1a1a1a',color:'white',fontSize:13,fontWeight:500,border:'none',cursor:'pointer',letterSpacing:'0.05em'}}>
              診断する
            </button>
          </div>

          {result && (
            <>
              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 16px',marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',textTransform:'uppercase'}}>診断結果</p>
                  <span style={{fontSize:11,padding:'3px 10px',borderRadius:10,fontWeight:500,
                    background:STATUS_COLOR[result.status]+'18',color:STATUS_COLOR[result.status]}}>
                    {STATUS_LABEL[result.status]}
                  </span>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
                  <div style={{background:'#f8f8f6',borderRadius:8,padding:'10px 12px'}}>
                    <p style={{fontSize:9,color:'#999',marginBottom:4}}>身長</p>
                    <p style={{fontSize:20,fontWeight:300,color:'#1a1a1a',marginBottom:2}}>{result.h}<span style={{fontSize:11}}>cm</span></p>
                    <p style={{fontSize:10,color:result.heightDiff>=0?'#0F6E56':'#993C1D'}}>
                      東京平均より{result.heightDiff>=0?'+':''}{result.heightDiff.toFixed(1)}cm
                    </p>
                  </div>
                  <div style={{background:'#f8f8f6',borderRadius:8,padding:'10px 12px'}}>
                    <p style={{fontSize:9,color:'#999',marginBottom:4}}>体重</p>
                    <p style={{fontSize:20,fontWeight:300,color:'#1a1a1a',marginBottom:2}}>{result.w}<span style={{fontSize:11}}>kg</span></p>
                    <p style={{fontSize:10,color:result.weightDiff>=0?'#0F6E56':'#993C1D'}}>
                      東京平均より{result.weightDiff>=0?'+':''}{result.weightDiff.toFixed(1)}kg
                    </p>
                  </div>
                </div>

                <div style={{background:'#f8f8f6',borderRadius:8,padding:'10px 12px',marginBottom:10}}>
                  <p style={{fontSize:9,color:'#999',marginBottom:8,letterSpacing:'0.1em',textTransform:'uppercase'}}>1日の推奨摂取量（文科省基準）</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                    {[
                      ['エネルギー', result.needs.energy, 'kcal'],
                      ['タンパク質', result.needs.protein, 'g'],
                      ['カルシウム', result.needs.calcium, 'mg'],
                      ['鉄分', result.needs.iron, 'mg'],
                    ].map(([name,val,unit])=>(
                      <div key={String(name)} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:10,color:'#666'}}>{name}</span>
                        <span style={{fontSize:11,fontWeight:500,color:'#1a1a1a'}}>{val}{unit}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:9,color:'#bbb',marginTop:8}}>出典：日本人の食事摂取基準（厚生労働省）</p>
                </div>

                <button onClick={share}
                  style={{width:'100%',padding:'10px',borderRadius:8,border:'1px solid #e8e8e4',background:'white',color:'#1a1a1a',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <span>📤</span> 結果をシェアする
                </button>
              </div>

              <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px 16px',marginBottom:12}}>
                <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:12,textTransform:'uppercase'}}>
                  {STATUS_LABEL[result.status]}の選手向け 食事プラン
                </p>
                {MEAL_PLANS[result.status].map((meal,i)=>(
                  <div key={i} style={{display:'flex',gap:10,marginBottom:8,alignItems:'flex-start'}}>
                    <span style={{fontSize:10,color:'#999',flexShrink:0,minWidth:6}}>·</span>
                    <span style={{fontSize:12,color:'#444',lineHeight:1.6}}>{meal}</span>
                  </div>
                ))}
              </div>

              <div style={{background:'#0a0a0a',borderRadius:12,padding:'14px 16px'}}>
                <p style={{fontSize:11,fontWeight:500,color:'white',marginBottom:10}}>おすすめ補助食品</p>
                <Link href="/nutrition" style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                  background:'rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 12px',textDecoration:'none'}}>
                  <span style={{fontSize:12,color:'white'}}>補助食品ランキングを見る</span>
                  <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>→</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
