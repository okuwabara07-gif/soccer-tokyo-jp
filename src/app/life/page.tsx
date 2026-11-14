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

const LP_LOG = `(function(){try{var u=(location.search.match(/utm_source=([^&]+)/)||[])[1]||"";var b=JSON.stringify({e:"view",m:"lp",ref:document.referrer||"",utm:decodeURIComponent(u)});var ok=false;try{ok=!!(navigator.sendBeacon&&navigator.sendBeacon("/api/life/log",new Blob([b],{type:"application/json"})))}catch(_){}if(!ok)fetch("/api/life/log",{method:"POST",headers:{"Content-Type":"application/json"},body:b,keepalive:true}).catch(function(){});}catch(_){}})();`;

export default function LifePage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: LP_HTML }} />
      {/* 紹介ページを開いた回数を life_plays に記録する（/api/life/log） */}
      <script dangerouslySetInnerHTML={{ __html: LP_LOG }} />
    </>
  );
}
