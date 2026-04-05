'use client'
import { useState } from 'react'
import Link from 'next/link'

const RULE_IMAGES: Record<string, string> = {
  'ハンドの反則明確化': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80',
  'GKのペナルティキック時の規則': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
  'フリーキックの壁から1m': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
  'コンカッション（脳震盪）代替交代': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  'VAR（ビデオ判定）の拡大': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80',
  'ジュニアユース8人制廃止': 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
  'オフサイドの自動判定（セミオートマチック）': 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf9?w=600&q=80',
}

const TERM_IMAGES: Record<string, string> = {
  '基本用語': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
  'ポジション': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80',
  '戦術用語': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
  '審判用語': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80',
  '技術用語': 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80',
}

const POSITION_IMAGES: Record<string, string> = {
  'GK': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
  'CB': 'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=400&q=80',
  'SB': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80',
  'MF': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
  'FW': 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80',
}


const RANKINGS = {
  unknown_rules: {
    title: '知らなかった！ルールランキング',
    emoji: '😲',
    color: '#e63946',
    bg: '#FCEBEB',
    items: [
      { rank:1, title:'GKはPK時に動いてはいけない', desc:'GKはPKが蹴られるまで、少なくとも片足をゴールライン上に置いていなければならない。知らずに動くと蹴り直しに！', image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80', votes:892 },
      { rank:2, title:'スローインで両足が地面に着いていないといけない', desc:'スローインの際、投げる選手はタッチライン上か外側に立ち、両足が地面についていないと反則。片足が浮いていたらやり直し。', image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&q=80', votes:743 },
      { rank:3, title:'ゴールキックはペナルティエリア内ならどこでも置ける', desc:'2019年のルール改正から、ゴールキックはペナルティエリア内ならどこにでも置いていい。昔はゴールエリア内のみだった。', image:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&q=80', votes:621 },
      { rank:4, title:'オフサイドは「触れた瞬間」が基準', desc:'オフサイドの判定は、ボールが出た瞬間（パスを蹴った瞬間）の位置で判定する。受け取った瞬間ではない！', image:'https://images.unsplash.com/photo-1551280857-2b9bbe52acf9?w=500&q=80', votes:534 },
      { rank:5, title:'試合中に靴が脱げても反則にならない', desc:'靴が脱げても試合は続行。ただしその状態でプレーを続けることは危険なので、審判の許可を得て直すのがマナー。', image:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=500&q=80', votes:412 },
    ]
  },
  confusing_terms: {
    title: '間違えやすい用語ランキング',
    emoji: '🤔',
    color: '#854F0B',
    bg: '#FAEEDA',
    items: [
      { rank:1, title:'ボランチ vs アンカー', desc:'どちらも守備的MFだが、ボランチは2人で組む場合に使う（ポルトガル語）。アンカーは1人で最後尾に置く役割。日本ではどちらもボランチと呼ぶことが多い。', image:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80', votes:678 },
      { rank:2, title:'直接FK vs 間接FK', desc:'直接FKはそのままシュートしてゴールになる。間接FKは他の選手に触れてからでないとゴールにならない。笛の合図が違う（間接=腕を上げる）。', image:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80', votes:589 },
      { rank:3, title:'トラップ vs コントロール', desc:'どちらもボールを受け止める技術。トラップはボールを止めることに重点。コントロールは次のプレーにつなげるために最適な位置にボールを置くこと。', image:'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=500&q=80', votes:445 },
      { rank:4, title:'センターバック vs ストッパー', desc:'センターバックは守備の中央全般を指す。ストッパーは相手FWに対して厳しくマークにつく役割の選手を特に指す。日本では混用されることも多い。', image:'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80', votes:367 },
      { rank:5, title:'シュート vs ヘディング', desc:'一般的にシュートは足で蹴ること。ヘディングは頭で打つこと。ただし「ヘディングシュート」という言い方もある。厳密には打ち方の違いで使い分ける。', image:'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80', votes:298 },
    ]
  },
  junior_fouls: {
    title: 'ジュニアがよく犯すファウルランキング',
    emoji: '⚠️',
    color: '#2d6a4f',
    bg: '#E1F5EE',
    items: [
      { rank:1, title:'スライディングタックル', desc:'後ろや横からのスライディングは危険なプレーとして取られやすい。特にジュニアでは厳しく取られることが多い。足を伸ばしてボールより先に相手に当たるとファウル。', image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&q=80', votes:934 },
      { rank:2, title:'プッシング（手で押す）', desc:'相手を手で押すのは反則。でもジュニアは思わず手が出てしまうことが多い。体でのチャージは許されるが、手を使うとファウル。', image:'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=500&q=80', votes:812 },
      { rank:3, title:'シャツを引っ張る', desc:'相手のユニフォームを掴んで引っ張るのは明確なファウル。走っている相手を引っ張る行為は危険でもあり、イエローカードになることも。', image:'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80', votes:698 },
      { rank:4, title:'オーバーザトップ（足を上げすぎ)', desc:'相手の足の上を越えるような高いタックルは危険プレーとして退場になることも。特に足を高く上げながらのチャレンジは要注意。', image:'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80', votes:567 },
      { rank:5, title:'意図的なハンド', desc:'ボールが来るとつい手が出てしまうジュニアが多い。ゴール前でのハンドはPKになるので、手を体につけておく習慣が大切。', image:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&q=80', votes:423 },
    ]
  },
  parent_questions: {
    title: '保護者が疑問に思うルールランキング',
    emoji: '👨‍👩‍👦',
    color: '#185FA5',
    bg: '#E6F1FB',
    items: [
      { rank:1, title:'なぜオフサイドになったのかわからない', desc:'オフサイドは「パスが蹴られた瞬間」の位置が基準。受け取った時ではない。守備側から2番目の選手より前にいるとオフサイドポジションとなる。', image:'https://images.unsplash.com/photo-1551280857-2b9bbe52acf9?w=500&q=80', votes:1243 },
      { rank:2, title:'なぜあのシュートがゴールじゃないのか', desc:'ゴールラインをボール全体が完全に越えていないとゴールにならない。またゴール前のファウルや反則があれば得点は認められない。', image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80', votes:987 },
      { rank:3, title:'ハンドとそうでない場合の違いは何か', desc:'意図的に手を使った場合や腕を不自然に広げた場合はハンド。ただし体の自然な位置にある腕への接触は反則にならない場合がある。', image:'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80', votes:876 },
      { rank:4, title:'なぜアディショナルタイムがあんなに増えるのか', desc:'VAR確認・交代・負傷・ゴール後の混乱などで試合が止まった時間を追加する。近年は厳密に計測されるため以前より長くなりがち。', image:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80', votes:734 },
      { rank:5, title:'同じようなプレーなのにファウルになったりならなかったりする', desc:'審判の判断は「意図性・危険性・有利不利」を総合的に判断する。状況や試合展開によっても異なり、完全に統一することは難しい。', image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&q=80', votes:623 },
    ]
  }
}

const NEW_RULES = [
  { year:'2025', category:'競技規則', title:'ハンドの反則明確化',
    detail:'意図的なハンドに加え、腕を不自然に広げた状態でボールが当たった場合も反則。ただし体の自然な位置にある腕への接触は反則とならない。',
    impact:'high', tag:'守備',
    point:'守備選手は腕の位置に常に注意が必要。自然な位置を保つことが重要。' },
  { year:'2025', category:'競技規則', title:'GKのペナルティキック時の規則',
    detail:'PK時にGKは少なくとも片足をゴールライン上またはライン内に置いていなければならない。違反した場合はPKの再実行。',
    impact:'high', tag:'GK',
    point:'GKはPK前にラインを確認する習慣をつけよう。' },
  { year:'2025', category:'競技規則', title:'フリーキックの壁から1m',
    detail:'フリーキック時、守備側選手は壁を作る場合、ボールから最低1m離れなければならない。攻撃側も壁に入ることを制限。',
    impact:'medium', tag:'FK',
    point:'壁の距離はしっかり守ること。近づきすぎると警告の対象になる。' },
  { year:'2024', category:'競技規則', title:'コンカッション（脳震盪）代替交代',
    detail:'脳震盪の疑いがある選手は追加交代枠を使わずに交代可能。交代した選手は試合に復帰できない。',
    impact:'high', tag:'安全',
    point:'頭部への衝撃があった場合は無理せず申告することが重要。' },
  { year:'2024', category:'競技規則', title:'VAR（ビデオ判定）の拡大',
    detail:'Jリーグ・国内大会でVARの使用範囲が拡大。得点・PK・退場・誤認に関するシーンで使用される。',
    impact:'medium', tag:'判定',
    point:'VARにより明らかな誤審は修正される。ゴール後も落ち着いて待つことが大事。' },
  { year:'2024', category:'JFA規則', title:'ジュニアユース8人制廃止',
    detail:'U-12は引き続き8人制。U-13以上は原則11人制に統一。ただし地域リーグによって異なる場合がある。',
    impact:'high', tag:'ジュニア',
    point:'U-13からは11人制に対応できるよう準備が必要。ポジション理解が重要になる。' },
  { year:'2023', category:'競技規則', title:'オフサイドの自動判定（セミオートマチック）',
    detail:'カメラとAIを使ったオフサイドの自動判定システムが導入。より正確で迅速な判定が可能に。',
    impact:'medium', tag:'オフサイド',
    point:'オフサイドトラップを使う際は相手のラインの動きに注意が必要になった。' },
  { year:'2023', category:'競技規則', title:'選手交代時の退場ルール',
    detail:'交代で退場する選手は最も近いタッチライン・ゴールラインから退場しなければならない。時間稼ぎ防止のため。',
    impact:'low', tag:'交代',
    point:'交代時にわざと遠い出口に向かうと警告の対象になる場合がある。' },
]

const TERMS: {category:string, emoji:string, items:{word:string, reading:string, desc:string, example?:string, image?:string}[]}[] = [
  { category:'基本用語', emoji:'⚽', items:[
    {word:'オフサイド',reading:'おふさいど',
      image:'https://images.unsplash.com/photo-1551280857-2b9bbe52acf9?w=500&q=80',
      desc:'攻撃側選手がパスを受ける瞬間、相手ゴール側から2番目の守備側選手より前にいた場合の反則。',
      example:'スルーパスを受けようとしたFWが飛び出しすぎてオフサイドに'},
    {word:'ハンドボール',reading:'はんどぼーる',
      image:'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80',
      desc:'手や腕にボールが当たる反則。意図的な場合や腕を不自然に広げた場合が対象。',
      example:'クロスボールが上げた腕に当たってハンド判定'},
    {word:'フリーキック',reading:'ふりーきっく',
      image:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80',
      desc:'反則を受けたチームが蹴るキック。直接FKと間接FKがある。',
      example:'ペナルティエリア外でのファウルでFKを獲得'},
    {word:'ペナルティキック',reading:'ぺなるてぃきっく',
      image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80',
      desc:'ペナルティエリア内での反則で与えられるゴールとGKの1対1の特別なキック。'},
  ]},
  { category:'ポジション', emoji:'👟', items:[
    {word:'センターバック（CB）',reading:'せんたーばっく',
      image:'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=500&q=80',
      desc:'守備の中心を担うポジション。DFラインの中央に位置し、相手FWをマーク。',
      example:'高さと強さが求められる。日本代表では板倉滉がCBの代表格'},
    {word:'ボランチ',reading:'ぼらんち',
      image:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80',
      desc:'中盤の守備的な位置に置くポジション。ポルトガル語でハンドル（舵）の意味。',
      example:'遠藤航がボランチとしてリバプールで活躍'},
    {word:'ウイング',reading:'うぃんぐ',
      image:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=500&q=80',
      desc:'攻撃的なサイドのポジション。ドリブル突破やクロスが主な役割。',
      example:'三笘薫は左ウイングとしてプレミアリーグで活躍'},
    {word:'トップ下（シャドー）',reading:'とっぷした',
      image:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&q=80',
      desc:'FWの後ろ、MFの前に位置する攻撃的なポジション。創造性とゴール感覚が求められる。',
      example:'久保建英はトップ下やシャドーとして活躍'},
  ]},
  { category:'戦術用語', emoji:'🗺️', items:[
    {word:'プレッシング',reading:'ぷれっしんぐ',
      image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&q=80',
      desc:'高い位置から積極的にボールを奪いに行く守備戦術。ハイプレスとも呼ぶ。',
      example:'前線からのプレッシングでボールを奪いカウンター'},
    {word:'カウンター',reading:'かうんたー',
      image:'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80',
      desc:'守備から素早く攻撃に転じる戦術。少ない人数で素早く相手ゴールを目指す。',
      example:'ボールを奪った瞬間に素早いカウンターで得点'},
    {word:'オーバーラップ',reading:'おーばーらっぷ',
      image:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80',
      desc:'後方の選手が前の選手を追い越して攻撃参加すること。',
      example:'右SBがウイングを追い越してクロス'},
    {word:'ワンツー（壁パス）',reading:'わんつー',
      image:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&q=80',
      desc:'2人の選手がパスを交換して突破する技術。相手のマークを外すのに有効。',
      example:'狭いスペースでワンツーを使ってDF突破'},
  ]},
  { category:'審判用語', emoji:'🟨', items:[
    {word:'イエローカード',reading:'いえろーかーど',
      image:'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80',
      desc:'警告。同一試合で2枚受けると退場になる。',
      example:'激しいタックルでイエローカードを受ける'},
    {word:'アドバンテージ',reading:'あどばんてーじ',
      image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80',
      desc:'反則があっても、攻撃側に有利な状況が続く場合に反則を取らない判断。',
      example:'反則を受けてもボールキープできたのでアドバンテージ'},
    {word:'VAR',reading:'ぶいえーあーる',
      image:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80',
      desc:'ビデオ・アシスタント・レフェリー。映像で判定を確認・修正するシステム。'},
  ]},
  { category:'技術用語', emoji:'🦶', items:[
    {word:'インステップキック',reading:'いんすてっぷきっく',
      image:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=500&q=80',
      desc:'足の甲（インステップ）で蹴るキック。シュートやロングパスに使用。強くて正確なキックが可能。'},
    {word:'トラップ',reading:'とらっぷ',
      image:'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=500&q=80',
      desc:'飛んできたボールを体の各部位で止める技術。足・胸・ももなどを使う。'},
    {word:'ドリブル',reading:'どりぶる',
      image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&q=80',
      desc:'ボールを保持しながら走る技術。相手をかわすスキルが重要。'},
  ]},
]

export default function RulesPage() {
  const [tab, setTab] = useState<'rules'|'terms'|'ai'|'ranking'>('rules')
  const [selectedRanking, setSelectedRanking] = useState('unknown_rules')
  const [expandedItem, setExpandedItem] = useState<number|null>(null)
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
  const filteredTerms = search !== '' || selectedCategory !== 'all'
    ? allTerms.filter(t =>
        (selectedCategory === 'all' || t.category === selectedCategory) &&
        (search === '' || t.word.includes(search) || t.reading.includes(search) || t.desc.includes(search))
      )
    : allTerms

  const askAI = async () => {
    if (!aiQuestion.trim()) return
    setAiLoading(true)
    setAiAnswer('')
    try {
      const res = await fetch('/api/rules-ai', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ question: aiQuestion })
      })
      const data = await res.json()
      setAiAnswer(data.answer || '回答を取得できませんでした')
    } catch {
      setAiAnswer('エラーが発生しました。もう一度お試しください。')
    }
    setAiLoading(false)
  }

  const impactColor = { high:'#e63946', medium:'#854F0B', low:'#2d6a4f' }
  const impactLabel = { high:'重要', medium:'注意', low:'参考' }
  const ruleTags = ['all','守備','GK','FK','安全','ジュニア','オフサイド','交代','判定']

  return (
    <main style={{minHeight:'100vh',background:'#f8f8f6',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        {/* ヒーロー */}
        <div style={{position:'relative',height:180,overflow:'hidden'}}>
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
            alt="サッカー審判" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(10,10,10,0.95))'}}>
            <div style={{position:'absolute',bottom:14,left:16,right:16}}>
              <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none',display:'block',marginBottom:4}}>← 戻る</Link>
              <h1 style={{color:'white',fontSize:20,fontWeight:300,marginBottom:2}}>新ルール＆用語検索</h1>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:10}}>最新ルール変更・サッカー用語辞典・AIに質問</p>
            </div>
          </div>
        </div>

        {/* タブ */}
        <div style={{display:'flex',background:'white',borderBottom:'1px solid #eeeeea'}}>
          {([['rules','📋 新ルール'],['terms','📖 用語辞典'],['ranking','🏆 ランキング'],['ai','🤖 AIに質問']] as const).map(([key,label])=>(
            <button key={key} onClick={()=>{setTab(key);setSearch('');setSelectedCategory('all')}}
              style={{flex:1,padding:'11px 4px',fontSize:10,border:'none',background:'transparent',cursor:'pointer',
                borderBottom:`2px solid ${tab===key?'#1a1a1a':'transparent'}`,
                color:tab===key?'#1a1a1a':'#999',fontWeight:tab===key?600:400}}>
              {label}
            </button>
          ))}
        </div>

        {/* 検索バー */}
        {tab !== 'ai' && (
          <div style={{padding:'10px 16px 8px',background:'white',borderBottom:'1px solid #f0f0ec'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={tab==='rules'?'🔍 ルールを検索...':'🔍 用語を検索...'}
              style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e8e8e4',
                fontSize:13,outline:'none',background:'#f8f8f6'}}/>
          </div>
        )}

        <div style={{padding:16}}>

          {/* 新ルールタブ */}
          {tab==='rules' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:6}}>
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
                <div key={i} style={{borderRadius:12,overflow:'hidden',border:'1px solid #eeeeea',background:'white'}}>
                  {/* ルール画像 */}
                  {RULE_IMAGES[rule.title] && (
                    <div style={{position:'relative',height:120,overflow:'hidden'}}>
                      <img src={RULE_IMAGES[rule.title]} alt={rule.title}
                        style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.7) 100%)'}}/>
                      <div style={{position:'absolute',bottom:8,left:12,right:12,display:'flex',gap:6}}>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'rgba(255,255,255,0.2)',color:'white'}}>{rule.year}年</span>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,
                          background:impactColor[rule.impact as keyof typeof impactColor],color:'white',fontWeight:600}}>
                          {impactLabel[rule.impact as keyof typeof impactLabel]}
                        </span>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'rgba(255,255,255,0.2)',color:'white'}}>{rule.tag}</span>
                      </div>
                    </div>
                  )}
                  <button onClick={()=>setSelectedRule(selectedRule?.title===rule.title?null:rule)}
                    style={{width:'100%',background:'transparent',border:'none',padding:'12px 14px',textAlign:'left',cursor:'pointer'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <p style={{fontSize:13,fontWeight:600,color:'#1a1a1a'}}>{rule.title}</p>
                      <span style={{fontSize:12,color:'#999'}}>{selectedRule?.title===rule.title?'▲':'▼'}</span>
                    </div>
                    <p style={{fontSize:10,color:'#888',marginTop:4,lineHeight:1.5}}>{rule.point}</p>
                  </button>
                  {selectedRule?.title===rule.title && (
                    <div style={{padding:'0 14px 14px',borderTop:'1px solid #f0f0ec'}}>
                      <p style={{fontSize:12,color:'#444',lineHeight:1.8,paddingTop:10}}>{rule.detail}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 用語辞典タブ */}
          {tab==='terms' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:6}}>
                {[{key:'all',label:'すべて'},...TERMS.map(c=>({key:c.category,label:c.emoji+' '+c.category}))].map(c=>(
                  <button key={c.key} onClick={()=>setSelectedCategory(c.key)}
                    style={{padding:'5px 12px',borderRadius:16,border:'none',cursor:'pointer',whiteSpace:'nowrap',fontSize:10,flexShrink:0,
                      background:selectedCategory===c.key?'#1a1a1a':'#f0f0ec',
                      color:selectedCategory===c.key?'white':'#666'}}>
                    {c.label}
                  </button>
                ))}
              </div>

              {filteredTerms.map((term:any,i:number)=>(
                <div key={i} style={{borderRadius:12,overflow:'hidden',border:`1px solid ${selectedTerm?.word===term.word?'#1a1a1a':'#eeeeea'}`,background:'white'}}>
                  {/* 用語画像 */}
                  {term.image && (
                    <div style={{position:'relative',height:100,overflow:'hidden'}}>
                      <img src={term.image} alt={term.word}
                        style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(0,0,0,0.6) 0%,transparent 60%)'}}/>
                      <div style={{position:'absolute',top:'50%',left:12,transform:'translateY(-50%)'}}>
                        <p style={{fontSize:15,fontWeight:700,color:'white',marginBottom:2,textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>{term.word}</p>
                        <p style={{fontSize:10,color:'rgba(255,255,255,0.7)'}}>{term.reading}</p>
                      </div>
                      <div style={{position:'absolute',top:8,right:8}}>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'rgba(0,0,0,0.5)',color:'white'}}>{term.category}</span>
                      </div>
                    </div>
                  )}
                  <button onClick={()=>setSelectedTerm(selectedTerm?.word===term.word?null:term)}
                    style={{width:'100%',background:'transparent',border:'none',padding:'10px 14px',textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    {!term.image && (
                      <div>
                        <p style={{fontSize:13,fontWeight:500,color:'#1a1a1a'}}>{term.word}</p>
                        <p style={{fontSize:10,color:'#999'}}>{term.reading}</p>
                      </div>
                    )}
                    {term.image && <p style={{fontSize:11,color:'#666',lineHeight:1.5,flex:1}}>{term.desc.slice(0,40)}...</p>}
                    <span style={{fontSize:12,color:'#999',flexShrink:0,marginLeft:8}}>{selectedTerm?.word===term.word?'▲':'▼'}</span>
                  </button>
                  {selectedTerm?.word===term.word && (
                    <div style={{padding:'0 14px 14px',borderTop:'1px solid #f0f0ec'}}>
                      <p style={{fontSize:12,color:'#444',lineHeight:1.8,paddingTop:10,marginBottom:term.example?8:0}}>{term.desc}</p>
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

          {/* ランキングタブ */}
          {tab==='ranking' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {/* ランキング選択 */}
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {Object.entries(RANKINGS).map(([key, r]:any)=>(
                  <button key={key} onClick={()=>{setSelectedRanking(key);setExpandedItem(null)}}
                    style={{padding:'12px 14px',borderRadius:12,border:`2px solid ${selectedRanking===key?r.color:'#eeeeea'}`,
                      background:selectedRanking===key?r.bg:'white',textAlign:'left',cursor:'pointer',
                      display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:22}}>{r.emoji}</span>
                    <div>
                      <p style={{fontSize:12,fontWeight:selectedRanking===key?700:400,
                        color:selectedRanking===key?r.color:'#1a1a1a'}}>{r.title}</p>
                      <p style={{fontSize:9,color:'#999',marginTop:2}}>TOP5</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* 選択されたランキング */}
              {selectedRanking && (RANKINGS as any)[selectedRanking] && (
                <div>
                  <p style={{fontSize:11,color:'#999',marginBottom:10}}>
                    {(RANKINGS as any)[selectedRanking].emoji} {(RANKINGS as any)[selectedRanking].title}
                  </p>
                  {(RANKINGS as any)[selectedRanking].items.map((item:any,i:number)=>(
                    <div key={i} style={{borderRadius:12,overflow:'hidden',border:'1px solid #eeeeea',background:'white',marginBottom:10}}>
                      {/* 画像 */}
                      <div style={{position:'relative',height:130,overflow:'hidden'}}>
                        <img src={item.image} alt={item.title}
                          style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.8) 100%)'}}/>
                        {/* ランク */}
                        <div style={{position:'absolute',top:10,left:10,
                          width:36,height:36,borderRadius:'50%',
                          background:i===0?'#c9a84c':i===1?'#8e8e8e':i===2?'#8b6343':'rgba(0,0,0,0.6)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:14,fontWeight:700,color:'white'}}>
                          {item.rank}
                        </div>
                        {/* 投票数 */}
                        <div style={{position:'absolute',top:10,right:10,
                          background:'rgba(0,0,0,0.6)',borderRadius:8,padding:'3px 8px'}}>
                          <p style={{fontSize:9,color:'rgba(255,255,255,0.8)'}}>👍 {item.votes.toLocaleString()}</p>
                        </div>
                        <div style={{position:'absolute',bottom:10,left:12,right:12}}>
                          <p style={{fontSize:13,fontWeight:700,color:'white',textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>{item.title}</p>
                        </div>
                      </div>
                      {/* 詳細 */}
                      <button onClick={()=>setExpandedItem(expandedItem===i?null:i)}
                        style={{width:'100%',background:'transparent',border:'none',padding:'10px 14px',
                          textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <p style={{fontSize:11,color:'#666',lineHeight:1.5,flex:1}}>{item.desc.slice(0,50)}...</p>
                        <span style={{fontSize:11,color:'#999',flexShrink:0,marginLeft:8}}>{expandedItem===i?'▲':'▼'}</span>
                      </button>
                      {expandedItem===i && (
                        <div style={{padding:'0 14px 14px',borderTop:'1px solid #f0f0ec'}}>
                          <p style={{fontSize:12,color:'#444',lineHeight:1.8,paddingTop:10}}>{item.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AIに質問タブ */}
          {tab==='ai' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{position:'relative',height:140,borderRadius:12,overflow:'hidden'}}>
                <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
                  alt="AI" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.65)',display:'flex',alignItems:'center',padding:'16px'}}>
                  <div>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:9,letterSpacing:'0.15em',marginBottom:4}}>AI COACH</p>
                    <p style={{color:'white',fontSize:14,fontWeight:500,marginBottom:4}}>ルール・用語をAIに質問</p>
                    <p style={{color:'rgba(255,255,255,0.6)',fontSize:10,lineHeight:1.6}}>わからないことを何でも聞いてみよう。ジュニア向けにやさしく説明します。</p>
                  </div>
                </div>
              </div>

              <div>
                <p style={{fontSize:10,color:'#999',marginBottom:8}}>💡 よくある質問</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                  {['オフサイドって何？','ハンドはどんな時？','VARって何？','8人制と11人制の違いは？','イエロー2枚で退場なの？','ボランチってどんな役割？'].map(q=>(
                    <button key={q} onClick={()=>setAiQuestion(q)}
                      style={{padding:'10px 8px',borderRadius:10,border:'1px solid #eeeeea',background:'white',
                        textAlign:'left',fontSize:10,cursor:'pointer',color:'#444',lineHeight:1.4}}>
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea value={aiQuestion} onChange={e=>setAiQuestion(e.target.value)}
                  placeholder="ルールや用語について質問してください..."
                  style={{width:'100%',padding:'12px',borderRadius:10,border:'1px solid #e8e8e4',
                    fontSize:12,outline:'none',resize:'none',height:80}}/>
                <button onClick={askAI} disabled={!aiQuestion.trim()||aiLoading}
                  style={{width:'100%',padding:'12px',borderRadius:10,border:'none',marginTop:8,
                    background:aiQuestion.trim()&&!aiLoading?'#1a1a1a':'#e8e8e4',
                    color:aiQuestion.trim()&&!aiLoading?'white':'#bbb',
                    fontSize:13,fontWeight:500,cursor:'pointer'}}>
                  {aiLoading?'🤖 AIが考え中...':'✨ AIに質問する'}
                </button>
              </div>

              {aiAnswer && (
                <div style={{background:'#0a0a0a',borderRadius:12,padding:'16px'}}>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
                    <div style={{width:32,height:32,borderRadius:'50%',background:'#FFD700',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🤖</div>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>AIコーチの回答</p>
                  </div>
                  <p style={{fontSize:13,color:'rgba(255,255,255,0.85)',lineHeight:1.9}}>{aiAnswer}</p>
                  <button onClick={()=>{setAiAnswer('');setAiQuestion('')}}
                    style={{marginTop:12,padding:'7px 16px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',
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
