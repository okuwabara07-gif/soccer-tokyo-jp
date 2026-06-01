import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import RakutenItems from "@/components/RakutenItems";
import ReactMarkdown from "react-markdown";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const RAKUTEN_KW: Record<string, string> = {
  "入団準備": "ジュニア サッカー スターターセット",
  "遠征準備": "サッカー 遠征 ボストンバッグ",
  "夏対策": "スポーツ 水筒 1リットル 保冷",
  "冬対策": "サッカー 防寒 ネックウォーマー",
  "雨の日対策": "サッカー ピステ 上下",
  "GK専用": "キーパーグローブ ジュニア",
  "ジュニアユース準備": "サッカー リュック 大容量",
  "補食・栄養": "スポーツ ゼリー 補給",
  "スパイク": "ジュニア サッカースパイク",
  "バッグ": "サッカー リュック ボール収納",
  "水筒": "スポーツ ウォータージャグ",
  "インナー": "サッカー コンプレッション インナー",
  "レガース": "サッカー すね当て ジュニア",
  "靴下": "サッカーソックス グリップ",
  "ケア用品": "スポーツ アイシング 冷却",
};

export default async function GoodsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: article } = await supabase.from("goods_articles").select("*").eq("slug", slug).eq("status", "published").single();
  if (!article) {
    return (
      <div style={{ background: "var(--kf-bg)", minHeight: "100vh" }}><Header />
        <main className="kf-container" style={{ padding: "40px 16px", maxWidth: 760, textAlign: "center" }}>
          <div className="kf-empty"><div className="kf-empty__title">記事が見つかりません</div></div>
          <Link href="/goods" style={{ color: "var(--kf-primary)" }}>← グッズガイドへ戻る</Link>
        </main><SiteFooter /><BottomNav />
      </div>
    );
  }
  const { data: related } = await supabase.from("goods_articles").select("slug,title,category")
    .eq("category", article.category).eq("status", "published").neq("slug", slug).limit(4);

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 760 }}>
        <Link href={`/goods/c/${encodeURIComponent(article.category)}`} style={{ fontSize: 13, color: "var(--kf-muted)", textDecoration: "none" }}>← {article.category}の記事一覧へ</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 4px" }}>
          <span className="kf-badge">{article.category}</span>{article.is_pr && <span className="kf-pr-label">PR</span>}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.4 }}>{article.title}</h1>
        {article.hero_image && <img src={article.hero_image} alt="" style={{ width: "100%", borderRadius: "var(--kf-radius)", marginBottom: 20 }} />}
        <div className="kf-article-body" style={{ fontSize: 15, lineHeight: 2 }}>
          <ReactMarkdown components={{
            a: ({href, children}) => <a href={href || "#"} style={{ color: "var(--kf-primary)", textDecoration: "underline" }}>{children}</a>,
            h2: ({children}) => <h2 style={{ fontSize: 18, fontWeight: 800, margin: "24px 0 8px" }}>{children}</h2>,
            ul: ({children}) => <ul style={{ paddingLeft: 20, margin: "8px 0" }}>{children}</ul>,
            li: ({children}) => <li style={{ margin: "4px 0" }}>{children}</li>,
            p: ({children}) => <p style={{ margin: "8px 0" }}>{children}</p>,
            strong: ({children}) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
          }}>{article.body}</ReactMarkdown>
        </div>
        {related && related.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>関連記事</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {related.map((r: any) => (
                <Link key={r.slug} href={`/goods/${r.slug}`} className="kf-card" style={{ padding: 14, textDecoration: "none", color: "var(--kf-text)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>おすすめ商品をチェック</h2>
          <RakutenItems keyword={RAKUTEN_KW[article.category] || article.category} />
        </div>
        <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 24 }}>※本ページはアフィリエイトプログラムを利用した商品紹介を含みます。価格・在庫は各販売サイトでご確認ください。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
