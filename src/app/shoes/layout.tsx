import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/shoes",
  "ジュニア向けスパイク・シューズの選び方 | サッカーセレクション",
  "子ども用サッカースパイク・トレーニングシューズの選び方と、タイプ別のおすすめを紹介します。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
