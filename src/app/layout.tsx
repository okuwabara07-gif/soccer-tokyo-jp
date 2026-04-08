import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "サッカー東京・神奈川・埼玉・千葉 | 関東ジュニアサッカー情報局",
  description: "東京・神奈川・埼玉・千葉のジュニアサッカーチーム検索・セレクション情報・AI足型診断・栄養アドバイス",
  manifest: "/manifest.json",
  themeColor: "#0a0a0a",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "サッカー関東" },
};

export const viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={geistSans.variable}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3460729726810386" crossorigin="anonymous"></script>
        <link rel="apple-touch-icon" href="/icon-192.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      </head>
      <body style={{margin:0,padding:0}}>{children}</body>
    </html>
  );
}
