import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/nutrition",
  "サッカーをする子どもの栄養・補食ガイド | サッカーセレクション",
  "練習や試合の前後に何を食べるとよいか、成長期のサッカー選手の栄養と補食の基本をまとめました。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
