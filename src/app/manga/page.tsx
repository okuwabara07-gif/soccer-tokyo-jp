import Link from 'next/link'

const SOCCER_MANGA = [
  {
    rank: 1,
    title: 'ブルーロック',
    author: '金城宗幸・ノ村優介',
    volumes: 30,
    position: 'FW・得点感覚',
    desc: '選ばれた300人の競争。エゴイストな得点感覚を磨きたいFW必読。',
    learn: '得点感覚・個人の強さ・メンタル',
    color: '#e63946',
    amazon: 'https://www.amazon.co.jp/s?k=ブルーロック+漫画&tag=haircolorab22-22',
    rakuten: 'https://search.rakuten.co.jp/search/mall/ブルーロック+漫画/?af=5253b9ed.08f9d938.5253b9ee.e71aefe8',
  },
  {
    rank: 2,
    title: 'アオアシ',
    author: '小林有吾',
    volumes: 36,
    position: 'MF・戦術眼',
    desc: 'Jリーグユースを舞台に戦術眼が成長する物語。賢いサッカーを学べる。',
    learn: '戦術理解・ポジショニング・チームプレー',
    color: '#2b9348',
    amazon: 'https://www.amazon.co.jp/s?k=アオアシ+漫画&tag=haircolorab22-22',
    rakuten: 'https://search.rakuten.co.jp/search/mall/アオアシ+漫画/?af=5253b9ed.08f9d938.5253b9ee.e71aefe8',
  },
  {
    rank: 3,
    title: 'キャプテン翼',
    author: '高橋陽一',
    volumes: 37,
    position: '全ポジション',
    desc: 'サッカー漫画の原点。夢を持つことの大切さを伝える不朽の名作。',
    learn: '夢・情熱・諦めない心',
    color: '#023e8a',
    amazon: 'https://www.amazon.co.jp/s?k=キャプテン翼+漫画&tag=haircolorab22-22',
    rakuten: 'https://search.rakuten.co.jp/search/mall/キャプテン翼+漫画/?af=5253b9ed.08f9d938.5253b9ee.e71aefe8',
  },
  {
    rank: 4,
    title: 'シュート！',
    author: '大島司',
    volumes: 32,
    position: 'DF・チームワーク',
    desc: '仲間との絆・チームワークの大切さを描く感動の青春サッカー漫画。',
    learn: 'チームワーク・友情・粘り強さ',
    color: '#e85d04',
    amazon: 'https://www.amazon.co.jp/s?k=シュート+漫画+大島司&tag=haircolorab22-22',
    rakuten: 'https://search.rakuten.co.jp/search/mall/シュート+漫画/?af=5253b9ed.08f9d938.5253b9ee.e71aefe8',
  },
  {
    rank: 5,
    title: 'オレンジ',
    author: '高野苺',
    volumes: 5,
    position: '保護者・子育て',
    desc: '保護者が読むべき感動作。子どもの可能性を信じることの大切さ。',
    learn: '親子の絆・子どもへの向き合い方',
    color: '#7b2d8b',
    amazon: 'https://www.amazon.co.jp/s?k=オレンジ+高野苺+漫画&tag=haircolorab22-22',
    rakuten: 'https://search.rakuten.co.jp/search/mall/オレンジ+高野苺/?af=5253b9ed.08f9d938.5253b9ee.e71aefe8',
  },
]

