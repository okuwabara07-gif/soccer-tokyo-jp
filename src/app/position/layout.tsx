import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/position",
  "ポジション別資料｜GK・DF・MF・FWの役割と動き | サッカーセレクション",
  "ジュニアサッカーの各ポジションの役割、求められる動き、練習のポイントを分かりやすく解説します。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
