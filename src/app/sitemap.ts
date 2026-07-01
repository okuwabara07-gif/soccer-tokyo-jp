import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 全公開チームをページネーションで取得(PostgRESTの既定1000行上限を回避)
  let all: { id: string; updated_at: string | null }[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("teams")
      .select("id, updated_at")
      .eq("is_published", true)
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < pageSize) break;
  }

  const teamUrls: MetadataRoute.Sitemap = all.map((team) => ({
    url: `https://soccer-selection.jp/teams/${team.id}`,
    lastModified: team.updated_at ? new Date(team.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://soccer-selection.jp",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://soccer-selection.jp/teams",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...teamUrls,
  ];
}
