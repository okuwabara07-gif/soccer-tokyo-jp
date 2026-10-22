import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/rules",
  "サッカーの新ルール・用語集｜ジュニア向けに解説 | サッカーセレクション",
  "少年サッカーで知っておきたいルールと用語を、保護者にも分かりやすく検索・解説できる用語集です。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
