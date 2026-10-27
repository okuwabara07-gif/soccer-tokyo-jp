import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/calendar",
  "セレクション年間カレンダー｜ジュニアユース・ジュニアの時期の目安 | サッカーセレクション",
  "2026年度に掲載したセレクション・練習会の実際の開催日を月別に集計。Jリーグ下部組織と街クラブの時期の違い、月ごとの開催クラブ一覧、小6からの動き方をまとめています。"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
