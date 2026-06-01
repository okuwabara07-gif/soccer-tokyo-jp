"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { GOODS_CATEGORIES } from "@/lib/goodsCategories";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const PAGE = 12;

export default function GoodsCategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(String(params.category || ""));
  const meta = GOODS_CATEGORIES.find(c => c.key === category);
  const [articles, setArticles] = useState<any[]>([]);
  const [limit, setLimit] = useState(PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("goods_articles").select("id,slug,title,excerpt,category")
      .eq("status", "published").eq("category", category).order("published_at", { ascending: false })
      .then(({ data }) => { setArticles(data ?? []); setLoading(false); });
  }, [category]);

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 900 }}>
        <Link href="/goods" style={{ fontSize: 13, color: "var(--kf-muted)", textDecoration: "none" }}>← グッズガイドへ戻る</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 4px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{meta?.title || category}</h1>
          <span className="kf-pr-label">PR</span>
        </div>
        {meta && <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 18px" }}>{meta.desc}</p>}

        {loading ? <div style={{ padding: 24, color: "var(--kf-muted)" }}>読み込み中…</div>
          : articles.length === 0 ? (
            <div className="kf-empty"><div className="kf-empty__title">記事を準備中です</div><div className="kf-empty__hint">{meta?.title}の記事は順次公開します。</div></div>
          ) : (
            <>
              <div style={{ display: "grid", gap: 12 }}>
                {articles.slice(0, limit).map(a => (
                  <Link key={a.id} href={`/goods/${a.slug}`} className="kf-card" style={{ padding: 16, textDecoration: "none", color: "var(--kf-text)", display: "block" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{a.title}</div>
                    <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "6px 0 0", lineHeight: 1.6 }}>{a.excerpt}</p>
                  </Link>
                ))}
              </div>
              {limit < articles.length && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button onClick={() => setLimit(l => l + PAGE)} className="kf-btn kf-btn--ghost" style={{ padding: "12px 28px" }}>もっと見る（残り{articles.length - limit}件）</button>
                </div>
              )}
            </>
          )}
        <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 20 }}>※アフィリエイトを含みます。価格・在庫は各販売サイトでご確認ください。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
