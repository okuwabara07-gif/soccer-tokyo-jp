import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/body-check",
  "体格診断｜身長・体重から合うポジションの目安 | サッカーセレクション",
  "子どもの身長・体重などから、サッカーで活かしやすいポジションの目安を提案する無料の体格診断です。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
