'use client'
import { useState } from 'react'
import Link from 'next/link'

const NEW_RULES = [
  { year:'2025', category:'競技規則', title:'ハンドの反則明確化', detail:'意図的なハンドに加え、腕を不自然に広げた状態でボールが当たった場合も反則。ただし体の自然な位置にある腕への接触は反則とならない。', impact:'high', tag:'守備' },
  { year:'2025', category:'競技規則', title:'GKのペナルティキック時の規則', detail:'PK時にGKは少なくとも片足をゴールライン上またはライン内に置いていなければならない。違反した場合はPKの再実行。', impact:'high', tag:'GK' },
  { year:'2025', category:'競技規則', title:'フリーキックの壁から1m', detail:'フリーキック時、守備側選手は壁を作る場合、ボールから最低1m離れなければならない。攻撃側も壁に入ることを制限。', impact:'medium', tag:'FK' },
  { year:'2024', category:'競技規則', title:'コンカッション（脳震盪）代替交代', detail:'脳震盪の疑いがある選手は追加交代枠を使わずに交代可能。交代した選手は試合に復帰できない。', impact:'high', tag:'安全' },
  { year:'2024', category:'競技規則', title:'スローインの改正', detail:'スローインを行う選手が1秒以上ボールを保持しなかった場合、相手チームのスローインとなる。', impact:'low', tag:'スローイン' },
  { year:'2024', category:'競技規則', title:'VAR（ビデオ判定）の拡大', detail:'Jリーグ・国内大会でVARの使用範囲が拡大。得点・PK・退場・誤認に関するシーンで使用される。', impact:'medium', tag:'判定' },
  { year:'2024', category:'JFA規則', title:'ジュニアユース8人制廃止', detail:'U-12は引き続き8人制。U-13以上は原則11人制に統一。ただし地域リーグによって異なる場合がある。', impact:'high', tag:'ジュニア' },
  { year:'2023', category:'競技規則', title:'オフサイドの自動判定（セミオートマチック）', detail:'カメラとAIを使ったオフサイドの自動判定システムが導入。より正確で迅速な判定が可能に。', impact:'medium', tag:'オフサイド' },
  { year:'2023', category:'競技規則', title:'選手交代時の退場ルール', detail:'交代で退場する選手は最も近いタッチライン・ゴールラインから退場しなければならない。時間稼ぎ防止のため。', impact:'low', tag:'交代' },
]

