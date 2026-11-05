import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

// Amazonの商品ページのASIN（例: "B0XXXXXXXX"）。空のあいだは書名検索リンクを使う。
const ASIN = "";
const TAG = "haircolorab22-22";
const TITLE = "天はピッチの上に人を造らず";
const SUBTITLE = "『学問のすすめ』で読み解く 少年サッカー 伸びる子と親の17の心得";
const AMAZON_URL = ASIN
  ? `https://www.amazon.co.jp/dp/${ASIN}?tag=${TAG}`
  : `https://www.amazon.co.jp/s?k=${encodeURIComponent(TITLE)}&i=digital-text&tag=${TAG}`;
const URL = "https://soccer-selection.jp/books/tenha-pitch";
const COVER = "https://soccer-selection.jp/books/tenha-pitch-cover.jpg";

export const metadata = {
  title: `${TITLE}｜${SUBTITLE}`,
  description:
    "福沢諭吉『学問のすすめ』全17編を少年サッカーの現場に置き換えた親向けの本。出場時間と子の価値の切り分け方、車内反省会のやめ方、嫉妬との向き合い方、サッカーノートでの振り返りまで。各章に声かけの言い換え表とチェックリスト付き。",
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: "「背が高いから」「早生まれだから」で、終わらせない。差をつくるのは、学ぶか、学ばぬか。",
    url: URL,
    images: [{ url: COVER, width: 800, height: 1280 }],
  },
};

const PILLARS = [
  { t: "原典の一節", d: "『学問のすすめ』の原文を短く引き、その意味と福沢の考えを今の言葉で説明します。" },
  { t: "グラウンドの3つのケース", d: "控えの日、選考に落ちた日、親同士のうわさ。よくある場面を結末まで描きます。" },
  { t: "声かけの言い換え表", d: "つい言ってしまう言葉を、子どもが自分で考え始める言葉に言い換えます。" },
  { t: "親が今日できること", d: "各章の終わりに、今日から試せるチェックリストを付けています。" },
];

const CHAPTERS = [
  "第1章 差をつくるのは「学ぶか学ばぬか」",
  "第2章 レギュラーも控えも「人として同等」",
  "第3章 一人が自立して、チームが強くなる",
  "第4章 コーチの役割、親の役割",
  "第5章 チームの空気は一人ひとりがつくる",
  "第6章 ルールと審判を重んじる",
  "第7章 選手は「お客さん」ではなくチームの主人",
  "第8章 親の心で子のサッカーを支配しない",
  "第9章 「うまくなる」の先にある目的",
  "第10章 小さな満足で止まらない",
  "第11章 名ばかりのキャプテン、形だけの上下関係",
  "第12章 自分のプレーを言葉で説明できる子",
  "第13章 嫉妬はチームを壊す",
  "第14章 心の棚卸し――サッカーノートのすすめ",
  "第15章 うのみにしない力",
  "第16章 口だけでなく行動で",
  "第17章 信頼される選手になる",
];

const SAMPLES = [
  { src: "/books/tenha-pitch-p2.jpg", cap: "はじめに" },
  { src: "/books/tenha-pitch-p7.jpg", cap: "第1章 原典の一節" },
  { src: "/books/tenha-pitch-p17.jpg", cap: "よくある質問とチェックリスト" },
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

export default function TenhaPitchPage() {
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
          <img src="/books/tenha-pitch-cover.jpg" alt={`${TITLE} 表紙`} width={800} height={1280}
            style={{ width: "100%", maxWidth: 300, height: "auto", borderRadius: 6, boxShadow: "0 6px 24px rgba(0,0,0,.18)", justifySelf: "center" }} />
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--kf-muted)", margin: "0 0 6px" }}>BOOK</p>
            <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.4, margin: "0 0 6px" }}>{TITLE}</h1>
            <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 14px" }}>{SUBTITLE}</p>
            <p style={{ fontSize: 13, margin: "0 0 4px" }}>著者：橘 航</p>
            <p style={{ fontSize: 13, margin: "0 0 18px" }}>Kindle版（Kindle Unlimited対象）</p>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer sponsored" style={btn}>Amazonで見る</a>
            <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 8 }}>対象：子どもが少年サッカーをしている保護者（低学年〜小6）、パパコーチ</p>
          </div>
        </section>

        <section style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>「背が高いから」「早生まれだから」で、<br />終わらせない。</h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0 }}>
            150年前、福沢諭吉は『学問のすすめ』で、人の差は生まれではなく「学ぶか学ばないか」で生まれると説きました。
            この本は、その全17編を少年サッカーの現場に一つずつ置き換えた、全約10万字の一冊です。
            差をつくるのは、体の大きさでも生まれ月でもなく、試合のあとに自分で考え、振り返り、次に試すこと。
            そのために親ができることを、章ごとにまとめました。
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>各章のつくり</h2>
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
            <li>はじめに なぜ今、少年サッカーに『学問のすすめ』なのか</li>
            {CHAPTERS.map((c) => <li key={c}>{c}</li>)}
            <li>おわりに 親もまた、学ぶ人である</li>
          </ul>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>中身を見る</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {SAMPLES.map((s) => (
              <figure key={s.src} style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.cap} loading="lazy" width={584} height={756}
                  style={{ width: "100%", height: "auto", border: "1px solid #ddd", borderRadius: 4, background: "#fff" }} />
                <figcaption style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 6, textAlign: "center" }}>{s.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer sponsored" style={btn}>Amazonで見る</a>
          <p style={{ fontSize: 13, marginTop: 16, lineHeight: 1.8 }}>
            あわせて読みたい：お金・当番・進路の疑問100に答える <Link href="/books/okane-toban-shinro">『入る前に知りたかった 少年サッカーのお金と当番と進路』</Link>、
            子どもが書いて親がひと言返す <Link href="/books/oyako-soccer-note">『9歳から始める 親子サッカーノート』</Link>。
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
