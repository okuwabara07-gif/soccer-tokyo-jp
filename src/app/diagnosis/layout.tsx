import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/diagnosis",
  "チーム診断 | サッカーセレクション",
  "いくつかの質問に答えるだけで、関東・関西のジュニアサッカークラブから合いそうなタイプを提案します。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
