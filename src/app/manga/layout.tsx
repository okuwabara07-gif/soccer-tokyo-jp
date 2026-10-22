import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/manga",
  "サッカー少年に読ませたい漫画TOP5｜ポジション別に紹介 | サッカーセレクション",
  "サッカーをする子どもに読ませたい漫画を、FW・MF・DF・保護者向けなど目的別に紹介します。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
