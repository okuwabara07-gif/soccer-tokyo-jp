import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AFFILIATE_ID = "5253b9ed.08f9d938.5253b9ee.e71aefe8";

const PATHS = [
  "/services/api/IchibaItem/Search/20220601",
  "/api/IchibaItem/Search/20220601",
  "/services/api/IchibaItem/Search/20170706",
  "/ichiba/api/IchibaItem/Search/20220601",
  "/IchibaItem/Search/20220601",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "スパイク";
  const hits = searchParams.get("hits") || "6";
  const probe = searchParams.get("probe");
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!appId || !accessKey) return NextResponse.json({ items: [], reason: "no_env" });

  const qs = `format=json&applicationId=${appId}&accessKey=${accessKey}&affiliateId=${AFFILIATE_ID}&keyword=${encodeURIComponent(keyword)}&hits=${hits}`;

  // probeモード: 全パスを試してどれが成功するか報告
  if (probe) {
    const results: any[] = [];
    for (const p of PATHS) {
      try {
        const r = await fetch(`https://openapi.rakuten.co.jp${p}?${qs}`, { cache: "no-store" });
        const t = await r.text();
        results.push({ path: p, status: r.status, head: t.slice(0, 80) });
      } catch (e: any) { results.push({ path: p, error: String(e) }); }
    }
    return NextResponse.json({ results });
  }

  // 通常: 最初に成功したパスを使う
  for (const p of PATHS) {
    try {
      const r = await fetch(`https://openapi.rakuten.co.jp${p}?${qs}`, { cache: "no-store" });
      if (!r.ok) continue;
      const data = await r.json();
      if (!data.Items) continue;
      const items = data.Items.map((w: any) => {
        const i = w.Item || w;
        return { name: i.itemName, price: i.itemPrice, url: i.affiliateUrl || i.itemUrl,
          image: i.mediumImageUrls?.[0]?.imageUrl?.replace("?_ex=128x128", "?_ex=300x300") || "",
          shop: i.shopName, reviewCount: i.reviewCount, reviewAverage: i.reviewAverage };
      });
      return NextResponse.json({ items, usedPath: p });
    } catch { continue; }
  }
  return NextResponse.json({ items: [] });
}
