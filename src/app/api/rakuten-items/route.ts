import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AFFILIATE_ID = "5253b9ed.08f9d938.5253b9ee.e71aefe8";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "";
  const hits = searchParams.get("hits") || "6";
  const debug = searchParams.get("debug");
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (debug === "env") {
    return NextResponse.json({
      hasAppId: !!appId, appIdLen: appId?.length || 0,
      hasAccessKey: !!accessKey, accessKeyLen: accessKey?.length || 0,
      accessKeyHead: accessKey?.slice(0, 3) || "",
    });
  }
  if (!appId || !accessKey || !keyword) return NextResponse.json({ items: [], reason: "missing" });

  const url = `https://openapi.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}&affiliateId=${AFFILIATE_ID}&keyword=${encodeURIComponent(keyword)}&hits=${hits}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    if (debug === "raw") return new NextResponse(text, { headers: { "content-type": "application/json" } });
    const data = JSON.parse(text);
    const items = (data.Items || []).map((w: any) => {
      const i = w.Item || w;
      return { name: i.itemName, price: i.itemPrice, url: i.affiliateUrl || i.itemUrl,
        image: i.mediumImageUrls?.[0]?.imageUrl?.replace("?_ex=128x128", "?_ex=300x300") || "",
        shop: i.shopName, reviewCount: i.reviewCount, reviewAverage: i.reviewAverage };
    });
    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: String(e) });
  }
}