const TERMS: {category:string, emoji:string, items:{word:string, reading:string, desc:string, example?:string}[]}[] = [
  { category:'基本用語', emoji:'⚽', items:[
    {word:'オフサイド',reading:'おふさいど',desc:'攻撃側選手がパスを受ける瞬間、相手ゴール側から2番目の守備側選手より前にいた場合の反則。',example:'スルーパスを受けようとしたFWが飛び出しすぎてオフサイドに'},
    {word:'ハンドボール',reading:'はんどぼーる',desc:'手や腕にボールが当たる反則。意図的な場合や腕を不自然に広げた場合が対象。',example:'クロスボールが上げた腕に当たってハンド判定'},
    {word:'フリーキック',reading:'ふりーきっく',desc:'反則を受けたチームが蹴るキック。直接FKと間接FKがある。',example:'ペナルティエリア外でのファウルでFKを獲得'},
    {word:'コーナーキック',reading:'こーなーきっく',desc:'守備側がボールをゴールラインの外に出した場合、攻撃側がコーナーから蹴るキック。'},
    {word:'ペナルティキック',reading:'ぺなるてぃきっく',desc:'ペナルティエリア内での反則で与えられるゴールとGKの1対1の特別なキック。'},
  ]},
  { category:'ポジション', emoji:'👟', items:[
    {word:'センターバック（CB）',reading:'せんたーばっく',desc:'守備の中心を担うポジション。DFラインの中央に位置し、相手FWをマーク。',example:'高さと強さが求められる。日本代表では吉田麻也がCBの代表格'},
    {word:'サイドバック（SB）',reading:'さいどばっく',desc:'DF両サイドのポジション。守備だけでなく攻撃参加も重要な役割。',example:'右SBが上がってクロスを上げる'},
    {word:'ボランチ',reading:'ぼらんち',desc:'中盤の守備的な位置に置くポジション。ポルトガル語でハンドル（舵）の意味。',example:'遠藤航がボランチとしてリバプールで活躍'},
    {word:'トップ下（シャドー）',reading:'とっぷした',desc:'FWの後ろ、MFの前に位置する攻撃的なポジション。創造性とゴール感覚が求められる。',example:'久保建英はトップ下やシャドーとして活躍'},
    {word:'ウイング',reading:'うぃんぐ',desc:'攻撃的なサイドのポジション。ドリブル突破やクロスが主な役割。',example:'三笘薫は左ウイングとしてプレミアリーグで活躍'},
  ]},
  { category:'戦術用語', emoji:'🗺️', items:[
    {word:'プレッシング',reading:'ぷれっしんぐ',desc:'高い位置から積極的にボールを奪いに行く守備戦術。ハイプレスとも呼ぶ。',example:'前線からのプレッシングでボールを奪いカウンター'},
    {word:'ポゼッション',reading:'ぽぜっしょん',desc:'ボールを保持し続けること。高いポゼッションは試合のコントロールにつながる。',example:'バルセロナは高いポゼッション率で試合を支配'},
    {word:'カウンター',reading:'かうんたー',desc:'守備から素早く攻撃に転じる戦術。少ない人数で素早く相手ゴールを目指す。',example:'ボールを奪った瞬間に素早いカウンターで得点'},
    {word:'ゾーンディフェンス',reading:'ぞーんでぃふぇんす',desc:'選手が担当エリアを守る守備システム。マンツーマンと対比される。',example:'4-4-2のゾーンで中盤を閉じてスペースを消す'},
    {word:'オーバーラップ',reading:'おーばーらっぷ',desc:'後方の選手が前の選手を追い越して攻撃参加すること。',example:'右SBがウイングを追い越してクロス'},
    {word:'ワンツー（壁パス）',reading:'わんつー',desc:'2人の選手がパスを交換して突破する技術。相手のマークを外すのに有効。',example:'狭いスペースでワンツーを使ってDF突破'},
  ]},
  { category:'審判用語', emoji:'🟨', items:[
    {word:'イエローカード',reading:'いえろーかーど',desc:'警告。同一試合で2枚受けると退場になる。',example:'激しいタックルでイエローカードを受ける'},
    {word:'レッドカード',reading:'れっどかーど',desc:'退場処分。直接レッドまたはイエロー2枚で退場。次の試合も出場停止。'},
    {word:'アドバンテージ',reading:'あどばんてーじ',desc:'反則があっても、攻撃側に有利な状況が続く場合に反則を取らない判断。',example:'反則を受けてもボールキープできたのでアドバンテージ'},
    {word:'インジュリータイム',reading:'いんじゅりーたいむ',desc:'試合中の負傷・交代等で失われた時間を補う追加時間。アディショナルタイムとも。'},
    {word:'VAR',reading:'ぶいえーあーる',desc:'ビデオ・アシスタント・レフェリー。映像で判定を確認・修正するシステム。'},
  ]},
  { category:'技術用語', emoji:'🦶', items:[
    {word:'インステップキック',reading:'いんすてっぷきっく',desc:'足の甲（インステップ）で蹴るキック。シュートやロングパスに使用。強くて正確なキックが可能。'},
    {word:'インサイドキック',reading:'いんさいどきっく',desc:'足の内側で蹴るキック。精度が高くショートパスに最適。サッカーの基本キック。'},
    {word:'トラップ',reading:'とらっぷ',desc:'飛んできたボールを体の各部位で止める技術。足・胸・ももなどを使う。'},
    {word:'ドリブル',reading:'どりぶる',desc:'ボールを保持しながら走る技術。相手をかわすスキルが重要。'},
    {word:'ヒールキック',reading:'ひーるきっく',desc:'かかとでボールを蹴る技術。予測しにくいパスやシュートに使われる。'},
  ]},
]

