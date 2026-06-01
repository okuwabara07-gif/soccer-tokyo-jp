"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

const CHIPS = ["入団準備","遠征準備","夏対策","冬対策","雨の日対策","GK専用","ジュニアユース準備","補食・栄養","スパイク","バッグ","水筒","インナー","レガース"];

const ARTICLES = [
  { rank: 1, title: "サッカー入団準備チェックリスト", sub: "初心者必見の持ち物まとめ", tag: "入団準備", star: 4.8, img: "/images/kf/panels/p_goods.jpg" },
  { rank: 2, title: "夏の水分補給ガイド", sub: "熱中症対策とおすすめ水筒", tag: "夏対策", star: 4.7, img: "/images/kf/panels/p_nutrition.jpg" },
  { rank: 3, title: "スパイクの選び方完全ガイド", sub: "サイズ・種類・おすすめまで解説", tag: "スパイク", star: 4.6, img: "/images/kf/panels/p_shoes.jpg" },
];
const RANK_BADGE = ["#C9A84C", "#9AA0A6", "#B0764A"];

export default function GoodsPage() {
  const [active, setActive] = useState<string>("");
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 880 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>準備物・グッズガイド</h1>
          <span className="kf-pr-label">PR</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "6px 0 16px" }}>入団・遠征・季節対策の必需品を、選び方とあわせて解説します。</p>

        {/* 絞り込みチップ */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {CHIPS.map(c => (
            <button key={c} onClick={() => setActive(active === c ? "" : c)}
              style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid var(--kf-border)", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: active === c ? "var(--kf-primary)" : "var(--kf-surface)", color: active === c ? "#fff" : "var(--kf-text)" }}>
              {c}
            </button>
          ))}
        </div>

        {/* 人気記事ランキング */}
        <div className="kf-card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>人気記事ランキング</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
            {ARTICLES.map((a, i) => (
              <Link key={a.rank} href="/goods" style={{ textDecoration: "none", color: "var(--kf-text)" }}>
                <div style={{ position: "relative", height: 130, borderRadius: 10, overflow: "hidden" }}>
                  <img src={a.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: 8, left: 8, width: 24, height: 24, borderRadius: 999, background: RANK_BADGE[i], color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 }}>{a.rank}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 2 }}>{a.sub}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span className="kf-badge">{a.tag}</span>
                  <span style={{ fontSize: 12, color: "var(--kf-accent-dark)" }}>★ {a.star}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 16 }}>※本ページはアフィリエイトプログラムを利用した商品紹介を含みます。価格・在庫は各販売サイトでご確認ください。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
