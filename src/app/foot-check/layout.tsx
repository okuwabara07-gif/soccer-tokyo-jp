import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/foot-check",
  "AI足型診断｜子どもの足に合うスパイク選び | サッカーセレクション",
  "足の形や幅の特徴をAIが判定し、ジュニア向けスパイク選びの目安を提案する無料の足型診断です。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
