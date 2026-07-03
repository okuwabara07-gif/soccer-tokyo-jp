import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://soccer-selection.jp"),
  title: "サッカーセレクション | 関東のジュニアチーム検索・セレクション情報",
  description: "関東のジュニアサッカーチーム・セレクション情報を検索。チーム選びに役立つ情報を提供する総合サッカー情報サイト。",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "サッカーセレクション" },
};

export const viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={geistSans.variable}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3460729726810386" crossOrigin="anonymous"></script>
        <link rel="apple-touch-icon" href="/icon-192.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      </head>
      <body style={{margin:0,padding:0}}>{children}</body>
    </html>
  );
}
