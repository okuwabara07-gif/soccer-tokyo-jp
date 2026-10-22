import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/foot-camera",
  "AI足型診断（撮影） | サッカーセレクション",
  "足を撮影してAIが足型の特徴を判定します。",
  { noindex: true }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
