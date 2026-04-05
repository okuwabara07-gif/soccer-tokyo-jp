'use client'
import { useState } from 'react'
import Link from 'next/link'

const GRADES = ['小1','小2','小3','小4','小5','小6','中1','中2','中3']

const AVG_DATA: Record<string, {height:number, weight:number}> = {
  '小1':{height:116.5,weight:21.4},'小2':{height:122.4,weight:24.0},
  '小3':{height:128.1,weight:26.8},'小4':{height:133.5,weight:30.0},
  '小5':{height:139.5,weight:33.8},'小6':{height:146.5,weight:38.5},
  '中1':{height:155.0,weight:45.2},'中2':{height:161.5,weight:50.1},
  '中3':{height:165.8,weight:54.3},
}

const GROWTH_DATA: Record<string, number[]> = {
  '小1':[116.5,122.4,128.1,133.5,139.5,146.5,155.0,161.5,165.8],
  '小2':[122.4,128.1,133.5,139.5,146.5,155.0,161.5,165.8,168.0],
  '小3':[128.1,133.5,139.5,146.5,155.0,161.5,165.8,168.0,170.0],
  '小4':[133.5,139.5,146.5,155.0,161.5,165.8,168.0,170.0,171.5],
  '小5':[139.5,146.5,155.0,161.5,165.8,168.0,170.0,171.5,172.0],
  '小6':[146.5,155.0,161.5,165.8,168.0,170.0,171.5,172.0,172.5],
  '中1':[155.0,161.5,165.8,168.0,170.0,171.5,172.0,172.5,173.0],
  '中2':[161.5,165.8,168.0,170.0,171.5,172.0,172.5,173.0,173.0],
  '中3':[165.8,168.0,170.0,171.5,172.0,172.5,173.0,173.0,173.0],
}

const PLAYER_HEIGHTS: Record<string, {name:string, height:number, emoji:string}[]> = {
  '小1':[{name:'一般的なU8選手',height:117,emoji:'⚽'},{name:'久保建英（小1当時）',height:115,emoji:'🇯🇵'}],
  '小4':[{name:'三笘薫（小4当時）',height:132,emoji:'🇯🇵'},{name:'一般的なU10選手',height:133,emoji:'⚽'}],
  '小6':[{name:'一般的なU12選手',height:145,emoji:'⚽'},{name:'メッシ（U12当時）',height:140,emoji:'🇦🇷'}],
  '中1':[{name:'ハーランド（U13当時）',height:162,emoji:'🇳🇴'},{name:'一般的なU13選手',height:155,emoji:'⚽'}],
  '中2':[{name:'エムバペ（U14当時）',height:163,emoji:'🇫🇷'},{name:'一般的なU14選手',height:161,emoji:'⚽'}],
  '中3':[{name:'一般的なU15選手',height:165,emoji:'⚽'},{name:'三笘薫（中3当時）',height:167,emoji:'🇯🇵'}],
}

const POSITION_IDEAL: Record<string, {pos:string, height:string, weight:string, desc:string}[]> = {
  junior: [
    {pos:'GK',height:'平均+5cm以上',weight:'標準〜やや重め',desc:'身長が武器。体重もある程度必要'},
    {pos:'CB',height:'平均以上',weight:'標準〜やや重め',desc:'フィジカルの強さが重要'},
    {pos:'SB',height:'平均程度',weight:'標準',desc:'スピードとスタミナが重要'},
    {pos:'MF',height:'平均程度',weight:'標準',desc:'バランスが最も重要なポジション'},
    {pos:'FW',height:'平均〜やや低め',weight:'標準〜やや軽め',desc:'スピードと俊敏性が重要'},
  ]
}

const NUTRITION_NEEDS: Record<string, any> = {
  '小1':{energy:1350,protein:35,calcium:600,iron:5.5},
  '小2':{energy:1450,protein:40,calcium:600,iron:5.5},
  '小3':{energy:1550,protein:45,calcium:700,iron:6.5},
  '小4':{energy:1650,protein:50,calcium:750,iron:7.0},
  '小5':{energy:1800,protein:55,calcium:800,iron:8.0},
  '小6':{energy:1950,protein:60,calcium:800,iron:8.5},
  '中1':{energy:2300,protein:65,calcium:1000,iron:10.0},
  '中2':{energy:2500,protein:70,calcium:1000,iron:10.5},
  '中3':{energy:2600,protein:70,calcium:800,iron:10.0},
}

