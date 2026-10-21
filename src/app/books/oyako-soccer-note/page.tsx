import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

// Amazonで発売されたら ASIN を入れる（例: "B0XXXXXXXX"）。空のあいだは書名検索リンクを使う。
const ASIN = "B0HNRXVDD2";
const TAG = "haircolorab22-22";
const TITLE = "9歳から始める 親子サッカーノート";
const AMAZON_URL = ASIN
  ? `https://www.amazon.co.jp/dp/${ASIN}?tag=${TAG}`
  : `https://www.amazon.co.jp/s?k=${encodeURIComponent(TITLE)}&tag=${TAG}`;
const URL = "https://soccer-selection.jp/books/oyako-soccer-note";

export const metadata = {
  title: `${TITLE}｜書いて、話して、伸びる。ゴールデンエイジの交換ノート`,
  description:
    "子どもが書いて、おうちの方がひと言返す親子の交換ノート。9マス目標シート・週の振り返り40週・試合ふりかえり16回・親子ミーティング12か月分。大判（21.6×27.9cm）・書きこみ式・ふりがな付き・120ページ。",
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: "ゴールデンエイジは、9歳から。伸びる子の家には「会話」がある。",
    url: URL,
    images: [{ url: "https://soccer-selection.jp/books/oyako-soccer-note-cover.jpg", width: 850, height: 1100 }],
  },
};

const FEATURES = [
  { t: "9マス目標シート", d: "夢から逆算して「やること」を親子で決める。3か月ごとに書きなおし、4回分。" },
  { t: "週の交換ページ（40週）", d: "子どもが練習を振り返り、おうちの方がひと言返す。続けやすい見開き設計。" },
  { t: "試合のあとシート（16回）", d: "自分の評価とおうちの方の評価を比べて、ズレを会話のきっかけに。" },
  { t: "親子ミーティング（12か月）", d: "月に1回、10分。3つの質問だけ。" },
  { t: "セレクション・からだの記録", d: "受けたチームと結果、身長・50m走などを1か所に。" },
  { t: "1年後への手紙", d: "書き終えたノートが、親子の記念になる。" },
];

const SAMPLES = [
  { src: "/books/oyako-soccer-note-p2.jpg", cap: "親の覚悟5か条" },
  { src: "/books/oyako-soccer-note-p6.jpg", cap: "9マス目標シート" },
  { src: "/books/oyako-soccer-note-p8.jpg", cap: "今週のサッカー（子ども）" },
  { src: "/books/oyako-soccer-note-p9.jpg", cap: "来週やること・親のひと言" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: TITLE,
  alternateName: "書いて、話して、伸びる。ゴールデンエイジの交換ノート",
  author: { "@type": "Person", name: "橘 航" },
  publisher: { "@type": "Organization", name: "AOKAE合同会社" },
  bookFormat: "https://schema.org/Paperback",
  numberOfPages: 120,
  inLanguage: "ja",
  image: "https://soccer-selection.jp/books/oyako-soccer-note-cover.jpg",
  url: URL,
};

const btn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", borderRadius: 12,
  background: "#FF9900", color: "#1a1a1a", fontSize: 15, fontWeight: 800, textDecoration: "none",
};

export default function OyakoSoccerNotePage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginBottom: 12 }}>
          <Link href="/" style={{ color: "inherit" }}>トップ</Link> ＞ <Link href="/books" style={{ color: "inherit" }}>書籍</Link>
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, alignItems: "start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/books/oyako-soccer-note-cover.jpg" alt={`${TITLE} 表紙`} width={850} height={1100}
            style={{ width: "100%", maxWidth: 320, height: "auto", borderRadius: 6, boxShadow: "0 6px 24px rgba(0,0,0,.18)", justifySelf: "center" }} />
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--kf-muted)", margin: "0 0 6px" }}>BOOK</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.35, margin: "0 0 6px" }}>{TITLE}</h1>
            <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 14px" }}>書いて、話して、伸びる。ゴールデンエイジの交換ノート</p>
            <p style={{ fontSize: 13, margin: "0 0 4px" }}>著者：橘 航</p>
            <p style={{ fontSize: 13, margin: "0 0 18px" }}>大判（21.6×27.9cm）・書きこみ式・ふりがな付き・120ページ（ペーパーバック）</p>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer sponsored" style={btn}>Amazonで見る</a>
            <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 8 }}>対象：小学3〜6年生とそのご家族</p>
          </div>
        </section>

        <section style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>ゴールデンエイジは、9歳から。<br />伸びる子の家には「会話」がある。</h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0 }}>
            サッカーがうまくなるかどうかは、才能や練習量だけでは決まりません。その日のプレーを言葉にして、だれかに聞いてもらう。
            その積み重ねが、子どもの「続ける力」と「考える力」を育てます。
            このノートは、子どもが書いて、おうちの方がひと言返す交換ノートです。週に1回・10分。続けやすさを最優先に設計しました。
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>このノートでできること</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {FEATURES.map((f) => (
              <div key={f.t} className="kf-card" style={{ padding: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{f.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--kf-muted)" }}>{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>中身を見る</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {SAMPLES.map((s) => (
              <figure key={s.src} style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.cap} loading="lazy" width={595} height={770}
                  style={{ width: "100%", height: "auto", border: "1px solid #ddd", borderRadius: 4, background: "#fff" }} />
                <figcaption style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 6, textAlign: "center" }}>{s.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px" }}>おうちの方へのページ</h2>
          <ul style={{ fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
            <li>このノートを開く前に、親が決めておくこと（親の覚悟5か条）</li>
            <li>親の責任は、3つだけ</li>
            <li>ゴールデンエイジとは？</li>
          </ul>
        </section>

        <section style={{ marginTop: 32 }}>
          <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer sponsored" style={btn}>Amazonで見る</a>
          <p style={{ fontSize: 13, marginTop: 16 }}>
            セレクションの準備には <Link href="/selection">最新のセレクション情報</Link> もあわせてチェックしてください。お金・当番・進路の疑問には <Link href="/books/okane-toban-shinro">『入る前に知りたかった 少年サッカーのお金と当番と進路』</Link> で答えています。
          </p>
          <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 16, lineHeight: 1.7 }}>
            本書はAOKAE合同会社が発行しています。当サイトはAmazonアソシエイト・プログラムに参加しており、リンク経由のご購入で紹介料を受け取る場合があります。
          </p>
        </section>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
