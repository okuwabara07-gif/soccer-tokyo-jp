import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import ReactMarkdown from "react-markdown";

export const revalidate = 3600;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from("articles").select("title,excerpt").eq("slug", slug).single();
  return { title: data ? `${data.title} | サッカー育成コラム` : "コラム", description: data?.excerpt || "" };
}

export default async function ColumnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: article } = await supabase.from("articles").select("*").eq("slug", slug).eq("status", "published").single();
  if (!article) {
    return (
      <div style={{ background: "var(--kf-bg)", minHeight: "100vh" }}><Header />
        <main className="kf-container" style={{ padding: "40px 16px", maxWidth: 760, textAlign: "center" }}>
          <div className="kf-empty"><div className="kf-empty__title">記事が見つかりません</div></div>
          <Link href="/column" style={{ color: "var(--kf-primary)" }}>← 育成コラムへ戻る</Link>
        </main><SiteFooter /><BottomNav />
      </div>
    );
  }
  const { data: related } = await supabase.from("articles").select("slug,title,category")
    .eq("category", article.category).eq("status", "published").neq("slug", slug).limit(4);

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 760 }}>
        <Link href="/column" style={{ fontSize: 13, color: "var(--kf-muted)", textDecoration: "none" }}>← 育成コラム一覧へ</Link>
        <div style={{ margin: "12px 0 4px" }}><span className="kf-badge">{article.category}</span></div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.4 }}>{article.title}</h1>
        <div className="kf-article-body" style={{ fontSize: 15, lineHeight: 2 }}>
          <ReactMarkdown components={{
            h2: ({children}) => <h2 style={{ fontSize: 18, fontWeight: 800, margin: "24px 0 8px" }}>{children}</h2>,
            ul: ({children}) => <ul style={{ paddingLeft: 20, margin: "8px 0" }}>{children}</ul>,
            li: ({children}) => <li style={{ margin: "4px 0" }}>{children}</li>,
            p: ({children}) => <p style={{ margin: "8px 0" }}>{children}</p>,
            strong: ({children}) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
          }}>{article.body}</ReactMarkdown>
        </div>
        <div className="kf-card" style={{ padding: 20, marginTop: 28, background: "var(--kf-primary-soft)", border: "none" }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>あわせて使えます</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/foot-check" className="kf-btn kf-btn--primary" style={{ padding: "10px 18px" }}>足型診断でスパイクを探す</Link>
            <Link href="/teams" className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px" }}>チームを探す</Link>
            <Link href="/selection" className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px" }}>セレクション情報</Link>
          </div>
        </div>
        {related && related.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>関連コラム</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {related.map((r: any) => (
                <Link key={r.slug} href={`/column/${r.slug}`} className="kf-card" style={{ padding: 14, textDecoration: "none", color: "var(--kf-text)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 24 }}>※本コラムは一般的な情報提供を目的としています。個別の判断は各専門家・所属チームにご確認ください。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
