'use client'
import { useState } from 'react'
import Link from 'next/link'

const POSITIONS: any[] = [{"id": "gk", "name": "GK", "fullName": "ゴールキーパー", "emoji": "🧤", "color": "#FFD700", "bg": "#0a0a2e", "heroImage": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", "images": ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"], "role": "チームの最後の砦。ゴールを守りながらチームの守備を統率する司令塔。", "skills": ["セービング", "ポジショニング", "コーチング", "フィード（配球）", "1対1の対応"], "bodyHeight": "平均+5cm以上が有利", "bodyWeight": "がっしり型", "bodyPersonality": "リーダーシップ・冷静沈着・声が大きい", "training": [{"name": "反射神経トレーニング", "desc": "近距離から素早くボールを投げてもらい、瞬時に反応して止める練習。", "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80"}, {"name": "ポジショニング練習", "desc": "角度を変えたシュートに対して最適なポジションに素早く移動する練習。", "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80"}, {"name": "フィード練習", "desc": "両足でのキック・スローで正確にチームメイトに配球する練習。", "image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80"}], "players": [{"name": "権田修一", "team": "FC東京", "emoji": "🇯🇵", "desc": "日本代表正GK。セービングと安定したプレーが持ち味。"}, {"name": "エミリアーノ・マルティネス", "team": "アストン・ヴィラ", "emoji": "🇦🇷", "desc": "W杯優勝GK。心理戦とビッグセーブが武器。"}, {"name": "マヌエル・ノイアー", "team": "バイエルン", "emoji": "🇩🇪", "desc": "スウィーパーGKの革命者。足元の技術も世界最高レベル。"}], "selection": "反応速度・声出し・1対1の対応が審査ポイント。身長も重視される。", "gear": [{"name": "GKグローブ", "desc": "必須アイテム。ジュニア用は指保護機能付きがおすすめ", "amazon": "https://www.amazon.co.jp/s?k=GK%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%96%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2FGK%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%96%2F"}, {"name": "GKパンツ", "desc": "膝・腰のパッド付き。ダイビング時の怪我防止に必須", "amazon": "https://www.amazon.co.jp/s?k=GK%E3%83%91%E3%83%B3%E3%83%84%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2FGK%E3%83%91%E3%83%B3%E3%83%84%2F"}]}, {"id": "cb", "name": "CB", "fullName": "センターバック", "emoji": "🛡️", "color": "#e63946", "bg": "#1a0a0a", "heroImage": "https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=800&q=80", "images": ["https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=600&q=80", "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80", "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80"], "role": "守備ラインの中心。空中戦・1対1の強さで相手FWを封じる守備の要。", "skills": ["ヘディング", "1対1の守備", "ラインコントロール", "ビルドアップ", "カバーリング"], "bodyHeight": "平均以上が有利", "bodyWeight": "がっしり型", "bodyPersonality": "闘志・集中力・コミュニケーション能力", "training": [{"name": "ヘディング練習", "desc": "クロスボールへのヘディング。高さ・タイミング・方向の3つを意識。", "image": "https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=400&q=80"}, {"name": "1対1守備練習", "desc": "相手FWとの1対1。間合いの取り方と体の入れ方を習得。", "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80"}, {"name": "ビルドアップ練習", "desc": "GKからのボールを受けてMFにつなぐパス出し練習。", "image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80"}], "players": [{"name": "板倉滉", "team": "ボルシアMG", "emoji": "🇯🇵", "desc": "日本代表CB。高さ・強さ・技術を兼ね備えた現代型CB。"}, {"name": "冨安健洋", "team": "アーセナル", "emoji": "🇯🇵", "desc": "プレミアリーグで活躍。CB・SBどちらもこなせるユーティリティ性。"}, {"name": "ヴィルヒル・ファン・ダイク", "team": "リバプール", "emoji": "🇳🇱", "desc": "世界最高のCB。圧倒的な高さと読みの深さが武器。"}], "selection": "空中戦の強さ・1対1の守備・コーチング（声出し）が審査ポイント。", "gear": [{"name": "スネ当て（大型）", "desc": "CBは激しい競り合いが多いので大型のスネ当てを選ぼう", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%B9%E3%83%8D%E5%BD%93%E3%81%A6%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E5%A4%A7%E5%9E%8B&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B9%E3%83%8D%E5%BD%93%E3%81%A6%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F"}, {"name": "ヘディング練習ボール", "desc": "ヘディングの反復練習に。自宅でも練習できる", "amazon": "https://www.amazon.co.jp/s?k=%E3%83%98%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E7%B7%B4%E7%BF%92%E3%83%9C%E3%83%BC%E3%83%AB&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%98%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E7%B7%B4%E7%BF%92%2F"}]}, {"id": "sb", "name": "SB", "fullName": "サイドバック", "emoji": "⚡", "color": "#457b9d", "bg": "#0a1020", "heroImage": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80", "images": ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80", "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80"], "role": "守備と攻撃を両立する現代サッカーの重要ポジション。サイドを縦横無尽に走る。", "skills": ["オーバーラップ", "クロス", "1対1守備", "スタミナ", "スピード"], "bodyHeight": "平均程度", "bodyWeight": "スリム〜標準", "bodyPersonality": "積極性・スタミナ・判断力", "training": [{"name": "クロス練習", "desc": "走りながらの精度の高いクロス。インステップ・インサイドどちらも習得。", "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80"}, {"name": "オーバーラップ練習", "desc": "ウイングとのコンビネーションで相手を突破するタイミングを習得。", "image": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80"}, {"name": "スタミナトレーニング", "desc": "90分間サイドを走り続けるための有酸素運動。インターバル走が効果的。", "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80"}], "players": [{"name": "菅原由勢", "team": "サウサンプトン", "emoji": "🇯🇵", "desc": "日本代表右SB。攻撃参加とクロス精度が武器。"}, {"name": "伊藤洋輝", "team": "バイエルン", "emoji": "🇯🇵", "desc": "左SBとCBをこなすユーティリティ。高いビルドアップ能力。"}, {"name": "トレント・アレクサンダー＝アーノルド", "team": "リバプール", "emoji": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "desc": "世界最高の右SB。クロス・スルーパスで革命的なSBスタイル。"}], "selection": "攻撃参加の積極性・クロス精度・守備の対応力が審査ポイント。", "gear": [{"name": "スパイク（軽量）", "desc": "SBにはスピードを活かせる軽量スパイクがおすすめ", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E8%BB%BD%E9%87%8F%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E8%BB%BD%E9%87%8F%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F"}]}, {"id": "mf", "name": "MF", "fullName": "ミッドフィルダー", "emoji": "🎯", "color": "#2d6a4f", "bg": "#0a1a10", "heroImage": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80", "images": ["https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80", "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80"], "role": "攻守をつなぐチームの心臓部。ゲームメイクから守備まで幅広い役割をこなす。", "skills": ["パス精度", "視野の広さ", "ボールコントロール", "守備意識", "運動量"], "bodyHeight": "平均程度", "bodyWeight": "標準", "bodyPersonality": "知性・判断力・技術・運動量", "training": [{"name": "パスコース確認練習", "desc": "常に複数のパスコースを確認しながらボールを受け取る習慣をつける。", "image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80"}, {"name": "視野拡大トレーニング", "desc": "首を振る習慣。ボールを受ける前に周囲の状況を確認する練習。", "image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80"}, {"name": "プレッシング練習", "desc": "ボールを失った瞬間に素早く奪い返しに行く切り替えの速さを習得。", "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80"}], "players": [{"name": "久保建英", "team": "レアル・ソシエダ", "emoji": "🇯🇵", "desc": "日本最高のMF。創造性とドリブル突破で世界のトップリーグで活躍。"}, {"name": "遠藤航", "team": "リバプール", "emoji": "🇯🇵", "desc": "プレミアのボランチ。守備の強さとパスセンスでリバプールの中心に。"}, {"name": "ルカ・モドリッチ", "team": "レアル・マドリード", "emoji": "🇭🇷", "desc": "バロンドール受賞の世界最高のMF。38歳でもトップレベルを維持。"}], "selection": "パスの精度・視野の広さ・ゲームを読む力が審査ポイント。", "gear": [{"name": "トレーニングボール（4号）", "desc": "MFはボールを触る時間が長い。自主練用のボールを持とう", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%AB%204%E5%8F%B7%20%E7%B7%B4%E7%BF%92&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%AB4%E5%8F%B7%2F"}, {"name": "マーカーコーン", "desc": "パス練習・ドリブル練習のコースづくりに必須", "amazon": "https://www.amazon.co.jp/s?k=%E3%83%9E%E3%83%BC%E3%82%AB%E3%83%BC%E3%82%B3%E3%83%BC%E3%83%B3%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9E%E3%83%BC%E3%82%AB%E3%83%BC%E3%82%B3%E3%83%BC%E3%83%B3%2F"}]}, {"id": "fw", "name": "FW", "fullName": "フォワード", "emoji": "🔥", "color": "#FF6B35", "bg": "#1a0505", "heroImage": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80", "images": ["https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80", "https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=600&q=80", "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80"], "role": "得点を奪うチームの花形ポジション。スピード・技術・決定力でゴールを量産。", "skills": ["シュート精度", "ドリブル", "スピード", "オフザボールの動き", "ヘディング"], "bodyHeight": "平均〜やや低め（ウイング）/ 高め（CF）", "bodyWeight": "スリム〜標準", "bodyPersonality": "積極性・ゴールへの嗅覚・メンタルの強さ", "training": [{"name": "シュート練習", "desc": "様々な角度・距離からのシュート。利き足・逆足両方練習することが重要。", "image": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80"}, {"name": "1対1ドリブル練習", "desc": "相手DFとの1対1を想定。切り返し・スピードの変化で抜く技術を習得。", "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80"}, {"name": "オフザボール練習", "desc": "ボールがない時の動き方。スペースへの走り込みとタイミングを習得。", "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80"}], "players": [{"name": "三笘薫", "team": "ブライトン", "emoji": "🇯🇵", "desc": "プレミアの左ウイング。圧倒的なドリブルと左足のクロスが武器。"}, {"name": "上田綺世", "team": "フェイエノールト", "emoji": "🇯🇵", "desc": "欧州リーグで活躍するCF。高さと決定力でゴールを量産。"}, {"name": "キリアン・エムバペ", "team": "レアル・マドリード", "emoji": "🇫🇷", "desc": "世界最速FW。爆発的なスピードと両足のシュートで得点を量産。"}], "selection": "シュートの正確さ・スピード・積極的な仕掛けが審査ポイント。", "gear": [{"name": "スパイク（コントロール系）", "desc": "FWはボールタッチを重視。柔らかい素材のスパイクがおすすめ", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%20%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F"}, {"name": "リバウンドネット", "desc": "1人でシュート練習ができる。壁当て不要で自主練に最適", "amazon": "https://www.amazon.co.jp/s?k=%E3%83%AA%E3%83%90%E3%82%A6%E3%83%B3%E3%83%89%E3%83%8D%E3%83%83%E3%83%88%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%AA%E3%83%90%E3%82%A6%E3%83%B3%E3%83%89%E3%83%8D%E3%83%83%E3%83%88%2F"}]}]

export default function PositionPage() {
  const [selectedPos, setSelectedPos] = useState('gk')
  const [tab, setTab] = useState<'overview'|'training'|'players'|'gear'|'coaching'|'season'>('overview')
  const pos = POSITIONS.find((p:any) => p.id === selectedPos)!

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>

        <div style={{position:'relative',height:220,overflow:'hidden'}}>
          <img src={pos.heroImage} alt={pos.fullName}
            style={{width:'100%',height:'100%',objectFit:'cover',transition:'all 0.5s'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(10,10,10,0.95))'}}>
            <div style={{position:'absolute',top:14,left:16}}>
              <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none'}}>← 戻る</Link>
            </div>
            <div style={{position:'absolute',bottom:16,left:16,right:16}}>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:10,letterSpacing:'0.15em',marginBottom:4}}>POSITION GUIDE</p>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                <span style={{fontSize:28}}>{pos.emoji}</span>
                <div>
                  <h1 style={{color:'white',fontSize:24,fontWeight:700,marginBottom:0}}>{pos.name}</h1>
                  <p style={{color:pos.color,fontSize:12,fontWeight:500}}>{pos.fullName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:0,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          {POSITIONS.map((p:any)=>(
            <button key={p.id} onClick={()=>{setSelectedPos(p.id);setTab('overview')}}
              style={{flex:1,padding:'10px 4px',border:'none',background:'transparent',cursor:'pointer',
                borderBottom:`2px solid ${selectedPos===p.id?p.color:'transparent'}`,
                fontSize:11,fontWeight:selectedPos===p.id?700:400,
                color:selectedPos===p.id?p.color:'rgba(255,255,255,0.3)'}}>
              {p.emoji}<br/>{p.name}
            </button>
          ))}
        </div>

        <div style={{display:'flex',background:'#111',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          {(['overview','training','players','gear','coaching','season'] as const).map((key)=>{
            const labels = {overview:'概要',training:'練習',players:'選手',gear:'用具',coaching:'指導者',season:'季節'}
            return (
              <button key={key} onClick={()=>setTab(key)}
                style={{flex:1,padding:'10px 4px',fontSize:10,border:'none',background:'transparent',cursor:'pointer',
                  borderBottom:`2px solid ${tab===key?pos.color:'transparent'}`,
                  color:tab===key?pos.color:'rgba(255,255,255,0.35)',fontWeight:tab===key?600:400}}>
                {labels[key]}
              </button>
            )
          })}
        </div>

        <div style={{padding:16}}>

          {tab==='overview' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {pos.images.slice(0,2).map((img:string,i:number)=>(
                  <div key={i} style={{height:100,borderRadius:10,overflow:'hidden'}}>
                    <img src={img} alt={pos.fullName} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                ))}
              </div>
              <div style={{background:'#111',borderRadius:12,padding:'14px',border:`1px solid ${pos.color}30`}}>
                <p style={{fontSize:10,color:pos.color,letterSpacing:'0.1em',marginBottom:8}}>ROLE</p>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.85)',lineHeight:1.8}}>{pos.role}</p>
              </div>
              <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>必要スキル</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {pos.skills.map((s:string,i:number)=>(
                    <span key={i} style={{fontSize:11,padding:'4px 12px',borderRadius:10,
                      background:`${pos.color}20`,color:pos.color,border:`1px solid ${pos.color}40`,fontWeight:500}}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{background:'#111',borderRadius:12,padding:'14px'}}>
                <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',marginBottom:10}}>向いている体格・性格</p>
                {[['身長',pos.bodyHeight],['体重',pos.bodyWeight],['性格',pos.bodyPersonality]].map(([label,val]:any)=>(
                  <div key={label} style={{display:'flex',gap:10,padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize:10,color:'rgba(255,255,255,0.4)',width:40,flexShrink:0}}>{label}</span>
                    <span style={{fontSize:11,color:'rgba(255,255,255,0.8)',lineHeight:1.5}}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{background:`${pos.color}15`,borderRadius:12,padding:'14px',border:`1px solid ${pos.color}30`}}>
                <p style={{fontSize:10,color:pos.color,letterSpacing:'0.1em',marginBottom:8}}>🎯 セレクションのポイント</p>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.8)',lineHeight:1.7}}>{pos.selection}</p>
              </div>
              <div style={{height:160,borderRadius:12,overflow:'hidden'}}>
                <img src={pos.images[2]} alt={pos.fullName} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </div>
            </div>
          )}

          {tab==='training' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:4}}>
                {pos.fullName}に必要なスキルを磨くためのトレーニングメニューです。
              </p>
              {pos.training.map((t:any,i:number)=>(
                <div key={i} style={{borderRadius:12,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{height:140,overflow:'hidden',position:'relative'}}>
                    <img src={t.image} alt={t.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.8) 100%)'}}>
                      <div style={{position:'absolute',bottom:10,left:12}}>
                        <span style={{fontSize:9,padding:'2px 8px',borderRadius:6,background:pos.color,color:'white',fontWeight:600}}>
                          TRAINING {i+1}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{background:'#111',padding:'12px 14px'}}>
                    <p style={{fontSize:13,fontWeight:700,color:'white',marginBottom:6}}>{t.name}</p>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.6)',lineHeight:1.7}}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==='players' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:4}}>
                目標にしたい{pos.fullName}の選手たちです。プレースタイルを研究しましょう。
              </p>
              {pos.players.map((player:any,i:number)=>(
                <div key={i} style={{background:'#111',borderRadius:12,padding:'14px',
                  border:`1px solid ${pos.color}20`,display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{width:48,height:48,borderRadius:'50%',
                    background:`${pos.color}20`,border:`2px solid ${pos.color}50`,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>
                    {player.emoji}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
                      <p style={{fontSize:14,fontWeight:700,color:'white'}}>{player.name}</p>
                      {i===0 && <span style={{fontSize:9,padding:'2px 8px',borderRadius:6,background:pos.color,color:'white',fontWeight:600}}>目標選手</span>}
                    </div>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:4}}>{player.team}</p>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.65)',lineHeight:1.6}}>{player.desc}</p>
                  </div>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {pos.images.map((img:string,i:number)=>(
                  <div key={i} style={{height:100,borderRadius:10,overflow:'hidden'}}>
                    <img src={img} alt={pos.fullName} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='coaching' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{position:'relative',height:160,borderRadius:12,overflow:'hidden'}}>
                <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&q=80"
                  alt="指導者" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent,rgba(0,0,0,0.85))'}}>
                  <div style={{position:'absolute',bottom:12,left:14}}>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:9,letterSpacing:'0.15em',marginBottom:2}}>COACHING METHOD</p>
                    <p style={{color:'white',fontSize:14,fontWeight:700}}>指導者向け最新練習方法</p>
                  </div>
                </div>
              </div>

              {[
                {
                  title:'ポジショナルプレー（PP）',
                  level:'上級',color:'#e63946',
                  image:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
                  desc:'スペースを意識した5レーン理論に基づく配置トレーニング。選手それぞれが最適なポジションを取ることでチーム全体の攻撃を向上させる。',
                  points:['5レーンを意識した配置確認','受け手と出し手の連動','縦パス・斜めパスの優先順位'],
                  menu:'4対4+フリーマン（20分）→ 8対8ポゼッション（20分）→ 11対11実践（30分）',
                },
                {
                  title:'プレッシングの組織的な実装',
                  level:'中級',color:'#457b9d',
                  image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
                  desc:'チーム全体で連動した守備プレッシングを組織化する最新手法。前線からの守備で相手ボールを高い位置で奪うことを目指す。',
                  points:['プレスのトリガー（きっかけ）を設定','チャンネルの閉め方','プレスが外された後のリセット'],
                  menu:'シャドートレーニング（15分）→ 4対4プレッシング（20分）→ 実践形式（30分）',
                },
                {
                  title:'個人戦術：デュエルトレーニング',
                  level:'基礎',color:'#2d6a4f',
                  image:'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=600&q=80',
                  desc:'1対1の局面を強化する個人戦術トレーニング。攻撃と守備の両局面での対人能力を高め、試合での自信につなげる。',
                  points:['攻撃：仕掛けるタイミングと方向','守備：間合いの取り方と体の向き','両局面でのメンタリティ強化'],
                  menu:'1対1攻守（15分）→ 2対1数的優位（20分）→ 3対3制限付き（20分）',
                },
                {
                  title:'ゲームモデルの構築',
                  level:'指導者必見',color:'#854F0B',
                  image:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80',
                  desc:'チームの目指すサッカースタイルを明確にし、全練習に一貫性を持たせる現代的な指導法。選手が自分で考えて動けるようになる。',
                  points:['攻撃・守備・切り替えの原則設定','年代別ゲームモデルの作り方','保護者・選手への共有方法'],
                  menu:'原則確認ミーティング（10分）→ 原則を意識した練習（40分）→ 振り返り（10分）',
                },
              ].map((m,i)=>(
                <div key={i} style={{borderRadius:12,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{position:'relative',height:130,overflow:'hidden'}}>
                    <img src={m.image} alt={m.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.85) 100%)'}}>
                      <div style={{position:'absolute',top:10,left:10}}>
                        <span style={{fontSize:9,padding:'2px 8px',borderRadius:6,background:m.color,color:'white',fontWeight:600}}>{m.level}</span>
                      </div>
                      <div style={{position:'absolute',bottom:10,left:12,right:12}}>
                        <p style={{fontSize:13,fontWeight:700,color:'white',textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>{m.title}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{background:'#111',padding:'12px 14px'}}>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.65)',lineHeight:1.7,marginBottom:10}}>{m.desc}</p>
                    <div style={{marginBottom:10}}>
                      <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginBottom:6,letterSpacing:'0.1em'}}>指導ポイント</p>
                      {m.points.map((pt,j)=>(
                        <div key={j} style={{display:'flex',gap:6,marginBottom:4}}>
                          <span style={{color:m.color,fontSize:11,flexShrink:0}}>✓</span>
                          <p style={{fontSize:11,color:'rgba(255,255,255,0.7)',lineHeight:1.5}}>{pt}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 10px'}}>
                      <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginBottom:3}}>練習メニュー例</p>
                      <p style={{fontSize:10,color:'rgba(255,255,255,0.6)',lineHeight:1.6}}>{m.menu}</p>
                    </div>
                  </div>
                </div>
              ))}

              <a href={`https://www.amazon.co.jp/s?k=サッカー指導者+練習本&tag=haircolorab22-22`}
                target="_blank" rel="noopener noreferrer sponsored"
                style={{display:'flex',alignItems:'center',gap:10,padding:'12px',background:'rgba(255,153,0,0.15)',
                  borderRadius:10,border:'1px solid rgba(255,153,0,0.3)',textDecoration:'none'}}>
                <span style={{fontSize:20}}>📚</span>
                <p style={{fontSize:11,fontWeight:600,color:'#ff9900'}}>指導者向けサッカー書籍をAmazonで検索 →</p>
              </a>
            </div>
          )}

          {tab==='season' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{position:'relative',height:160,borderRadius:12,overflow:'hidden'}}>
                <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80"
                  alt="季節別アイテム" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent,rgba(0,0,0,0.85))'}}>
                  <div style={{position:'absolute',bottom:12,left:14}}>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:9,letterSpacing:'0.15em',marginBottom:2}}>SEASONAL ITEMS</p>
                    <p style={{color:'white',fontSize:14,fontWeight:700}}>春夏秋冬の必須アイテム</p>
                  </div>
                </div>
              </div>

              {[
                {
                  season:'🌸 春（3〜5月）',color:'#e91e8c',bg:'rgba(233,30,140,0.1)',
                  image:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
                  desc:'新シーズン開幕。体力強化と新しいチームへの適応期間。気温差が激しいので体調管理が重要。',
                  items:[
                    {name:'ウインドブレーカー',reason:'朝晩の冷え込み対策。脱ぎ着しやすいものが◎',
                      amazon:'https://www.amazon.co.jp/s?k=サッカー+ウインドブレーカー+ジュニア&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A6%E3%82%A4%E3%83%B3%E3%83%89%E3%83%96%E3%83%AC%E3%83%BC%E3%82%AB%E3%83%BC%2F'},
                    {name:'新スパイク',reason:'新シーズンに向けてスパイクを新調。足型診断を活用しよう',
                      amazon:'https://www.amazon.co.jp/s?k=サッカースパイク+ジュニア+新作&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F'},
                    {name:'花粉対策マスク',reason:'花粉症選手は練習前後のケアが重要。運動用マスクを選ぼう',
                      amazon:'https://www.amazon.co.jp/s?k=スポーツマスク+花粉対策&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E3%83%9E%E3%82%B9%E3%82%AF%2F'},
                  ],
                },
                {
                  season:'☀️ 夏（6〜8月）',color:'#FF6B35',bg:'rgba(255,107,53,0.1)',
                  image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
                  desc:'熱中症対策が最重要。水分・塩分補給を欠かさず、無理のない練習計画が必要。紫外線対策も忘れずに。',
                  items:[
                    {name:'スポーツドリンク（まとめ買い）',reason:'練習前・中・後の水分補給。薄めて使うのがコツ',
                      amazon:'https://www.amazon.co.jp/s?k=アクエリアス+まとめ買い&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%A2%E3%82%B9%2F'},
                    {name:'冷却スプレー・アイスパック',reason:'体を素早く冷やす。ハーフタイムや練習後に活用',
                      amazon:'https://www.amazon.co.jp/s?k=冷却スプレー スポーツ&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E5%86%B7%E5%8D%B4%E3%82%B9%E3%83%97%E3%83%AC%E3%83%BC%2F'},
                    {name:'日焼け止め（SPF50+）',reason:'長時間の屋外練習では必須。スポーツ用の落ちにくいものを',
                      amazon:'https://www.amazon.co.jp/s?k=日焼け止め SPF50 スポーツ 子供&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E6%97%A5%E7%84%BC%E3%81%91%E6%AD%A2%E3%82%81%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%2F'},
                    {name:'塩分タブレット',reason:'発汗による塩分不足を補う。熱中症予防に効果的',
                      amazon:'https://www.amazon.co.jp/s?k=塩分タブレット スポーツ&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E5%A1%A9%E5%88%86%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88%2F'},
                  ],
                },
                {
                  season:'🍂 秋（9〜11月）',color:'#c9a84c',bg:'rgba(201,168,76,0.1)',
                  image:'https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=600&q=80',
                  desc:'練習・試合に最適な季節。大会シーズンでもある秋はコンディション管理が勝負を左右する。',
                  items:[
                    {name:'アンダーシャツ（長袖）',reason:'朝晩の冷えに対応。汗をかいても体を冷やさない素材を選ぼう',
                      amazon:'https://www.amazon.co.jp/s?k=サッカー アンダーシャツ 長袖 ジュニア&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%B3%E3%83%80%E3%83%BC%E3%82%B7%E3%83%A3%E3%83%84%E9%95%B7%E8%A2%96%2F'},
                    {name:'栄養ドリンク・サプリ',reason:'大会シーズンに向けたコンディション強化。疲労回復を重視',
                      amazon:'https://www.amazon.co.jp/s?k=アミノバイタル 疲労回復&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%9F%E3%83%8E%E3%83%90%E3%82%A4%E3%82%BF%E3%83%AB%2F'},
                    {name:'テーピングテープ',reason:'試合前の足首・膝のサポート。怪我予防に活用しよう',
                      amazon:'https://www.amazon.co.jp/s?k=テーピングテープ スポーツ&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%86%E3%83%BC%E3%83%94%E3%83%B3%E3%82%B0%E3%83%86%E3%83%BC%E3%83%97%2F'},
                  ],
                },
                {
                  season:'❄️ 冬（12〜2月）',color:'#457b9d',bg:'rgba(69,123,157,0.1)',
                  image:'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80',
                  desc:'寒さ対策と筋肉・関節の怪我予防が最重要。十分なウォームアップと防寒対策でベストパフォーマンスを維持。',
                  items:[
                    {name:'インナーグローブ・ニット帽',reason:'末端の冷えが集中力を低下させる。防寒グッズで体温を保持',
                      amazon:'https://www.amazon.co.jp/s?k=サッカー インナーグローブ ジュニア&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%96%2F'},
                    {name:'フリースジャケット・防寒インナー',reason:'練習前後の防寒に。試合観戦の保護者にも必須アイテム',
                      amazon:'https://www.amazon.co.jp/s?k=スポーツ フリース ジュニア&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E3%83%95%E3%83%AA%E3%83%BC%E3%82%B9%2F'},
                    {name:'ホッカイロ（貼るタイプ）',reason:'試合待機中の体温維持に。腰・お腹に貼るタイプが効果的',
                      amazon:'https://www.amazon.co.jp/s?k=貼るカイロ まとめ買い&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E8%B2%BC%E3%82%8B%E3%82%AB%E3%82%A4%E3%83%AD%2F'},
                    {name:'ホットドリンク用水筒',reason:'温かい飲み物でハーフタイムに体を温める。保温力の高い水筒を',
                      amazon:'https://www.amazon.co.jp/s?k=スポーツ水筒 保温 ジュニア&tag=haircolorab22-22',
                      rakuten:'https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E6%B0%B4%E7%AD%92%E4%BF%9D%E6%B8%A9%2F'},
                  ],
                },
              ].map((s,i)=>(
                <div key={i} style={{borderRadius:12,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{position:'relative',height:130,overflow:'hidden'}}>
                    <img src={s.image} alt={s.season} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.85) 100%)'}}>
                      <div style={{position:'absolute',bottom:10,left:12}}>
                        <p style={{fontSize:15,fontWeight:700,color:'white',textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>{s.season}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{background:s.bg,padding:'12px 14px',borderTop:`1px solid ${s.color}30`}}>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.7)',lineHeight:1.7,marginBottom:10}}>{s.desc}</p>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {s.items.map((item:any,j:number)=>(
                        <div key={j} style={{background:'rgba(0,0,0,0.3)',borderRadius:10,padding:'10px 12px'}}>
                          <p style={{fontSize:12,fontWeight:600,color:'white',marginBottom:3}}>{item.name}</p>
                          <p style={{fontSize:10,color:'rgba(255,255,255,0.55)',marginBottom:8,lineHeight:1.5}}>{item.reason}</p>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
                            <a href={item.amazon} target="_blank" rel="noopener noreferrer sponsored"
                              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,padding:'6px',
                                borderRadius:7,background:'#ff9900',textDecoration:'none'}}>
                              <span style={{fontSize:11}}>📦</span>
                              <span style={{fontSize:9,fontWeight:700,color:'white'}}>Amazon</span>
                            </a>
                            <a href={item.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,padding:'6px',
                                borderRadius:7,background:'#bf0000',textDecoration:'none'}}>
                              <span style={{fontSize:11}}>🛒</span>
                              <span style={{fontSize:9,fontWeight:700,color:'white'}}>楽天</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==='gear' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:4}}>
                {pos.fullName}のパフォーマンスを上げるおすすめ用具です。
              </p>
              {pos.gear.map((item:any,i:number)=>(
                <div key={i} style={{background:'#111',borderRadius:12,padding:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
                  <p style={{fontSize:13,fontWeight:700,color:'white',marginBottom:4}}>{item.name}</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:10,lineHeight:1.6}}>{item.desc}</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                    <a href={item.amazon} target="_blank" rel="noopener noreferrer sponsored"
                      style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'9px',borderRadius:8,background:'#ff9900',textDecoration:'none'}}>
                      <span style={{fontSize:13}}>📦</span>
                      <span style={{fontSize:10,fontWeight:700,color:'white'}}>Amazon</span>
                    </a>
                    <a href={item.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                      style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'9px',borderRadius:8,background:'#bf0000',textDecoration:'none'}}>
                      <span style={{fontSize:13}}>🛒</span>
                      <span style={{fontSize:10,fontWeight:700,color:'white'}}>楽天</span>
                    </a>
                  </div>
                </div>
              ))}
              <div style={{background:`${pos.color}10`,borderRadius:12,padding:'14px',border:`1px solid ${pos.color}20`}}>
                <p style={{fontSize:11,fontWeight:600,color:pos.color,marginBottom:10}}>全ポジション共通おすすめ</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                  <a href={`https://www.amazon.co.jp/s?k=サッカー練習グッズ+ジュニア&tag=haircolorab22-22`}
                    target="_blank" rel="noopener noreferrer sponsored"
                    style={{padding:'10px',borderRadius:8,background:'rgba(255,153,0,0.15)',
                      border:'1px solid rgba(255,153,0,0.3)',textDecoration:'none',textAlign:'center'}}>
                    <p style={{fontSize:10,fontWeight:600,color:'#ff9900'}}>📦 Amazon<br/>練習グッズ</p>
                  </a>
                  <a href={`https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E7%B7%B4%E7%BF%92%2F`}
                    target="_blank" rel="noopener noreferrer sponsored"
                    style={{padding:'10px',borderRadius:8,background:'rgba(191,0,0,0.15)',
                      border:'1px solid rgba(191,0,0,0.3)',textDecoration:'none',textAlign:'center'}}>
                    <p style={{fontSize:10,fontWeight:600,color:'#ff6666'}}>🛒 楽天<br/>練習グッズ</p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