const AMAZON_TAG = 'haircolorab22-22'
const RAKUTEN_ID = '5253b9ed.08f9d938.5253b9ee.e71aefe8'

const SUPPLEMENT_LINKS = {
  protein: {
    amazon: `https://www.amazon.co.jp/s?k=ジュニアプロテイン&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%83%97%E3%83%AD%E3%83%86%E3%82%A4%E3%83%B3%2F`
  },
  calcium: {
    amazon: `https://www.amazon.co.jp/s?k=カルシウムサプリ+子供&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%AB%E3%83%AB%E3%82%B7%E3%82%A6%E3%83%A0%E3%82%B0%E3%83%9F%2F`
  },
  iron: {
    amazon: `https://www.amazon.co.jp/s?k=鉄分サプリ+子供&tag=${AMAZON_TAG}`,
    rakuten: `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E9%89%84%E5%88%86%E3%82%B5%E3%83%97%E3%83%AA%2F`
  },
}

function getBMI(w: number, h: number) { return w / ((h/100)**2) }
function getStatus(bmi: number, grade: string) {
  const isJunior = grade.startsWith('小')
  if (isJunior) { if(bmi<14.5) return 'under'; if(bmi<19) return 'normal'; return 'over' }
  else { if(bmi<16) return 'under'; if(bmi<22) return 'normal'; return 'over' }
}

