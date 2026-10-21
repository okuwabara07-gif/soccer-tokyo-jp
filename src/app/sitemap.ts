import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = "https://soccer-selection.jp";

// 旧 teams テーブル（/teams/{uuid}）は使用しない。
// 掲載するのは「実在確定の clubs のうち独自情報があるもの」＋コラム＋静的ページのみ。
// clubs/[slug] の robots 判定（isIndexable）と条件を揃えること。
export const revalidate = 3600;

type ClubRow = {
  slug: string;
  selection_count: number | null;
  official_url: string | null;
  instagram: string | null;
};

async function fetchAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>) {
  const out: T[] = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await build(from, from + size - 1);
    if (error || !data || data.length === 0) break;
    out.push(...data);
    if (data.length < size) break;
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const clubRows = await fetchAll<ClubRow>((from, to) =>
    supabase
      .from("v_page_club")
      .select("slug, selection_count, official_url, instagram")
      .eq("is_published", true)
      .range(from, to)
  );
  const clubSlugs = new Set<string>();
  for (const c of clubRows) {
    if ((c.selection_count ?? 0) > 0 || c.official_url || c.instagram) clubSlugs.add(c.slug);
  }

  const articles = await fetchAll<{ slug: string; updated_at: string | null; published_at: string | null }>((from, to) =>
    supabase
      .from("articles")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .range(from, to)
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/selection`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/clubs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/calendar`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/books/oyako-soccer-note`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/company`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const clubPages: MetadataRoute.Sitemap = [...clubSlugs].map((slug) => ({
    url: `${BASE}/clubs/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/column/${a.slug}`,
    lastModified: new Date(a.updated_at || a.published_at || now),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...clubPages, ...articlePages];
}
