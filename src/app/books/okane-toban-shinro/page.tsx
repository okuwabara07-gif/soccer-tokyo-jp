import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

// Amazonの商品ページのASIN（例: "B0XXXXXXXX"）。空のあいだは書名検索リンクを使う。
const ASIN = "";
const TAG = "haircolorab22-22";
const TITLE = "入る前に知りたかった 少年サッカーのお金と当番と進路";
const SUBTITLE = "入団から中学の進路まで、親の疑問100に全部答えます";
const AMAZON_URL = ASIN
  ? `https://www.amazon.co.jp/dp/${ASIN}?tag=${TAG}`
  : `https://www.amazon.co.jp/s?k=${encodeURIComponent(TITLE)}&i=digital-text&tag=${TAG}`;
const URL = "https://soccer-selection.jp/books/okane-toban-shinro";
const COVER = "https://soccer-selection.jp/books/okane-toban-shinro-cover.jpg";

export const metadata = {
  title: `${TITLE}｜${SUBTITLE}`,
  description:
    "少年サッカーの親が困るお金・当番・進路を100問のQ&Aで解説。月謝の相場と1年間の費用、車出しや審判の当番、ジュニアユースのセレクション時期と申込フォーム、内定後の決め方まで。付録に見学チェックリストや費用試算表など9点。",
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: "月謝だけだと思っていた。当番がこんなにあるなんて。入る前に、知りたかった。",
    url: URL,
    images: [{ url: COVER, width: 800, height: 1280 }],
  },
};

const PILLARS = [
  { t: "お金", d: "少年団・クラブ・スクール別の月謝の相場、1年間の総額の試算、遠征・用品・保険まで。" },
  { t: "当番", d: "車出し・審判・保護者会の実態と、共働き家庭の回し方。サイドコーチングなど応援のルールも。" },
  { t: "進路", d: "関東・関西のジュニアユース255件を集計したセレクション時期、申込フォーム、所属リーグの見方、内定後の決め方。" },
  { t: "からだと心", d: "オスグッド・脳振とう・熱中症への備え、スポーツ専門医の使い方、「やめたい」と言われたときの声かけ。" },
];

const CHAPTERS = [
  "第1章 始める前に（Q1〜12）",
  "第2章 お金（Q13〜26）",
  "第3章 当番と親の役割（Q27〜40）",
  "第4章 練習と試合の日（Q41〜54）",
  "第5章 からだと健康（Q55〜64）",
  "第6章 子どもの心と親の声かけ（Q65〜78）",
  "第7章 高学年とセレクション（Q79〜90）",
  "第8章 その先の道（Q91〜100）",
  "付録 そのまま使える道具 9点",
];

const SAMPLES = [
  { src: "/books/okane-toban-shinro-p3.jpg", cap: "目次（100問）" },
  { src: "/books/okane-toban-shinro-p22.jpg", cap: "1年間の総額の試算" },
  { src: "/books/okane-toban-shinro-p100.jpg", cap: "申込フォームでよく聞かれること" },
  { src: "/books/okane-toban-shinro-p121.jpg", cap: "チーム見学チェックリスト" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: TITLE,
  alternateName: SUBTITLE,
  author: { "@type": "Person", name: "橘 航" },
  publisher: { "@type": "Organization", name: "AOKAE合同会社" },
  bookFormat: "https://schema.org/EBook",
  inLanguage: "ja",
  image: COVER,
  url: URL,
};

const btn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", borderRadius: 12,
  background: "#FF9900", color: "#1a1a1a", fontSize: 15, fontWeight: 800, textDecoration: "none",
};

export default function OkaneTobanShinroPage() {
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
          <img src="/books/okane-toban-shinro-cover.jpg" alt={`${TITLE} 表紙`} width={800} height={1280}
            style={{ width: "100%", maxWidth: 300, height: "auto", borderRadius: 6, boxShadow: "0 6px 24px rgba(0,0,0,.18)", justifySelf: "center" }} />
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--kf-muted)", margin: "0 0 6px" }}>BOOK</p>
            <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.4, margin: "0 0 6px" }}>{TITLE}</h1>
            <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 14px" }}>{SUBTITLE}</p>
            <p style={{ fontSize: 13, margin: "0 0 4px" }}>著者：橘 航</p>
            <p style={{ fontSize: 13, margin: "0 0 18px" }}>Kindle版（Kindle Unlimited対象）</p>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer sponsored" style={btn}>Amazonで見る</a>
            <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 8 }}>対象：子どもがサッカーを始める・始めたばかりの保護者、セレクションを控えた小5・小6の保護者</p>
          </div>
        </section>

        <section style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>月謝だけだと思っていた。<br />当番がこんなにあるなんて。</h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0 }}>
            少年サッカーで親を悩ませるのは、技術の話ではありません。毎月いくら出ていくのか。土日はどれだけサッカーに使われるのか。小6の進路はいつ、どう決まるのか。
            この本は、入団前から中学のジュニアユース選びまで、親が本当に困る100の疑問に、ひとつずつ答えた実用書です。
            各問いは「答え」で結論を先に書き、「今日からできること」で、すぐに動けることを挙げています。
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>この本でわかること</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {PILLARS.map((f) => (
              <div key={f.t} className="kf-card" style={{ padding: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{f.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--kf-muted)" }}>{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px" }}>目次</h2>
          <ul style={{ fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
            {CHAPTERS.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>中身を見る</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {SAMPLES.map((s) => (
              <figure key={s.src} style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.cap} loading="lazy" width={584} height={827}
                  style={{ width: "100%", height: "auto", border: "1px solid #ddd", borderRadius: 4, background: "#fff" }} />
                <figcaption style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 6, textAlign: "center" }}>{s.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer sponsored" style={btn}>Amazonで見る</a>
          <p style={{ fontSize: 13, marginTop: 16, lineHeight: 1.8 }}>
            あわせて読みたい：子どもが書いて親がひと言返す交換ノート <Link href="/books/oyako-soccer-note">『9歳から始める 親子サッカーノート』</Link>。
            セレクションの時期は <Link href="/selection">最新のセレクション情報</Link> でも確認できます。
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