export default function BodyCheckPage() {
  const [grade, setGrade] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<any>(null)
  const [tab, setTab] = useState<'result'|'growth'|'nutrition'|'position'>('result')
  const [aiComment, setAiComment] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const diagnose = () => {
    const h = parseFloat(height), w = parseFloat(weight)
    if (!grade || !h || !w) return
    const avg = AVG_DATA[grade]
    const bmi = getBMI(w, h)
    const status = getStatus(bmi, grade)
    const nutrition = NUTRITION_NEEDS[grade]
    const hDiff = h - avg.height
    const wDiff = w - avg.weight
    const players = PLAYER_HEIGHTS[grade] || []
    const r = { h, w, bmi: Math.round(bmi*10)/10, status, avg, hDiff: Math.round(hDiff*10)/10, wDiff: Math.round(wDiff*10)/10, nutrition, players, grade }
    setResult(r)
    // マイページ用に自動保存
    localStorage.setItem('bodyDiagnosis', JSON.stringify({
      ...r,
      diagnosedAt: new Date().toISOString()
    }))
    setTab('result')
    // AIコメント取得
    setAiLoading(true)
    setAiComment('')
    fetch('/api/body-advice', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(r)
    }).then(res=>res.json()).then(data=>{
      setAiComment(data.comment || '')
    }).catch(()=>{}).finally(()=>setAiLoading(false))
  }

  const gradeIdx = result ? GRADES.indexOf(result.grade) : 0
  const growthLabels = GRADES.slice(gradeIdx)
  const avgGrowth = GROWTH_DATA[result?.grade || '小1'] || []
  const predictedGrowth = avgGrowth.map((v,i) => Math.round((v + (result?.hDiff || 0) * Math.max(0, 1 - i*0.15)) * 10) / 10)

  const statusConfig = {
    under: { label:'体重が少なめ', color:'#185FA5', bg:'#E6F1FB', advice:'カロリーと栄養を増やして体重アップを目指しましょう。特にタンパク質と炭水化物が重要です。', icon:'📈' },
    normal: { label:'理想的な体格', color:'#0F6E56', bg:'#E1F5EE', advice:'バランスの良い食事を継続しましょう。このまま維持することが大切です。', icon:'✅' },
    over: { label:'体重が多め', color:'#993C1D', bg:'#FAECE7', advice:'野菜中心の食事と有酸素運動を増やしましょう。成長期なので無理なダイエットは禁物です。', icon:'⚠️' },
  }

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        {/* ヒーロー画像 */}
        <div style={{position:'relative',height:180,overflow:'hidden'}}>
          <img src="https://images.unsplash.com/photo-1551280857-2b9bbe52acf9?w=800&q=80"
            alt="サッカー少年の体格測定" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 30%'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(10,10,10,0.9))'}}>
            <div style={{position:'absolute',bottom:16,left:16,right:16}}>
              <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none',display:'block',marginBottom:6}}>← 戻る</Link>
              <h1 style={{color:'white',fontSize:22,fontWeight:300,marginBottom:2}}>体格診断</h1>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>全国平均比較・成長予測・栄養アドバイス</p>
            </div>
          </div>
        </div>

        <div style={{padding:16}}>
          {/* 入力フォーム */}
          <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px',marginBottom:12}}>
            <p style={{fontSize:10,color:'#999',letterSpacing:'0.12em',marginBottom:12}}>お子さんの情報</p>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:'#666',display:'block',marginBottom:6}}>学年</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5}}>
                {GRADES.map(g=>(
                  <button key={g} onClick={()=>setGrade(g)}
                    style={{padding:'8px',borderRadius:8,border:`1px solid ${grade===g?'#1a1a1a':'#e8e8e4'}`,
                      background:grade===g?'#1a1a1a':'white',color:grade===g?'white':'#666',fontSize:11,cursor:'pointer'}}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
              <div>
                <label style={{fontSize:11,color:'#666',display:'block',marginBottom:4}}>身長 (cm)</label>
                <input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="例: 140"
                  style={{width:'100%',padding:'10px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:14,outline:'none'}}/>
              </div>
              <div>
                <label style={{fontSize:11,color:'#666',display:'block',marginBottom:4}}>体重 (kg)</label>
                <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="例: 35"
                  style={{width:'100%',padding:'10px',borderRadius:8,border:'1px solid #e8e8e4',fontSize:14,outline:'none'}}/>
              </div>
            </div>
            <button onClick={diagnose} disabled={!grade||!height||!weight}
              style={{width:'100%',padding:'12px',borderRadius:10,border:'none',
                background:grade&&height&&weight?'#1a1a1a':'#e8e8e4',
                color:grade&&height&&weight?'white':'#bbb',fontSize:13,fontWeight:500,cursor:'pointer'}}>
              診断する →
            </button>
          </div>

          {/* 結果 */}
          {result && (
            <>
              {/* タブ */}
              <div style={{display:'flex',background:'white',borderRadius:10,border:'1px solid #eeeeea',marginBottom:12,overflow:'hidden'}}>
                {([['result','診断結果'],['growth','成長予測'],['nutrition','栄養'],['position','ポジション']] as const).map(([key,label])=>(
                  <button key={key} onClick={()=>setTab(key)}
                    style={{flex:1,padding:'10px 4px',fontSize:10,border:'none',background:tab===key?'#1a1a1a':'transparent',
                      color:tab===key?'white':'#999',cursor:'pointer',borderRight:'1px solid #eeeeea'}}>
                    {label}
                  </button>
                ))}
              </div>

              {tab==='result' && (
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {/* ステータス */}
                  <div style={{background:statusConfig[result.status as keyof typeof statusConfig].bg,borderRadius:12,padding:'14px',border:`1px solid ${statusConfig[result.status as keyof typeof statusConfig].color}30`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <span style={{fontSize:18}}>{statusConfig[result.status as keyof typeof statusConfig].icon}</span>
                      <span style={{fontSize:13,fontWeight:700,color:statusConfig[result.status as keyof typeof statusConfig].color}}>
                        {statusConfig[result.status as keyof typeof statusConfig].label}
                      </span>
                      <span style={{fontSize:12,color:'#888'}}>BMI: {result.bmi}</span>
                    </div>
                    <p style={{fontSize:11,color:'#555',lineHeight:1.7}}>{statusConfig[result.status as keyof typeof statusConfig].advice}</p>
                  </div>

                  {/* AIコメント */}
                  <div style={{background:'#0a0a0a',borderRadius:12,padding:'14px',marginBottom:2}}>
                    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
                      <span style={{fontSize:16}}>🤖</span>
                      <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em'}}>AIコーチからのコメント</p>
                    </div>
                    {aiLoading ? (
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <div style={{width:6,height:6,borderRadius:'50%',background:'#FFD700',animation:'pulse 1s infinite'}}/>
                        <p style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>分析中...</p>
                      </div>
                    ) : aiComment ? (
                      <p style={{fontSize:12,color:'rgba(255,255,255,0.8)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{aiComment}</p>
                    ) : null}
                  </div>

                  {/* チャート：平均との比較 */}
                  <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                    <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:12}}>全国平均との比較</p>
                    {[
                      {label:'身長',val:result.h,avg:result.avg.height,unit:'cm',diff:result.hDiff,max:200,color:'#457b9d'},
                      {label:'体重',val:result.w,avg:result.avg.weight,unit:'kg',diff:result.wDiff,max:80,color:'#e63946'},
                    ].map(item=>(
                      <div key={item.label} style={{marginBottom:14}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontSize:12,fontWeight:500}}>{item.label}</span>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            <span style={{fontSize:11,color:'#888'}}>平均 {item.avg}{item.unit}</span>
                            <span style={{fontSize:12,fontWeight:700,color:item.color}}>{item.val}{item.unit}</span>
                          </div>
                        </div>
                        {/* バーチャート */}
                        <div style={{position:'relative',height:24,background:'#f0f0ec',borderRadius:6,overflow:'hidden'}}>
                          {/* 平均線 */}
                          <div style={{position:'absolute',left:`${(item.avg/item.max)*100}%`,top:0,bottom:0,width:2,background:'rgba(0,0,0,0.2)',zIndex:2}}/>
                          {/* 自分のバー */}
                          <div style={{height:'100%',width:`${Math.min((item.val/item.max)*100,100)}%`,background:item.color,borderRadius:6,opacity:0.8,transition:'width 0.8s'}}/>
                          <span style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',fontSize:9,color:'rgba(0,0,0,0.4)'}}>平均</span>
                        </div>
                        <div style={{display:'flex',justifyContent:'flex-end',marginTop:3}}>
                          <span style={{fontSize:10,color:item.diff>=0?'#0F6E56':'#993C1D',fontWeight:500}}>
                            {item.diff>=0?'+':''}{item.diff}{item.unit} ({item.diff>=0?'平均より大きい':'平均より小さい'})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 有名選手比較 */}
                  {result.players.length > 0 && (
                    <div style={{background:'#0a0a0a',borderRadius:12,padding:'14px'}}>
                      <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>同じ学年の有名選手との比較</p>
                      {result.players.map((p:any)=>(
                        <div key={p.name} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,padding:'8px',background:'rgba(255,255,255,0.05)',borderRadius:8}}>
                          <span style={{fontSize:20}}>{p.emoji}</span>
                          <div style={{flex:1}}>
                            <p style={{fontSize:11,color:'white',marginBottom:2}}>{p.name}</p>
                            <div style={{height:4,background:'rgba(255,255,255,0.1)',borderRadius:2,position:'relative'}}>
                              <div style={{height:'100%',width:`${(p.height/200)*100}%`,background:'#FFD700',borderRadius:2}}/>
                              <div style={{position:'absolute',left:`${(result.h/200)*100}%`,top:-3,bottom:-3,width:2,background:'#e63946',borderRadius:1}}/>
                            </div>
                            <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginTop:2}}>{p.height}cm</p>
                          </div>
                          <span style={{fontSize:12,fontWeight:700,color:result.h>=p.height?'#4CAF50':'#FFD700'}}>
                            {result.h>=p.height?'あなたの方が大きい!':'あと'+(p.height-result.h).toFixed(1)+'cm'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* サプリCTA */}
                  <a href={SUPPLEMENT_LINKS.protein.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                    style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'#f0f7f0',borderRadius:12,border:'1px solid #c8e6c9',textDecoration:'none'}}>
                    <span style={{fontSize:24}}>💪</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:12,fontWeight:600,color:'#2d6a2d',marginBottom:1}}>成長期のタンパク質補給に</p>
                      <p style={{fontSize:10,color:'#888'}}>ジュニアプロテインをチェック →</p>
                    </div>
                  </a>
                </div>
              )}

              {tab==='growth' && (
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                    <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:4}}>成長予測グラフ</p>
                    <p style={{fontSize:9,color:'#bbb',marginBottom:12}}>現在の成長率から予測した身長推移</p>
                    {/* SVGグラフ */}
                    <svg viewBox="0 0 320 180" width="100%" style={{overflow:'visible'}}>
                      {/* グリッド */}
                      {[0,1,2,3,4].map(i=>(
                        <line key={i} x1="40" y1={20+i*32} x2="310" y2={20+i*32} stroke="#f0f0ec" strokeWidth="1"/>
                      ))}
                      {/* Y軸ラベル */}
                      {[180,170,160,150,140].map((v,i)=>(
                        <text key={v} x="32" y={24+i*32} textAnchor="end" fontSize="9" fill="#999">{v}</text>
                      ))}
                      {/* X軸ラベル */}
                      {growthLabels.slice(0,6).map((l,i)=>(
                        <text key={l} x={52+i*50} y="175" textAnchor="middle" fontSize="9" fill="#999">{l}</text>
                      ))}
                      {/* 平均ライン */}
                      <polyline
                        points={avgGrowth.slice(0,6).map((v,i)=>`${52+i*50},${148-(v-140)*3.2}`).join(' ')}
                        fill="none" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="4,3"/>
                      {/* 予測ライン */}
                      <polyline
                        points={predictedGrowth.slice(0,6).map((v,i)=>`${52+i*50},${148-(v-140)*3.2}`).join(' ')}
                        fill="none" stroke="#457b9d" strokeWidth="2.5"/>
                      {/* 現在点 */}
                      <circle cx="52" cy={148-(result.h-140)*3.2} r="5" fill="#e63946"/>
                      {/* ラベル */}
                      <text x="180" y="16" textAnchor="middle" fontSize="9" fill="#e0e0e0">── 全国平均</text>
                      <text x="260" y="16" textAnchor="middle" fontSize="9" fill="#457b9d">── あなたの予測</text>
                    </svg>
                  </div>

                  {/* 予測値テーブル */}
                  <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                    <p style={{fontSize:10,color:'#999',marginBottom:10}}>学年別 予測身長</p>
                    {growthLabels.slice(0,6).map((label,i)=>(
                      <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f8f8f6'}}>
                        <span style={{fontSize:11,color:i===0?'#e63946':'#666',fontWeight:i===0?700:400}}>{label}{i===0?' (現在)':''}</span>
                        <div style={{display:'flex',gap:16}}>
                          <span style={{fontSize:10,color:'#bbb'}}>平均 {avgGrowth[i]}cm</span>
                          <span style={{fontSize:11,fontWeight:500,color:'#457b9d'}}>{predictedGrowth[i]}cm</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href={SUPPLEMENT_LINKS.calcium.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                    style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'#fff8e6',borderRadius:12,border:'1px solid #ffe082',textDecoration:'none'}}>
                    <span style={{fontSize:24}}>🦴</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:12,fontWeight:600,color:'#856404',marginBottom:1}}>身長アップに！カルシウム補給</p>
                      <p style={{fontSize:10,color:'#888'}}>成長期サプリをチェック →</p>
                    </div>
                  </a>
                </div>
              )}

              {tab==='nutrition' && (
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {/* 必要栄養素 */}
                  <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                    <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:12}}>{result.grade}の1日の必要量</p>
                    {[
                      {label:'エネルギー',val:result.nutrition.energy,unit:'kcal',color:'#e63946',icon:'⚡'},
                      {label:'タンパク質',val:result.nutrition.protein,unit:'g',color:'#457b9d',icon:'💪'},
                      {label:'カルシウム',val:result.nutrition.calcium,unit:'mg',color:'#2d6a4f',icon:'🦴'},
                      {label:'鉄分',val:result.nutrition.iron,unit:'mg',color:'#854F0B',icon:'🩸'},
                    ].map(item=>(
                      <div key={item.label} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #f8f8f6'}}>
                        <span style={{fontSize:16,width:24}}>{item.icon}</span>
                        <span style={{fontSize:12,flex:1}}>{item.label}</span>
                        <span style={{fontSize:14,fontWeight:700,color:item.color}}>{item.val}<span style={{fontSize:10,fontWeight:400,color:'#999'}}>{item.unit}</span></span>
                      </div>
                    ))}
                  </div>

                  {/* 体格別食事プラン */}
                  <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                    <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:10}}>
                      {result.status==='under'?'体重アップ':result.status==='over'?'体重管理':'理想体格維持'}の食事プラン
                    </p>
                    {[
                      {time:'朝食',icon:'🌅',meals:{under:'ご飯2杯＋卵焼き2個＋牛乳200ml＋バナナ1本',normal:'ご飯1.5杯＋納豆＋卵＋味噌汁',over:'ご飯1杯＋卵＋野菜たっぷり味噌汁'}},
                      {time:'練習前',icon:'⚽',meals:{under:'おにぎり2個＋スポーツドリンク',normal:'おにぎり1個＋スポーツドリンク',over:'バナナ1本＋水'}},
                      {time:'練習中',icon:'💧',meals:{under:'スポーツドリンク500ml以上',normal:'スポーツドリンク300〜500ml',over:'水またはアクエリアス薄め'}},
                      {time:'練習直後',icon:'⚡',meals:{under:'プロテイン＋おにぎり2個',normal:'アミノ酸＋おにぎり1個',over:'プロテイン（糖質少なめ）'}},
                      {time:'夕食',icon:'🍽️',meals:{under:'鶏もも肉150g＋ご飯2杯＋野菜炒め',normal:'魚or肉100g＋ご飯1.5杯＋サラダ',over:'野菜中心＋鶏胸肉＋ご飯少なめ'}},
                      {time:'間食',icon:'🍫',meals:{under:'チョコ＋ナッツ＋カルシウムグミ',normal:'カルシウムグミ＋果物',over:'ヨーグルト＋果物（菓子類控える）'}},
                    ].map(item=>(
                      <div key={item.time} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #f8f8f6'}}>
                        <span style={{fontSize:16,width:24,flexShrink:0}}>{item.icon}</span>
                        <div>
                          <p style={{fontSize:10,color:'#999',marginBottom:2}}>{item.time}</p>
                          <p style={{fontSize:11,color:'#444',lineHeight:1.5}}>{item.meals[result.status as keyof typeof item.meals]}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* サプリリンク */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    <a href={SUPPLEMENT_LINKS.protein.amazon} target="_blank" rel="noopener noreferrer sponsored"
                      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'12px',background:'#fff3cd',borderRadius:10,border:'1px solid #ffc107',textDecoration:'none'}}>
                      <span style={{fontSize:20}}>📦</span>
                      <p style={{fontSize:10,fontWeight:600,color:'#856404',textAlign:'center'}}>Amazonで<br/>プロテイン検索</p>
                    </a>
                    <a href={SUPPLEMENT_LINKS.calcium.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'12px',background:'#fff0f0',borderRadius:10,border:'1px solid #ffb3b3',textDecoration:'none'}}>
                      <span style={{fontSize:20}}>🛒</span>
                      <p style={{fontSize:10,fontWeight:600,color:'#cc0000',textAlign:'center'}}>楽天で<br/>カルシウムサプリ</p>
                    </a>
                  </div>
                  <a href="/nutrition" style={{display:'block',padding:'12px',borderRadius:10,background:'#f0f0ec',textAlign:'center',fontSize:12,color:'#666',textDecoration:'none'}}>
                    栄養・補助食品ランキングを見る →
                  </a>
                </div>
              )}

              {tab==='position' && (
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div style={{background:'white',borderRadius:12,border:'1px solid #eeeeea',padding:'14px'}}>
                    <p style={{fontSize:10,color:'#999',letterSpacing:'0.1em',marginBottom:12}}>体格から見たポジション適性</p>
                    {POSITION_IDEAL.junior.map(p=>{
                      const isGK = p.pos==='GK' && result.hDiff > 3
                      const isCB = p.pos==='CB' && result.hDiff > 0
                      const isFW = p.pos==='FW' && result.status==='normal'
                      const match = isGK||isCB||isFW
                      return (
                        <div key={p.pos} style={{display:'flex',gap:12,padding:'10px',borderRadius:8,marginBottom:6,background:match?'#f0f7f0':'#f8f8f6',border:match?'1px solid #c8e6c9':'1px solid transparent'}}>
                          <div style={{width:36,height:36,borderRadius:8,background:match?'#2d6a4f':'#e0e0e0',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:12,fontWeight:700,flexShrink:0}}>{p.pos}</div>
                          <div style={{flex:1}}>
                            <p style={{fontSize:12,fontWeight:match?700:400,color:match?'#2d6a4f':'#444',marginBottom:2}}>{p.pos}{match?' ← あなたに向いている！':''}</p>
                            <p style={{fontSize:10,color:'#888',marginBottom:1}}>身長: {p.height} / 体重: {p.weight}</p>
                            <p style={{fontSize:10,color:'#999'}}>{p.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
