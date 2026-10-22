import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/admin",
  "管理画面 | サッカーセレクション",
  "管理画面",
  { noindex: true }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
