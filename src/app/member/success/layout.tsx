import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/member/success",
  "登録完了 | サッカーセレクション",
  "プレミアム会員の登録が完了しました。",
  { noindex: true }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
