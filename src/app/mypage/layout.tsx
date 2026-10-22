import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/mypage",
  "マイページ | サッカーセレクション",
  "サッカーセレクションのマイページ。",
  { noindex: true }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
