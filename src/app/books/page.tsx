import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "少年サッカーの親のための本｜サッカーセレクション",
  description: "少年サッカーの保護者向けの書籍。お金・当番・進路の疑問に答える実用書と、親子で書くサッカーノート。",
  alternates: { canonical: "https://soccer-selection.jp/books" },
};

const BOOKS = [
  {
    href: "/books/okane-toban-shinro",
    cover: "/books/okane-toban-shinro-cover.jpg", w: 800, h: 1280,
    title: "入る前に知りたかった 少年サッカーのお金と当番と進路",
    sub: "入団から中学の進路まで、親の疑問100に全部答えます",
    note: "Kindle版",
  },
  {
    href: "/books/oyako-soccer-note",
    cover: "/books/oyako-soccer-note-cover.jpg", w: 850, h: 1100,
    title: "9歳から始める 親子サッカーノート",
    sub: "書いて、話して、伸びる。ゴールデンエイジの交換ノート",
    note: "ペーパーバック（書きこみ式）",
  },
];

export default function BooksPage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginBottom: 12 }}>
          <Link href="/" style={{ color: "inherit" }}>トップ</Link> ＞ 書籍
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>少年サッカーの親のための本</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 20px" }}>著者：橘 航</p>
        <div style={{ display: "grid", gap: 14 }}>
          {BOOKS.map((b) => (
            <Link key={b.href} href={b.href} className="kf-card" style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 16, padding: 16, textDecoration: "none", color: "var(--kf-text)", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover} alt="" width={b.w} height={b.h} style={{ width: 96, height: "auto", borderRadius: 4, boxShadow: "0 3px 10px rgba(0,0,0,.15)" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.45 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: "var(--kf-muted)", margin: "4px 0 6px" }}>{b.sub}</div>
                <div style={{ fontSize: 12, color: "var(--kf-muted)" }}>{b.note}　›</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