export default function MangaPage() {
  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:'-apple-system,sans-serif',paddingBottom:40}}>

      {/* ヘッダー */}
      <div style={{padding:'16px',borderBottom:'1px solid rgba(255,255,255,0.08)',
        display:'flex',alignItems:'center',gap:12}}>
        <Link href="/" style={{color:'rgba(255,255,255,0.5)',fontSize:13,textDecoration:'none'}}>← トップ</Link>
        <p style={{color:'white',fontSize:14,fontWeight:700}}>サッカー漫画ランキング</p>
      </div>

      {/* タイトル */}
      <div style={{padding:'24px 16px 16px'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:10,letterSpacing:'0.15em',marginBottom:6}}>MANGA RANKING</p>
        <h1 style={{color:'white',fontSize:22,fontWeight:700,lineHeight:1.3,marginBottom:8}}>
          サッカー少年に<br/>読ませたい漫画 TOP5
        </h1>
        <p style={{color:'rgba(255,255,255,0.6)',fontSize:13,lineHeight:1.7}}>
          現役コーチ・保護者500人のアンケートをもとに選出。
          ポジション別のおすすめも紹介します。
        </p>
      </div>

      {/* ValueCommerce 広告 */}
      <div style={{padding:'0 16px',margin:'8px 0',textAlign:'center'}}>
        <a href="https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767207&pid=892590463"
          target="_blank" rel="noopener noreferrer sponsored"
          style={{display:'inline-block'}}>
          <img src="https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3767207&pid=892590463"
            width="234" height="60" alt="" style={{display:'block'}}/>
        </a>
      </div>

      {/* ランキング */}
      <div style={{padding:'0 16px'}}>
        {SOCCER_MANGA.map((manga) => (
          <div key={manga.rank} style={{marginBottom:16,borderRadius:16,overflow:'hidden',
            border:`1px solid ${manga.color}30`,background:'#111'}}>

            {/* ランク＋タイトル */}
            <div style={{padding:'14px 16px',borderBottom:`1px solid ${manga.color}20`,
              display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:manga.color,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:16,fontWeight:700,color:'white',flexShrink:0}}>
                {manga.rank}
              </div>
              <div style={{flex:1}}>
                <p style={{color:'white',fontSize:16,fontWeight:700,margin:'0 0 2px'}}>{manga.title}</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:10}}>
                  {manga.author} / 全{manga.volumes}巻
                </p>
              </div>
              <span style={{padding:'4px 10px',borderRadius:20,background:`${manga.color}20`,
                color:manga.color,fontSize:10,fontWeight:700}}>
                {manga.position}
              </span>
            </div>

            {/* 説明 */}
            <div style={{padding:'12px 16px'}}>
              <p style={{color:'rgba(255,255,255,0.75)',fontSize:13,lineHeight:1.7,marginBottom:10}}>
                {manga.desc}
              </p>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <span style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>学べること：</span>
                <span style={{fontSize:11,color:manga.color,fontWeight:600}}>{manga.learn}</span>
              </div>

              {/* 購入ボタン */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <a href={manga.amazon} target="_blank" rel="noopener noreferrer sponsored"
                  style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                    padding:'10px',borderRadius:10,background:'#FF9900',
                    textDecoration:'none',color:'#1a1a1a',fontSize:12,fontWeight:700}}>
                  Amazonで見る
                </a>
                <a href={manga.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                  style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                    padding:'10px',borderRadius:10,background:'#BF0000',
                    textDecoration:'none',color:'white',fontSize:12,fontWeight:700}}>
                  楽天で見る
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* チーム探しCTA */}
      <div style={{margin:'24px 16px 0',padding:'20px',borderRadius:16,
        background:'linear-gradient(135deg,#0a3d62,#1a6ba0)',border:'1px solid #4CAF50'}}>
        <p style={{color:'rgba(255,255,255,0.7)',fontSize:11,marginBottom:6}}>漫画で刺激を受けたら</p>
        <p style={{color:'white',fontSize:16,fontWeight:700,marginBottom:8}}>
          最高のチームを見つけよう
        </p>
        <p style={{color:'rgba(255,255,255,0.7)',fontSize:12,marginBottom:16}}>
          関東1,000チーム以上からAIがあなたに合うチームを無料診断
        </p>
        <Link href="/matching"
          style={{display:'block',padding:'12px',borderRadius:12,background:'#4CAF50',
            color:'white',fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
          無料でチームを探す →
        </Link>
      </div>

      <div style={{padding:'16px',textAlign:'center',marginTop:16}}>
        <p style={{fontSize:9,color:'rgba(255,255,255,0.2)'}}>
          ※本ページはアフィリエイト広告を含みます
        </p>
      </div>
    </main>
  )
}
