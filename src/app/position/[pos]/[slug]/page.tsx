import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { POSITION_VIDEOS, POSITION_LABEL, findVideo, videosByPos, videoPath } from "@/lib/positionVideos";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSITION_VIDEOS.map((v) => ({ pos: v.pos, slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pos: string; slug: string }> }) {
  const { pos, slug } = await params;
  const v = findVideo(pos, slug);
  if (!v) return {};
  const meta = pageMeta(videoPath(v), `${v.title}【動画で解説】 | サッカーセレクション`, v.description);
  return { ...meta, openGraph: { ...meta.openGraph, images: [{ url: `${SITE_URL}${v.poster}`, width: 1080, height: 1920 }] } };
}

const ACCENT: Record<string, string> = { gk: "#2b9348", df: "#1d3557", mf: "#e9a000", fw: "#e63946" };

export default async function PositionVideoPage({ params }: { params: Promise<{ pos: string; slug: string }> }) {
  const { pos, slug } = await params;
  const v = findVideo(pos, slug);
  if (!v) notFound();
  const C = ACCENT[v.pos];
  const others = POSITION_VIDEOS.filter((o) => o !== v);
  const same = videosByPos(v.pos).filter((o) => o !== v);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: v.title,
      description: v.description,
      thumbnailUrl: [`${SITE_URL}${v.poster}`],
      uploadDate: v.uploadDate,
      duration: `PT${v.durationSec}S`,
      contentUrl: `${SITE_URL}${v.video}`,
      inLanguage: "ja",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "トップ", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "ポジション別資料", item: `${SITE_URL}/position` },
        { "@type": "ListItem", position: 3, name: v.title, item: `${SITE_URL}${videoPath(v)}` },
      ],
    },
  ];

  return (
    <div style={{ background: "var(--kf-bg,#f7f8fa)", minHeight: "100vh", color: "var(--kf-text,#1a1a1a)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="kf-container" style={{ padding: "16px 16px 56px", maxWidth: 760 }}>
        <nav style={{ fontSize: 12, color: "var(--kf-muted,#888)", marginBottom: 10 }}>
          <Link href="/position" style={{ color: "inherit", textDecoration: "none" }}>ポジション別資料</Link>
          {" ＞ "}
          <span>{POSITION_LABEL[v.pos]}</span>
        </nav>
        <span style={{ display: "inline-block", fontSize: 12, fontWeight: 800, color: "#fff", background: C, borderRadius: 999, padding: "3px 12px" }}>
          {POSITION_LABEL[v.pos]}・動画で解説
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.4, margin: "10px 0 10px" }}>{v.title}</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, margin: "0 0 16px" }}>{v.lead}</p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <video
            src={v.video}
            poster={v.poster}
            controls
            playsInline
            muted
            loop
            preload="metadata"
            style={{ width: "100%", maxWidth: 380, aspectRatio: "9/16", borderRadius: 16, background: "#0b1a2a", display: "block" }}
          />
        </div>
        <p style={{ fontSize: 11, color: "#999", textAlign: "center", margin: "0 0 24px" }}>
          {v.durationSec}秒・音声なし。3DのCGで動きを簡略化して表現しています。
        </p>

        <h2 style={{ fontSize: 19, fontWeight: 900, margin: "0 0 12px" }}>3つのポイント</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {v.points.map((p) => (
            <section key={p.heading} className="kf-card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px", color: C }}>{p.heading}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0 }}>{p.body}</p>
              {p.ng && (
                <p style={{ fontSize: 13, lineHeight: 1.8, margin: "10px 0 0", background: "#fff3f3", borderRadius: 8, padding: "8px 10px" }}>
                  <strong style={{ color: "#e23b3b" }}>よくある失敗：</strong>{p.ng}
                </p>
              )}
            </section>
          ))}
        </div>

        <h2 style={{ fontSize: 19, fontWeight: 900, margin: "28px 0 12px" }}>家や公園でできる練習</h2>
        <div className="kf-card" style={{ padding: 16 }}>
          {v.practice.map((p, i) => (
            <div key={p.name} style={{ padding: "10px 0", borderTop: i ? "1px solid #f0f0f0" : "none" }}>
              <p style={{ fontSize: 14, fontWeight: 800, margin: "0 0 4px" }}>{p.name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, color: "#555" }}>{p.how}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 19, fontWeight: 900, margin: "28px 0 12px" }}>保護者の方へ</h2>
        <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0 }}>{v.parentNote}</p>
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.8, margin: "12px 0 0" }}>
          ※ここで紹介しているのは一般的な考え方です。チームの戦術やコーチの指示がある場合は、そちらを優先してください。
        </p>

        {(same.length > 0 || others.length > 0) && (
          <>
            <h2 style={{ fontSize: 19, fontWeight: 900, margin: "28px 0 12px" }}>ほかの動画</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[...same, ...others].map((o) => (
                <Link key={o.slug} href={videoPath(o)} className="kf-card" style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
                  <img src={o.poster} alt={o.title} style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block", maxHeight: 220 }} />
                  <div style={{ padding: "8px 10px" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: ACCENT[o.pos] }}>{POSITION_LABEL[o.pos]}</span>
                    <p style={{ fontSize: 13, fontWeight: 800, margin: "2px 0 0", lineHeight: 1.4 }}>{o.short}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="kf-card" style={{ padding: 20, marginTop: 28, borderRadius: 16, background: "linear-gradient(135deg,#0a3d62,#1a6ba0)" }}>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>練習会・セレクションの情報を探す</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: "0 0 14px" }}>関東・関西のジュニアユースの募集情報をまとめています</p>
          <Link href="/selection" style={{ display: "block", padding: 12, borderRadius: 12, background: "#4CAF50", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
            募集中のセレクションを見る →
          </Link>
        </div>
        <p style={{ marginTop: 20 }}>
          <Link href="/position" style={{ fontSize: 13, color: C, fontWeight: 700, textDecoration: "none" }}>← ポジション別資料へ戻る</Link>
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
