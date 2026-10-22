import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/calendar",
  "セレクション年間カレンダー｜ジュニアユース・ジュニアの時期の目安 | サッカーセレクション",
  "関東・関西のジュニアユース・ジュニアのセレクションや練習会が例年いつ行われるかを月別にまとめた年間カレンダーです。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
