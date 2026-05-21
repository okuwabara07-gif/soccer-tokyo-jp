/* ============================================================
   components/SiteFooter.tsx
   サイトフッター — 法務ページ5本へのリンク

   既存のフッターがある場合: このコンポーネントの footer 内の
   <nav> 部分(LEGAL/SERVICES/ACCOUNT)だけを参考に流用してください。

   既存フッターがない場合: layout.tsx で本コンポーネントを
   {children}の後に配置すれば即適用されます。
   ============================================================ */

import Link from "next/link";

const FONT_SERIF = '"Noto Serif JP", serif';
const FONT_SANS = '"Noto Sans JP", sans-serif';
const FONT_LATIN = '"Inter", sans-serif';
const FONT_MONO = '"JetBrains Mono", monospace';

const LINKS = {
  legal: [
    { href: "/company", label: "運営者情報" },
    { href: "/privacy", label: "プライバシーポリシー" },
    { href: "/terms", label: "利用規約" },
    { href: "/tokushoho", label: "特定商取引法に基づく表記" },
    { href: "/contact", label: "お問合せ" },
  ],
  services: [
    { href: "/", label: "ホーム" },
    { href: "/search", label: "チームを探す" },
    { href: "/selection", label: "セレクション情報" },
    { href: "/ai", label: "AI診断" },
    { href: "/plan", label: "料金プラン" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="mt-12 bg-[#0B1F3A] px-6 pb-6 pt-10 text-white md:px-12 md:pb-6 md:pt-10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-[2fr_1fr_1fr]">
        {/* ブランド */}
        <div>
          <div
            className="mb-1.5 text-[10px] font-bold tracking-[0.16em] text-[#FFD000]"
            style={{ fontFamily: FONT_LATIN }}
          >
            SOCCER SELECTION
          </div>
          <div
            className="mb-3 text-[20px] font-extrabold text-white"
            style={{ fontFamily: FONT_SERIF }}
          >
            サッカーセレクション
          </div>
          <p
            className="text-[12px] leading-[1.85] text-white/70"
            style={{ fontFamily: FONT_SANS }}
          >
            関東4都県のジュニアサッカー保護者と子どもたちのための、独立系情報プラットフォーム。
          </p>
        </div>

        {/* SERVICES */}
        <div>
          <div
            className="mb-3 text-[10px] tracking-[0.16em] text-[#FFD000]"
            style={{ fontFamily: FONT_MONO }}
          >
            SERVICES
          </div>
          <ul className="list-none p-0">
            {LINKS.services.map((l) => (
              <li key={l.href} className="py-1">
                <Link
                  href={l.href}
                  className="text-[12px] text-white/70 no-underline hover:text-white"
                  style={{ fontFamily: FONT_SANS }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* LEGAL · INFO */}
        <div>
          <div
            className="mb-3 text-[10px] tracking-[0.16em] text-[#FFD000]"
            style={{ fontFamily: FONT_MONO }}
          >
            INFO · LEGAL
          </div>
          <ul className="list-none p-0">
            {LINKS.legal.map((l) => (
              <li key={l.href} className="py-1">
                <Link
                  href={l.href}
                  className="text-[12px] text-white/70 no-underline hover:text-white"
                  style={{ fontFamily: FONT_SANS }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1200px] flex-col items-start justify-between gap-2 border-t border-white/10 pt-5 md:flex-row md:items-center">
        <div
          className="text-[10px] tracking-[0.12em] text-white/50"
          style={{ fontFamily: FONT_MONO }}
        >
          © 2026 AOKAE LLC · SOCCER SELECTION
        </div>
        <div
          className="text-[11px] text-white/50"
          style={{ fontFamily: FONT_SANS }}
        >
          本サイトはアフィリエイトプログラムにより収益を得ています
        </div>
      </div>
    </footer>
  );
}
