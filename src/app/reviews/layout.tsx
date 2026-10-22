import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/reviews",
  "保護者の口コミ｜ジュニアサッカークラブの評判 | サッカーセレクション",
  "送迎負担・雰囲気・育成・費用感など、ジュニアサッカークラブに関する保護者の口コミを掲載します（個人の感想です）。",
  // 口コミが集まるまでは空ページ扱いを避けるため noindex。件数が揃ったら外す。
  { noindex: true }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
