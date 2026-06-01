import { NextResponse } from "next/server";

const AFFILIATE_ID = "5253b9ed.08f9d938.5253b9ee.e71aefe8";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "";
  const hits = searchParams.get("hits") || "6";
  const appId = process.env.RAKUTEN_APP_ID;
  if (!appId || !keyword) return NextResponse.json({ items: [] });

  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?applicationId=${appId}&affiliateId=${AFFILIATE_ID}&keyword=${encodeURIComponent(keyword)}&hits=${hits}&sort=-reviewCount&imageFlag=1&availability=1`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    const items = (data.Items || []).map((w: any) => {
      const i = w.Item;
      return {
        name: i.itemName,
        price: i.itemPrice,
        url: i.affiliateUrl || i.itemUrl,
        image: i.mediumImageUrls?.[0]?.imageUrl?.replace("?_ex=128x128", "?_ex=300x300") || "",
        shop: i.shopName,
        reviewCount: i.reviewCount,
        reviewAverage: i.reviewAverage,
      };
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
