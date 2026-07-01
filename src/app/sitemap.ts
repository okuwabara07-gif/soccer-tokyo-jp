import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: teams } = await supabase
    .from("teams")
    .select("id, updated_at")
    .eq("is_published", true)
    .limit(50000);

  const teamUrls = (teams || []).map((team) => ({
    url: `https://soccer-selection.jp/teams/${team.id}`,
    lastModified: team.updated_at ? new Date(team.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://soccer-selection.jp",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://soccer-selection.jp/teams",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...teamUrls,
  ];
}
