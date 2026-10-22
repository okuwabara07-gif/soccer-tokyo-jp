import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/member",
  "プレミアム会員 | サッカーセレクション",
  "締切リマインド・地図検索・お気に入り無制限・PDF保存などが使えるプレミアム会員のご案内。月額500円・年額4,980円、いつでも解約できます。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
