'use client'
import { useState } from 'react'
import Link from 'next/link'

const POSITIONS: any[] = [{"id": "gk", "name": "GK", "fullName": "ゴールキーパー", "emoji": "🧤", "color": "#FFD700", "bg": "#0a0a2e", "heroImage": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", "images": ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"], "role": "チームの最後の砦。ゴールを守りながらチームの守備を統率する司令塔。", "skills": ["セービング", "ポジショニング", "コーチング", "フィード（配球）", "1対1の対応"], "bodyHeight": "平均+5cm以上が有利", "bodyWeight": "がっしり型", "bodyPersonality": "リーダーシップ・冷静沈着・声が大きい", "training": [{"name": "反射神経トレーニング", "desc": "近距離から素早くボールを投げてもらい、瞬時に反応して止める練習。", "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80"}, {"name": "ポジショニング練習", "desc": "角度を変えたシュートに対して最適なポジションに素早く移動する練習。", "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80"}, {"name": "フィード練習", "desc": "両足でのキック・スローで正確にチームメイトに配球する練習。", "image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80"}], "players": [{"name": "権田修一", "team": "FC東京", "emoji": "🇯🇵", "desc": "日本代表正GK。セービングと安定したプレーが持ち味。"}, {"name": "エミリアーノ・マルティネス", "team": "アストン・ヴィラ", "emoji": "🇦🇷", "desc": "W杯優勝GK。心理戦とビッグセーブが武器。"}, {"name": "マヌエル・ノイアー", "team": "バイエルン", "emoji": "🇩🇪", "desc": "スウィーパーGKの革命者。足元の技術も世界最高レベル。"}], "selection": "反応速度・声出し・1対1の対応が審査ポイント。身長も重視される。", "gear": [{"name": "GKグローブ", "desc": "必須アイテム。ジュニア用は指保護機能付きがおすすめ", "amazon": "https://www.amazon.co.jp/s?k=GK%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%96%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2FGK%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%96%2F"}, {"name": "GKパンツ", "desc": "膝・腰のパッド付き。ダイビング時の怪我防止に必須", "amazon": "https://www.amazon.co.jp/s?k=GK%E3%83%91%E3%83%B3%E3%83%84%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2FGK%E3%83%91%E3%83%B3%E3%83%84%2F"}]}, {"id": "cb", "name": "CB", "fullName": "センターバック", "emoji": "🛡️", "color": "#e63946", "bg": "#1a0a0a", "heroImage": "https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=800&q=80", "images": ["https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=600&q=80", "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80", "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80"], "role": "守備ラインの中心。空中戦・1対1の強さで相手FWを封じる守備の要。", "skills": ["ヘディング", "1対1の守備", "ラインコントロール", "ビルドアップ", "カバーリング"], "bodyHeight": "平均以上が有利", "bodyWeight": "がっしり型", "bodyPersonality": "闘志・集中力・コミュニケーション能力", "training": [{"name": "ヘディング練習", "desc": "クロスボールへのヘディング。高さ・タイミング・方向の3つを意識。", "image": "https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=400&q=80"}, {"name": "1対1守備練習", "desc": "相手FWとの1対1。間合いの取り方と体の入れ方を習得。", "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80"}, {"name": "ビルドアップ練習", "desc": "GKからのボールを受けてMFにつなぐパス出し練習。", "image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80"}], "players": [{"name": "板倉滉", "team": "ボルシアMG", "emoji": "🇯🇵", "desc": "日本代表CB。高さ・強さ・技術を兼ね備えた現代型CB。"}, {"name": "冨安健洋", "team": "アーセナル", "emoji": "🇯🇵", "desc": "プレミアリーグで活躍。CB・SBどちらもこなせるユーティリティ性。"}, {"name": "ヴィルヒル・ファン・ダイク", "team": "リバプール", "emoji": "🇳🇱", "desc": "世界最高のCB。圧倒的な高さと読みの深さが武器。"}], "selection": "空中戦の強さ・1対1の守備・コーチング（声出し）が審査ポイント。", "gear": [{"name": "スネ当て（大型）", "desc": "CBは激しい競り合いが多いので大型のスネ当てを選ぼう", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%B9%E3%83%8D%E5%BD%93%E3%81%A6%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%20%E5%A4%A7%E5%9E%8B&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B9%E3%83%8D%E5%BD%93%E3%81%A6%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%2F"}, {"name": "ヘディング練習ボール", "desc": "ヘディングの反復練習に。自宅でも練習できる", "amazon": "https://www.amazon.co.jp/s?k=%E3%83%98%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E7%B7%B4%E7%BF%92%E3%83%9C%E3%83%BC%E3%83%AB&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%98%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E7%B7%B4%E7%BF%92%2F"}]}, {"id": "sb", "name": "SB", "fullName": "サイドバック", "emoji": "⚡", "color": "#457b9d", "bg": "#0a1020", "heroImage": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80", "images": ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80", "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80"], "role": "守備と攻撃を両立する現代サッカーの重要ポジション。サイドを縦横無尽に走る。", "skills": ["オーバーラップ", "クロス", "1対1守備", "スタミナ", "スピード"], "bodyHeight": "平均程度", "bodyWeight": "スリム〜標準", "bodyPersonality": "積極性・スタミナ・判断力", "training": [{"name": "クロス練習", "desc": "走りながらの精度の高いクロス。インステップ・インサイドどちらも習得。", "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80"}, {"name": "オーバーラップ練習", "desc": "ウイングとのコンビネーションで相手を突破するタイミングを習得。", "image": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80"}, {"name": "スタミナトレーニング", "desc": "90分間サイドを走り続けるための有酸素運動。インターバル走が効果的。", "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80"}], "players": [{"name": "菅原由勢", "team": "サウサンプトン", "emoji": "🇯🇵", "desc": "日本代表右SB。攻撃参加とクロス精度が武器。"}, {"name": "伊藤洋輝", "team": "バイエルン", "emoji": "🇯🇵", "desc": "左SBとCBをこなすユーティリティ。高いビルドアップ能力。"}, {"name": "トレント・アレクサンダー＝アーノルド", "team": "リバプール", "emoji": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "desc": "世界最高の右SB。クロス・スルーパスで革命的なSBスタイル。"}], "selection": "攻撃参加の積極性・クロス精度・守備の対応力が審査ポイント。", "gear": [{"name": "スパイク（軽量）", "desc": "SBにはスピードを活かせる軽量スパイクがおすすめ", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E8%BB%BD%E9%87%8F%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E8%BB%BD%E9%87%8F%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F"}]}, {"id": "mf", "name": "MF", "fullName": "ミッドフィルダー", "emoji": "🎯", "color": "#2d6a4f", "bg": "#0a1a10", "heroImage": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80", "images": ["https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80", "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80"], "role": "攻守をつなぐチームの心臓部。ゲームメイクから守備まで幅広い役割をこなす。", "skills": ["パス精度", "視野の広さ", "ボールコントロール", "守備意識", "運動量"], "bodyHeight": "平均程度", "bodyWeight": "標準", "bodyPersonality": "知性・判断力・技術・運動量", "training": [{"name": "パスコース確認練習", "desc": "常に複数のパスコースを確認しながらボールを受け取る習慣をつける。", "image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80"}, {"name": "視野拡大トレーニング", "desc": "首を振る習慣。ボールを受ける前に周囲の状況を確認する練習。", "image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80"}, {"name": "プレッシング練習", "desc": "ボールを失った瞬間に素早く奪い返しに行く切り替えの速さを習得。", "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80"}], "players": [{"name": "久保建英", "team": "レアル・ソシエダ", "emoji": "🇯🇵", "desc": "日本最高のMF。創造性とドリブル突破で世界のトップリーグで活躍。"}, {"name": "遠藤航", "team": "リバプール", "emoji": "🇯🇵", "desc": "プレミアのボランチ。守備の強さとパスセンスでリバプールの中心に。"}, {"name": "ルカ・モドリッチ", "team": "レアル・マドリード", "emoji": "🇭🇷", "desc": "バロンドール受賞の世界最高のMF。38歳でもトップレベルを維持。"}], "selection": "パスの精度・視野の広さ・ゲームを読む力が審査ポイント。", "gear": [{"name": "トレーニングボール（4号）", "desc": "MFはボールを触る時間が長い。自主練用のボールを持とう", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%AB%204%E5%8F%B7%20%E7%B7%B4%E7%BF%92&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%AB4%E5%8F%B7%2F"}, {"name": "マーカーコーン", "desc": "パス練習・ドリブル練習のコースづくりに必須", "amazon": "https://www.amazon.co.jp/s?k=%E3%83%9E%E3%83%BC%E3%82%AB%E3%83%BC%E3%82%B3%E3%83%BC%E3%83%B3%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9E%E3%83%BC%E3%82%AB%E3%83%BC%E3%82%B3%E3%83%BC%E3%83%B3%2F"}]}, {"id": "fw", "name": "FW", "fullName": "フォワード", "emoji": "🔥", "color": "#FF6B35", "bg": "#1a0505", "heroImage": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80", "images": ["https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&q=80", "https://images.unsplash.com/photo-1551958219-acbc595d5f5b?w=600&q=80", "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80"], "role": "得点を奪うチームの花形ポジション。スピード・技術・決定力でゴールを量産。", "skills": ["シュート精度", "ドリブル", "スピード", "オフザボールの動き", "ヘディング"], "bodyHeight": "平均〜やや低め（ウイング）/ 高め（CF）", "bodyWeight": "スリム〜標準", "bodyPersonality": "積極性・ゴールへの嗅覚・メンタルの強さ", "training": [{"name": "シュート練習", "desc": "様々な角度・距離からのシュート。利き足・逆足両方練習することが重要。", "image": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80"}, {"name": "1対1ドリブル練習", "desc": "相手DFとの1対1を想定。切り返し・スピードの変化で抜く技術を習得。", "image": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80"}, {"name": "オフザボール練習", "desc": "ボールがない時の動き方。スペースへの走り込みとタイミングを習得。", "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80"}], "players": [{"name": "三笘薫", "team": "ブライトン", "emoji": "🇯🇵", "desc": "プレミアの左ウイング。圧倒的なドリブルと左足のクロスが武器。"}, {"name": "上田綺世", "team": "フェイエノールト", "emoji": "🇯🇵", "desc": "欧州リーグで活躍するCF。高さと決定力でゴールを量産。"}, {"name": "キリアン・エムバペ", "team": "レアル・マドリード", "emoji": "🇫🇷", "desc": "世界最速FW。爆発的なスピードと両足のシュートで得点を量産。"}], "selection": "シュートの正確さ・スピード・積極的な仕掛けが審査ポイント。", "gear": [{"name": "スパイク（コントロール系）", "desc": "FWはボールタッチを重視。柔らかい素材のスパイクがおすすめ", "amazon": "https://www.amazon.co.jp/s?k=%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%20%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%20%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%20%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F"}, {"name": "リバウンドネット", "desc": "1人でシュート練習ができる。壁当て不要で自主練に最適", "amazon": "https://www.amazon.co.jp/s?k=%E3%83%AA%E3%83%90%E3%82%A6%E3%83%B3%E3%83%89%E3%83%8D%E3%83%83%E3%83%88%20%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC&tag=haircolorab22-22", "rakuten": "https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%AA%E3%83%90%E3%82%A6%E3%83%B3%E3%83%89%E3%83%8D%E3%83%83%E3%83%88%2F"}]}]

export default function PositionPage() {
  const [selectedPos, setSelectedPos] = useState('gk')
  const [tab, setTab] = useState<'overview'|'training'|'players'|'gear'>('overview')
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
          {(['overview','training','players','gear'] as const).map((key)=>{
            const labels = {overview:'概要',training:'練習',players:'選手',gear:'用具'}
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
