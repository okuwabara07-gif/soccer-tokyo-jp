import { pageMeta } from "@/lib/seo";
import { GOODS_CATEGORIES } from "@/lib/goodsCategories";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: raw } = await params;
  const category = decodeURIComponent(raw);
  const cat = GOODS_CATEGORIES.find(c => c.key === category);
  const path = `/goods/c/${encodeURIComponent(category)}`;
  if (!cat) return pageMeta(path, "準備・グッズ | サッカーセレクション", "", { noindex: true });
  return pageMeta(path, `${cat.title}｜ジュニアサッカーの準備・グッズ | サッカーセレクション`, cat.desc);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
