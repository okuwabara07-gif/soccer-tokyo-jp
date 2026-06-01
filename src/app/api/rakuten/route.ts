import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword')?.trim();
  if (!keyword) return NextResponse.json({ items: [] });

  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APP_ID!,
    accessKey: process.env.RAKUTEN_ACCESS_KEY!,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID ?? '',
    keyword,
    hits: '4',
    sort: '-reviewCount',
    format: 'json',
  });

  const res = await fetch(
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601?${params}`,
    {
      headers: {
        Origin: 'https://soccer-selection.jp',
        Referer: 'https://soccer-selection.jp',
      },
      next: { revalidate: 86400 },
    }
  );
  if (!res.ok) return NextResponse.json({ items: [] });

  const data = await res.json();
  const items = (data.Items ?? []).map((w: any) => {
    const i = w.Item;
    return {
      name: i.itemName,
      price: i.itemPrice,
      image: i.mediumImageUrls?.[0]?.imageUrl?.replace('_ex=128x128', '_ex=300x300'),
      review: i.reviewAverage,
      reviewCount: i.reviewCount,
      shop: i.shopName,
      url: i.affiliateUrl || i.itemUrl,
    };
  });
  return NextResponse.json({ items });
}
