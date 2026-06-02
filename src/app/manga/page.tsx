import Link from 'next/link'
import MangaCover from "@/components/MangaCover";

const SOCCER_MANGA = [
  {
    rank: 1,
    title: 'ブルーロック',
    cover: 'ブルーロック 1巻 コミック',
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
    cover: 'アオアシ 1巻 コミック',
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
    cover: 'キャプテン翼 1巻 文庫',
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
    cover: 'シュート 大島司 1巻',
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
    cover: 'オレンジ 高野苺 1巻',
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
  const top = SOCCER_MANGA[0];
  const rest = SOCCER_MANGA.slice(1);
  return (
    <main style={{ minHeight: "100vh", background: "var(--kf-bg, #f7f8fa)", fontFamily: "-apple-system,sans-serif", paddingBottom: 48, color: "var(--kf-text, #1a1a1a)" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12, background: "#fff" }}>
        <Link href="/" style={{ color: "#888", fontSize: 13, textDecoration: "none" }}>← トップ</Link>
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>サッカー漫画ランキング</p>
      </div>

      <div className="kf-container" style={{ padding: "24px 16px 8px" }}>
        <p style={{ color: "#999", fontSize: 10, letterSpacing: "0.15em", marginBottom: 6 }}>MANGA RANKING</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>サッカー少年に読ませたい漫画 TOP5</h1>
        <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7 }}>編集部がサッカー育成の観点から、ポジション別・目的別に選びました。表紙画像・価格は楽天市場の情報を表示しています。</p>
      </div>

      <div className="kf-container" style={{ padding: "0 16px", margin: "8px 0", textAlign: "center" }}>
        <a href="https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767207&pid=892590463" target="_blank" rel="noopener noreferrer sponsored" style={{ display: "inline-block" }}>
          <img src="https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3767207&pid=892590463" width="234" height="60" alt="" style={{ display: "block" }} />
        </a>
      </div>

      <div className="kf-container" style={{ padding: "8px 16px" }}>
        <div className="kf-card" style={{ padding: 18, marginBottom: 18, display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "start" }}>
          <div><MangaCover keyword={top.cover} alt={top.title} /></div>
          <div>
            <span style={{ display: "inline-block", background: top.color, color: "#fff", fontSize: 12, fontWeight: 800, padding: "2px 10px", borderRadius: 6, marginBottom: 6 }}>1位 {top.position}</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "2px 0 4px" }}>{top.title}</h2>
            <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px" }}>{top.author} / 全{top.volumes}巻</p>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", marginBottom: 8 }}>{top.desc}</p>
            <p style={{ fontSize: 12, marginBottom: 12 }}><span style={{ color: "#999" }}>学べること：</span><span style={{ color: top.color, fontWeight: 700 }}>{top.learn}</span></p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <a href={top.amazon} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", borderRadius: 10, background: "#FF9900", color: "#1a1a1a", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Amazonで見る</a>
              <a href={top.rakuten} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", borderRadius: 10, background: "#BF0000", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>楽天で見る</a>
            </div>
          </div>
        </div>

        {rest.map((manga) => (
          <div key={manga.rank} className="kf-card" style={{ padding: 14, marginBottom: 14, display: "grid", gridTemplateColumns: "72px 1fr", gap: 14, alignItems: "start" }}>
            <div><MangaCover keyword={manga.cover} alt={manga.title} /></div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: manga.color, color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{manga.rank}</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{manga.title}</span>
                <span style={{ marginLeft: "auto", padding: "3px 9px", borderRadius: 20, background: `${manga.color}1a`, color: manga.color, fontSize: 10, fontWeight: 700 }}>{manga.position}</span>
              </div>
              <p style={{ fontSize: 10, color: "#999", margin: "0 0 6px" }}>{manga.author} / 全{manga.volumes}巻</p>
              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "#444", marginBottom: 6 }}>{manga.desc}</p>
              <p style={{ fontSize: 11, marginBottom: 10 }}><span style={{ color: "#999" }}>学べること：</span><span style={{ color: manga.color, fontWeight: 700 }}>{manga.learn}</span></p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <a href={manga.amazon} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "9px", borderRadius: 10, background: "#FF9900", color: "#1a1a1a", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Amazon</a>
                <a href={manga.rakuten} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "9px", borderRadius: 10, background: "#BF0000", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>楽天</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="kf-container" style={{ margin: "20px 16px 0", padding: "20px", borderRadius: 16, background: "linear-gradient(135deg,#0a3d62,#1a6ba0)" }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginBottom: 6 }}>漫画で刺激を受けたら</p>
        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>最高のチームを見つけよう</p>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 16 }}>関東1,000チーム以上からAIがあなたに合うチームを無料診断</p>
        <Link href="/matching" style={{ display: "block", padding: "12px", borderRadius: 12, background: "#4CAF50", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>無料でチームを探す →</Link>
      </div>

      <p style={{ fontSize: 10, color: "#aaa", textAlign: "center", marginTop: 20 }}>※本ページはアフィリエイト広告を含みます。表紙画像・価格は楽天市場の情報です。</p>
    </main>
  );
}
