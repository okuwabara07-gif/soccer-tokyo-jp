import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/matching",
  "チームマッチング｜子どもに合うサッカークラブを探す | サッカーセレクション",
  "地域・レベル・練習頻度などの条件から、関東・関西のジュニアサッカークラブを探せます。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
