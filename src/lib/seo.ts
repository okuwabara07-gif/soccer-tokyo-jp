import type { Metadata } from "next";

export const SITE_URL = "https://soccer-selection.jp";
export const SITE_NAME = "サッカーセレクション";

/** 各ページ固有の title / description / canonical を返す。canonical は必ずそのページ自身を指す。 */
export function pageMeta(
  path: string,
  title: string,
  description: string,
  opts: { noindex?: boolean } = {}
): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "website", locale: "ja_JP" },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