export default function RulesPage() {
  const [tab, setTab] = useState<'rules'|'terms'|'ai'>('rules')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRule, setSelectedRule] = useState<any>(null)
  const [selectedTerm, setSelectedTerm] = useState<any>(null)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const filteredRules = NEW_RULES.filter(r =>
    (selectedCategory === 'all' || r.tag === selectedCategory) &&
    (search === '' || r.title.includes(search) || r.detail.includes(search))
  )

  const allTerms = TERMS.flatMap(c => c.items.map(t => ({...t, category: c.category, emoji: c.emoji})))
  const filteredTerms = allTerms.filter(t =>
    search === '' || t.word.includes(search) || t.reading.includes(search) || t.desc.includes(search)
  )

  const askAI = async () => {
    if (!aiQuestion.trim()) return
    setAiLoading(true)
    setAiAnswer('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          messages: [{ role: 'user', content: `サッカーのルールや用語について、ジュニア選手や保護者にわかりやすく200文字程度で説明してください。\n\n質問：${aiQuestion}` }]
        })
      })
      const data = await res.json()
      setAiAnswer(data.content?.[0]?.text || '回答を取得できませんでした')
    } catch {
      setAiAnswer('エラーが発生しました。もう一度お試しください。')
    }
    setAiLoading(false)
  }

  const impactColor = { high:'#e63946', medium:'#854F0B', low:'#2d6a4f' }
  const impactLabel = { high:'重要', medium:'注意', low:'参考' }
  const ruleTags = ['all','守備','GK','FK','安全','ジュニア','オフサイド','交代','スローイン','判定']

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        {/* ヒーロー */}
        <div style={{position:'relative',height:160,overflow:'hidden'}}>
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
            alt="サッカー審判" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(10,10,10,0.92))'}}>
            <div style={{position:'absolute',bottom:14,left:16,right:16}}>
              <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none',display:'block',marginBottom:4}}>← 戻る</Link>
              <h1 style={{color:'white',fontSize:20,fontWeight:300,marginBottom:2}}>新ルール＆用語検索</h1>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:10}}>最新ルール変更・サッカー用語辞典・AIに質問</p>
            </div>
          </div>
        </div>

        {/* タブ */}
        <div style={{display:'flex',background:'white',borderBottom:'1px solid #eeeeea'}}>
          {([['rules','新ルール'],['terms','用語辞典'],['ai','AIに質問']] as const).map(([key,label])=>(
            <button key={key} onClick={()=>{setTab(key);setSearch('')}}
              style={{flex:1,padding:'11px 4px',fontSize:11,border:'none',background:'transparent',cursor:'pointer',
                borderBottom:`2px solid ${tab===key?'#1a1a1a':'transparent'}`,
                color:tab===key?'#1a1a1a':'#999'}}>
              {label}
            </button>
          ))}
        </div>

        {/* 検索バー */}
        {tab !== 'ai' && (
          <div style={{padding:'10px 16px 0',background:'white',borderBottom:'1px solid #eeeeea'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={tab==='rules'?'ルールを検索...':'用語を検索...'}
              style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e8e8e4',fontSize:13,outline:'none',background:'#f8f8f6',marginBottom:10}}/>
          </div>
        )}

        <div style={{padding:16}}>

          {/* 新ルールタブ */}
          {tab==='rules' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {/* タグフィルター */}
              <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4}}>
                {ruleTags.map(tag=>(
                  <button key={tag} onClick={()=>setSelectedCategory(tag)}
                    style={{padding:'5px 12px',borderRadius:16,border:'none',cursor:'pointer',whiteSpace:'nowrap',fontSize:10,flexShrink:0,
                      background:selectedCategory===tag?'#1a1a1a':'#f0f0ec',
                      color:selectedCategory===tag?'white':'#666',fontWeight:selectedCategory===tag?600:400}}>
                    {tag==='all'?'すべて':tag}
                  </button>
                ))}
              </div>

              {filteredRules.map((rule,i)=>(
                <div key={i}>
                  <button onClick={()=>setSelectedRule(selectedRule?.title===rule.title?null:rule)}
                    style={{width:'100%',background:'white',borderRadius:12,border:`1px solid ${selectedRule?.title===rule.title?'#1a1a1a':'#eeeeea'}`,
                      padding:'12px 14px',textAlign:'left',cursor:'pointer'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'#f0f0ec',color:'#888'}}>{rule.year}年</span>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,
                          background:impactColor[rule.impact as keyof typeof impactColor]+'18',
                          color:impactColor[rule.impact as keyof typeof impactColor],fontWeight:600}}>
                          {impactLabel[rule.impact as keyof typeof impactLabel]}
                        </span>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'#E6F1FB',color:'#185FA5'}}>{rule.tag}</span>
                      </div>
                      <span style={{fontSize:12,color:'#999'}}>{selectedRule?.title===rule.title?'▲':'▼'}</span>
                    </div>
                    <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a'}}>{rule.title}</p>
                  </button>
                  {selectedRule?.title===rule.title && (
                    <div style={{background:'#f8f8f6',borderRadius:'0 0 12px 12px',padding:'12px 14px',border:'1px solid #eeeeea',borderTop:'none',marginTop:-4}}>
                      <p style={{fontSize:12,color:'#444',lineHeight:1.8}}>{rule.detail}</p>
                    </div>
                  )}
                </div>
              ))}
              {filteredRules.length === 0 && (
                <div style={{textAlign:'center',padding:'40px 20px',color:'#bbb'}}>
                  <p style={{fontSize:14}}>該当するルールが見つかりません</p>
                </div>
              )}
            </div>
          )}

          {/* 用語辞典タブ */}
          {tab==='terms' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {/* カテゴリフィルター */}
              <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4}}>
                {[{key:'all',label:'すべて'},...TERMS.map(c=>({key:c.category,label:c.emoji+' '+c.category}))].map(c=>(
                  <button key={c.key} onClick={()=>setSelectedCategory(c.key)}
                    style={{padding:'5px 12px',borderRadius:16,border:'none',cursor:'pointer',whiteSpace:'nowrap',fontSize:10,flexShrink:0,
                      background:selectedCategory===c.key?'#1a1a1a':'#f0f0ec',
                      color:selectedCategory===c.key?'white':'#666'}}>
                    {c.label}
                  </button>
                ))}
              </div>

              {(search || selectedCategory !== 'all' ?
                filteredTerms.filter(t => selectedCategory==='all' || t.category===selectedCategory) :
                TERMS.flatMap(c => selectedCategory==='all' ? c.items.map(t=>({...t,category:c.category,emoji:c.emoji})) : [])
              ).map((term:any,i:number)=>(
                <div key={i}>
                  <button onClick={()=>setSelectedTerm(selectedTerm?.word===term.word?null:term)}
                    style={{width:'100%',background:'white',borderRadius:12,
                      border:`1px solid ${selectedTerm?.word===term.word?'#1a1a1a':'#eeeeea'}`,
                      padding:'12px 14px',textAlign:'left',cursor:'pointer'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div>
                        <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a',marginBottom:2}}>{term.word}</p>
                        <p style={{fontSize:10,color:'#999'}}>{term.reading}</p>
                      </div>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'#f0f0ec',color:'#666'}}>{term.category}</span>
                        <span style={{fontSize:12,color:'#999'}}>{selectedTerm?.word===term.word?'▲':'▼'}</span>
                      </div>
                    </div>
                  </button>
                  {selectedTerm?.word===term.word && (
                    <div style={{background:'#f8f8f6',borderRadius:'0 0 12px 12px',padding:'12px 14px',border:'1px solid #eeeeea',borderTop:'none',marginTop:-4}}>
                      <p style={{fontSize:12,color:'#444',lineHeight:1.8,marginBottom:term.example?8:0}}>{term.desc}</p>
                      {term.example && (
                        <div style={{background:'#E6F1FB',borderRadius:8,padding:'8px 10px'}}>
                          <p style={{fontSize:9,color:'#185FA5',marginBottom:3}}>使用例</p>
                          <p style={{fontSize:11,color:'#185FA5'}}>{term.example}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AIに質問タブ */}
          {tab==='ai' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{background:'#0a0a0a',borderRadius:12,padding:'14px'}}>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.6)',lineHeight:1.7}}>
                  わからないルールや用語をAIに質問できます。ジュニア選手・保護者向けにわかりやすく説明します。
                </p>
              </div>

              {/* クイック質問 */}
              <div>
                <p style={{fontSize:10,color:'#999',marginBottom:8}}>よくある質問</p>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {['オフサイドのルールを教えて','ハンドはどんな時に取られるの？','VAR（ビデオ判定）って何？','U-12の8人制と11人制の違いは？','イエローカード2枚で退場になる理由は？'].map(q=>(
                    <button key={q} onClick={()=>setAiQuestion(q)}
                      style={{padding:'10px 12px',borderRadius:10,border:'1px solid #eeeeea',background:'white',
                        textAlign:'left',fontSize:11,cursor:'pointer',color:'#444'}}>
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* 質問入力 */}
              <div>
                <textarea value={aiQuestion} onChange={e=>setAiQuestion(e.target.value)}
                  placeholder="ルールや用語について質問してください..."
                  style={{width:'100%',padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',fontSize:12,
                    outline:'none',resize:'none',height:80,background:'white'}}/>
                <button onClick={askAI} disabled={!aiQuestion.trim()||aiLoading}
                  style={{width:'100%',padding:'12px',borderRadius:10,border:'none',marginTop:8,
                    background:aiQuestion.trim()&&!aiLoading?'#1a1a1a':'#e8e8e4',
                    color:aiQuestion.trim()&&!aiLoading?'white':'#bbb',fontSize:13,fontWeight:500,cursor:'pointer'}}>
                  {aiLoading?'🤖 AIが考え中...':'✨ AIに質問する'}
                </button>
              </div>

              {/* AI回答 */}
              {aiAnswer && (
                <div style={{background:'#0a0a0a',borderRadius:12,padding:'14px'}}>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
                    <span style={{fontSize:16}}>🤖</span>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>AIコーチの回答</p>
                  </div>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.8)',lineHeight:1.8}}>{aiAnswer}</p>
                  <button onClick={()=>{setAiAnswer('');setAiQuestion('')}}
                    style={{marginTop:10,padding:'6px 14px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',
                      background:'transparent',fontSize:11,color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>
                    別の質問をする
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
