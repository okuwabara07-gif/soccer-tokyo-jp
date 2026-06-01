import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 3600;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const metadata = {
  title: "サッカー育成コラム | 上達・セレクション・進路の考え方",
  description: "ジュニアサッカーの上達・セレクション準備・ポジション・メンタル・進路の考え方を保護者向けに解説するコラムです。",
};

export default async function ColumnPage() {
  const { data: articles } = await supabase.from("articles")
    .select("slug,title,excerpt,category,published_at").eq("status", "published")
    .order("published_at", { ascending: false });
  const cats = [...new Set((articles || []).map((a: any) => a.category))];

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>育成コラム</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 20px" }}>上達・セレクション・ポジション・メンタル・進路の考え方を保護者向けに解説します。</p>
        {cats.map(cat => (
          <section key={cat} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px", color: "var(--kf-primary)" }}>{cat}</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {(articles || []).filter((a: any) => a.category === cat).map((a: any) => (
                <Link key={a.slug} href={`/column/${a.slug}`} className="kf-card" style={{ padding: 16, textDecoration: "none", color: "var(--kf-text)" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{a.title}</div>
                  {a.excerpt && <div style={{ fontSize: 12, color: "var(--kf-muted)", lineHeight: 1.6 }}>{a.excerpt}</div>}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
