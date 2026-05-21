/* ============================================================
   components/legal/index.tsx
   法務ページ共通コンポーネント

   設計:
   ・サーバーコンポーネント(useState 不要)
   ・配色は Tailwind 任意値[]で記述・tailwind.config 編集不要
   ・フォントは style 属性で指定(Tailwindのfont-XXX任意値は不安定なため)
   ・絵文字なし・記号は最小限(› ▼ など)

   配色: 深紺 #0B1F3A / 黄 #FFD000 / 緑 #16A34A / 赤 #c8392b /
        LINE緑 #06C755 / 背景 #f4f1ea
   フォント: Noto Serif JP / Noto Sans JP / Inter / JetBrains Mono
   ============================================================ */

import { ReactNode } from "react";

const FONT_SERIF = '"Noto Serif JP", serif';
const FONT_SANS = '"Noto Sans JP", sans-serif';
const FONT_LATIN = '"Inter", sans-serif';
const FONT_MONO = '"JetBrains Mono", monospace';

/* ------------------------------------------------------------
   LegalShell — 法務ページ全体ラッパー
   背景クリーム + max-width 制限 + パディング
   ------------------------------------------------------------ */
export function LegalShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <div className="mx-auto max-w-[640px] px-[18px] pb-[28px] md:max-w-[768px] md:px-8 md:pb-10">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   LegalPageHeader — ページヘッダ(雑誌的タイトル)
   ------------------------------------------------------------ */
export function LegalPageHeader({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="pb-2 pt-1">
      <div className="border-b border-[#0B1F3A]/20 pb-3.5 pt-[22px]">
        <div
          className="mb-2.5 text-[10px] tracking-[0.16em] text-[#0B1F3A]/50"
          style={{ fontFamily: FONT_MONO }}
        >
          SOCCER SELECTION · {kicker}
        </div>
        <h1
          className="text-[28px] font-extrabold leading-[1.35] text-[#0B1F3A]"
          style={{ fontFamily: FONT_SERIF }}
        >
          {title}
        </h1>
        {sub && (
          <p
            className="mt-2 text-[13px] leading-[1.75] text-[#0B1F3A]/70"
            style={{ fontFamily: FONT_SANS }}
          >
            {sub}
          </p>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------
   LegalSectionHead — セクション見出し
   ------------------------------------------------------------ */
export function LegalSectionHead({
  num,
  label,
  title,
  fig,
}: {
  num: string;
  label?: string;
  title: string;
  fig?: string;
}) {
  return (
    <div className="mb-4.5 border-t border-[#0B1F3A]/20 pb-[18px] pt-7">
      <div
        className="mb-3 flex items-baseline justify-between text-[10px] tracking-[0.08em] text-[#0B1F3A]/50"
        style={{ fontFamily: FONT_MONO }}
      >
        <span>SECTION {num}</span>
        {fig && <span>FIG. {fig}</span>}
      </div>
      {label && (
        <div
          className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#c8392b]"
          style={{ fontFamily: FONT_LATIN }}
        >
          {label}
        </div>
      )}
      <div
        className="text-[22px] font-bold leading-[1.45] text-[#0B1F3A]"
        style={{ fontFamily: FONT_SERIF }}
      >
        {title}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   LegalBody — 本文段落
   ------------------------------------------------------------ */
export function LegalBody({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-3.5 text-[13px] leading-[1.95] text-[#0B1F3A]"
      style={{ fontFamily: FONT_SANS }}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------
   LegalRow — テーブル形式の行(ラベル + 値)
   ------------------------------------------------------------ */
export function LegalRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-3 border-b border-[#0B1F3A]/8 py-3">
      <div
        className="text-[11px] font-bold tracking-[0.04em] text-[#0B1F3A]/70"
        style={{ fontFamily: FONT_SANS }}
      >
        {label}
      </div>
      <div
        className="text-[13px] leading-[1.7] text-[#0B1F3A]"
        style={{ fontFamily: FONT_SANS }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   LegalTable — Row群を白カード内に表示
   ------------------------------------------------------------ */
export function LegalTable({ children }: { children: ReactNode }) {
  return (
    <div className="border border-[#0B1F3A]/20 bg-white px-4 pb-2 pt-1">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------
   LegalList — 箇条書き(番号付き)
   ------------------------------------------------------------ */
export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="my-2 mb-3.5 list-none p-0">
      {items.map((it, i) => (
        <li
          key={i}
          className="mb-1.5 grid grid-cols-[24px_1fr] gap-2 text-[13px] leading-[1.85] text-[#0B1F3A]"
          style={{ fontFamily: FONT_SANS }}
        >
          <span
            className="pt-1 text-[10px] tracking-[0.04em] text-[#c8392b]"
            style={{ fontFamily: FONT_MONO }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------
   LegalNote — 注記ブロック(navy/red/green)
   ------------------------------------------------------------ */
export function LegalNote({
  tone = "navy",
  children,
}: {
  tone?: "navy" | "red" | "green";
  children: ReactNode;
}) {
  const palette = {
    navy: { bg: "bg-[#0B1F3A]/5", bd: "border-[#0B1F3A]", fg: "text-[#0B1F3A]" },
    red: { bg: "bg-[#c8392b]/10", bd: "border-[#c8392b]", fg: "text-[#c8392b]" },
    green: { bg: "bg-[#16A34A]/10", bd: "border-[#16A34A]", fg: "text-[#16A34A]" },
  }[tone];
  return (
    <div
      className={`my-3.5 border-l-[3px] px-3.5 py-3 text-[12px] leading-[1.75] ${palette.bg} ${palette.bd} ${palette.fg}`}
      style={{ fontFamily: FONT_SANS }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------
   LegalCTA — CTAボタン(主・副)
   ------------------------------------------------------------ */
export function LegalCTA({
  primary,
  secondary,
  primaryHref,
  secondaryHref,
}: {
  primary?: string;
  secondary?: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  return (
    <div className="mb-7 mt-6 flex flex-col gap-2.5">
      {primary && (
        <a
          href={primaryHref || "#"}
          className="block bg-[#0B1F3A] px-4 py-3.5 text-center text-[14px] font-bold tracking-[0.04em] text-white no-underline"
          style={{ fontFamily: FONT_SANS }}
        >
          {primary}
        </a>
      )}
      {secondary && (
        <a
          href={secondaryHref || "#"}
          className="block border border-[#0B1F3A] bg-transparent px-4 py-[13px] text-center text-[14px] font-semibold tracking-[0.04em] text-[#0B1F3A] no-underline"
          style={{ fontFamily: FONT_SANS }}
        >
          {secondary}
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   LegalRevisedAt — 更新日表記
   ------------------------------------------------------------ */
export function LegalRevisedAt({ date }: { date: string }) {
  return (
    <div
      className="mb-2 mt-7 text-right text-[10px] tracking-[0.12em] text-[#0B1F3A]/50"
      style={{ fontFamily: FONT_MONO }}
    >
      LAST UPDATED · {date}
    </div>
  );
}

export { FONT_SERIF, FONT_SANS, FONT_LATIN, FONT_MONO };
