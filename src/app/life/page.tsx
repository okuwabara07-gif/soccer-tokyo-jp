import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LP_HTML } from "./lp-html";

const base = pageMeta(
  "/life",
  "4.5万分の1｜サッカー人生シミュレーター | サッカーセレクション",
  "小学生のサッカー登録選手は1学年約4.5万人。その中の1人として、年長から70歳までのサッカー人生を5分で生きる無料シミュレーター。JFA登録者数などの公開統計と照合済み。"
);

export const metadata: Metadata = {
  ...base,
  openGraph: { ...base.openGraph, images: [{ url: "/life/og.png", width: 1200, height: 630, alt: "4.5万分の1 サッカー人生シミュレーター" }] },
  twitter: { card: "summary_large_image", images: ["/life/og.png"] },
};

export default function LifePage() {
  return <div dangerouslySetInnerHTML={{ __html: LP_HTML }} />;
}
