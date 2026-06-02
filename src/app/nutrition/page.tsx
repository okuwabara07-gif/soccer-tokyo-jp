"use client";
import { useState } from "react";
import RakutenItems from "@/components/RakutenItems";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Tab = "timing" | "supple" | "snack" | "drink";

const TABS: { key: Tab; label: string }[] = [
  { key: "timing", label: "タイミング" },
  { key: "supple", label: "サプリ" },
  { key: "snack", label: "間食・おやつ" },
  { key: "drink", label: "ドリンク" },
];

const TIMING = [
  { when: "試合3日前〜前日", head: "エネルギーを蓄える", color: "var(--kf-primary)", items: ["炭水化物を多めに摂る（ご飯・パスタ・パン）", "脂っこいものは避ける", "水分をしっかり摂る（1日2L目安）"] },
  { when: "試合当日 朝食", head: "エネルギーをチャージ", color: "#2F6FDB", items: ["ご飯・パンなど消化の良い炭水化物", "バナナやヨーグルトでエネルギー補給", "水分は500ml以上"] },
  { when: "試合後", head: "リカバリー", color: "var(--kf-accent-dark)", items: ["30分以内に炭水化物＋タンパク質", "おにぎり＋牛乳などが手軽", "失った水分・塩分を補給"] },
];
const SUPPLE = [
  "成長期は基本『食事から』が原則。サプリは補助と考える。",
  "鉄分・カルシウムは不足しやすい栄養素。食事で意識する。",
  "プロテインは食事で足りない時の補助。過剰摂取は不要。",
  "保護者・指導者と相談し、体に合うものを選ぶ。",
];
const SNACK = [
  "練習前後の補食は『おにぎり・バナナ・カステラ』が定番。",
  "成長期は3食＋補食でエネルギー量を確保。",
  "甘いお菓子より、消化が良く糖質を補えるものを。",
];
const DRINK = [
  "運動中はこまめに水分補給（喉が渇く前に）。",
  "汗を多くかく日はスポーツドリンクで塩分も補給。",
  "試合・練習で1〜2L目安。氷で冷やしすぎない。",
];

export default function NutritionPage() {
  const [tab, setTab] = useState<Tab>("timing");
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "0 0 56px", maxWidth: 760 }}>
        {/* ヒーロー */}
        <div style={{ position: "relative", height: 200 }}>
          <img src="/images/kf/panels/p_nutrition.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(0,0,0,.7),rgba(0,0,0,.1))" }} />
          <div style={{ position: "absolute", left: 16, bottom: 16, color: "#fff" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>栄養・補助食品</h1>
            <p style={{ fontSize: 13, margin: "4px 0 0", opacity: .95 }}>成長期の体作りを栄養からサポート</p>
          </div>
        </div>

        <div style={{ padding: "20px 16px 0" }}>
          {/* タブ */}
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--kf-border)", marginBottom: 18 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ flex: 1, padding: "10px 4px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                  color: tab === t.key ? "var(--kf-primary)" : "var(--kf-muted)", borderBottom: tab === t.key ? "2px solid var(--kf-primary)" : "2px solid transparent" }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "timing" && (
            <>
              <p style={{ fontSize: 13, color: "var(--kf-muted)", marginBottom: 14, lineHeight: 1.7 }}>「いつ何を食べるか」がパフォーマンスを大きく左右します。試合前後の栄養タイミングを意識しましょう。</p>
              <div style={{ display: "grid", gap: 12 }}>
                {TIMING.map(t => (
                  <div key={t.when} className="kf-card" style={{ padding: 16, borderLeft: `4px solid ${t.color}` }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{t.when}</div>
                    <div style={{ fontSize: 13, color: t.color, fontWeight: 700, margin: "2px 0 10px" }}>{t.head}</div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 6 }}>
                      {t.items.map((it, i) => (<li key={i} style={{ fontSize: 13, lineHeight: 1.6, paddingLeft: 22, position: "relative" }}><span style={{ position: "absolute", left: 0, color: t.color }}>✓</span>{it}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === "supple" && <ListCard items={SUPPLE} />}
          {tab === "snack" && <ListCard items={SNACK} />}
          {tab === "drink" && <ListCard items={DRINK} />}

          {/* 関連記事(nutrition_posts流用予定の枠) */}
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "28px 0 12px" }}>関連記事</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { t: "ジュニアサッカー選手の食事の基本", c: "炭水化物・タンパク質・鉄分が特に重要。" },
              { t: "試合前日の食事メニュー", c: "消化の良い炭水化物中心。パスタ・うどん・白ご飯。" },
              { t: "プロテインは必要？小中学生向け解説", c: "成長期は食事で補うのが基本。" },
            ].map((a, i) => (
              <div key={i} className="kf-card" style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.t}</div>
                <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "4px 0 0", lineHeight: 1.6 }}>{a.c}</p>
              </div>
            ))}
          </div>
          <div className="kf-card" style={{ padding: 18, marginTop: 18 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>成長期の補食・ゼリー</div>
            <RakutenItems keyword="ジュニア 補食 ゼリー スポーツ" title="" />
          </div>
          <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 18 }}>※一般的な栄養情報です。体質・アレルギー等は専門家にご相談ください。アフィリエイトを含みます。</p>
        </div>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}

function ListCard({ items }: { items: string[] }) {
  return (
    <div className="kf-card" style={{ padding: 18 }}>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 10 }}>
        {items.map((it, i) => (<li key={i} style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 22, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--kf-primary)" }}>✓</span>{it}</li>))}
      </ul>
    </div>
  );
}
