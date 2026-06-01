"use client";
import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Shoe = { rank: number; name: string; brand: string; price: string; url: string; point: string; type: string; star?: number };

const RANKINGS: Record<string, Shoe[]> = {
  "U8〜U10": [
    { rank:1, name:"ミズノ モナルシーダ NEO II SELECT Jr", brand:"Mizuno", price:"¥5,500", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F", point:"軽くて履きやすい。ジュニア入門に最適。甲高対応。", type:"スパイク", star:4.8 },
    { rank:2, name:"アシックス DS LIGHT Jr", brand:"Asics", price:"¥6,600", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B9%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F", point:"クッション性が高く走りやすい。長時間の練習OK。", type:"スパイク", star:4.6 },
    { rank:3, name:"ナイキ ファントム Jr", brand:"Nike", price:"¥7,700", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F", point:"デザインがかっこいい。細め〜普通の足向け。", type:"スパイク", star:4.5 },
  ],
  "U12": [
    { rank:1, name:"アディダス プレデター ACCURACY.4 Jr", brand:"Adidas", price:"¥8,800", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%83%97%E3%83%AC%E3%83%87%E3%82%BF%E3%83%BC%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F", point:"ボールコントロールに優れる。テクニカルな選手に最適。", type:"スパイク", star:4.8 },
    { rank:2, name:"ミズノ レビュラ 3 SELECT Jr", brand:"Mizuno", price:"¥9,900", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%83%AC%E3%83%93%E3%83%A5%E3%83%A9%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F", point:"日本人の足型対応。天然芝での使用に最適。", type:"スパイク", star:4.6 },
    { rank:3, name:"ナイキ ティエンポ LEGEND 10 CLUB Jr", brand:"Nike", price:"¥7,700", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%8A%E3%82%A4%E3%82%AD%E3%83%86%E3%82%A3%E3%82%A8%E3%83%B3%E3%83%9D%E3%82%B8%E3%83%A5%E3%83%8B%E3%82%A2%2F", point:"ナイキの中では比較的幅広。天然芝向け。", type:"スパイク", star:4.5 },
  ],
  "U15": [
    { rank:1, name:"アディダス コパ PURE.4 FxG", brand:"Adidas", price:"¥12,100", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%82%A2%E3%83%87%E3%82%A3%E3%83%80%E3%82%B9%E3%82%B3%E3%83%91%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F", point:"柔らかい天然皮革。フィット感と操作性が両立。", type:"スパイク", star:4.7 },
    { rank:2, name:"ミズノ モナルシーダ NEO II ELITE AS", brand:"Mizuno", price:"¥14,300", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%9F%E3%82%BA%E3%83%8E%E3%83%A2%E3%83%8A%E3%83%AB%E3%82%B7%E3%83%BC%E3%83%80%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F", point:"人工芝対応。軽量で反発力が高い。甲高OK。", type:"トレシュー", star:4.6 },
    { rank:3, name:"プーマ フューチャー 7 MATCH FG/AG", brand:"Puma", price:"¥11,000", url:"https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%E3%83%97%E3%83%BC%E3%83%9E%E3%83%95%E3%83%A5%E3%83%BC%E3%83%81%E3%83%A3%E3%83%BC%E3%82%B9%E3%83%91%E3%82%A4%E3%82%AF%2F", point:"フィット感×デザイン性。オールラウンダー向け。", type:"スパイク", star:4.5 },
  ],
};

const BRANDS = [
  { name:"ミズノ", feature:"甲高・幅広の足に最適。日本人の足型に合わせた設計。", foot:"幅広・甲高" },
  { name:"アシックス", feature:"クッション性重視。長時間でも疲れにくい。", foot:"標準〜幅広" },
  { name:"ナイキ", feature:"細め設計。スタイリッシュなデザイン。", foot:"細め・甲低" },
  { name:"アディダス", feature:"ボールコントロール重視。テクニカル系。", foot:"標準" },
  { name:"プーマ", feature:"フィット感とデザイン性のバランス型。", foot:"標準" },
];

const FOOT_TYPES = [
  { id:"normal", label:"普通（標準）", desc:"どのブランドも合いやすい。好みで選んでOK" },
  { id:"wide", label:"幅広・甲高", desc:"ミズノ・アシックスが最適。ナイキは避けて" },
  { id:"narrow", label:"細め・甲低", desc:"ナイキ・アディダスが最適。フィット感重視" },
  { id:"long", label:"つま先が長い", desc:"つま先にゆとりのあるモデルを選ぶ" },
];

const AGES = ["U8〜U10", "U12", "U15"];
const RANK_BADGE = ["#C9A84C", "#9AA0A6", "#B0764A"];

export default function ShoesPage() {
  const [tab, setTab] = useState<"ranking" | "brand" | "foot">("ranking");
  const [age, setAge] = useState("U12");
  const [foot, setFoot] = useState("");

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 760 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>スパイク・シューズ選び</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px" }}>学年・ポジション別おすすめランキング</p>

        {/* タブ */}
        <div style={{ display: "flex", gap: 4, background: "var(--kf-surface)", padding: 4, borderRadius: 12, marginBottom: 18 }}>
          {([["ranking","ランキング"],["brand","ブランド比較"],["foot","足型診断"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ flex: 1, padding: "10px 8px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                background: tab === k ? "var(--kf-primary)" : "transparent", color: tab === k ? "#fff" : "var(--kf-muted)" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "ranking" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {AGES.map(a => (
                <button key={a} onClick={() => setAge(a)}
                  style={{ flex: 1, padding: "8px", borderRadius: 999, border: "1px solid var(--kf-border)", cursor: "pointer", fontWeight: 700, fontSize: 13,
                    background: age === a ? "var(--kf-primary)" : "var(--kf-surface)", color: age === a ? "#fff" : "var(--kf-text)" }}>
                  {a}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {RANKINGS[age].map((s, i) => (
                <div key={s.rank} className="kf-card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ width: 26, height: 26, borderRadius: 999, background: RANK_BADGE[i] || "#ccc", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{s.rank}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{s.brand} {s.name.replace(s.brand === "Adidas" ? "アディダス " : "", "")}</div>
                        <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>{s.price} <span style={{ fontSize: 11, color: "var(--kf-muted)" }}>(税込)</span></div>
                      </div>
                      {s.star && <div style={{ fontSize: 12, color: "var(--kf-accent-dark)", marginTop: 2 }}>★ {s.star}</div>}
                      <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "6px 0 10px", lineHeight: 1.6 }}>{s.point}</p>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--primary" style={{ padding: "9px 18px", fontSize: 13 }}>詳しく見る</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "brand" && (
          <div style={{ display: "grid", gap: 12 }}>
            {BRANDS.map(b => (
              <div key={b.name} className="kf-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{b.name}</div>
                  <span className="kf-badge">{b.foot}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "8px 0 0", lineHeight: 1.7 }}>{b.feature}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "foot" && (
          <div>
            <p style={{ fontSize: 13, color: "var(--kf-muted)", marginBottom: 12 }}>足のタイプを選ぶと、合うブランドの目安がわかります。</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {FOOT_TYPES.map(ft => (
                <button key={ft.id} onClick={() => setFoot(ft.id)}
                  className="kf-card" style={{ padding: 16, textAlign: "left", cursor: "pointer", border: foot === ft.id ? "2px solid var(--kf-primary)" : "1px solid var(--kf-border)" }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{ft.label}</div>
                  <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "6px 0 0", lineHeight: 1.6 }}>{ft.desc}</p>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 14 }}>※より詳しいAI足型診断は <a href="/foot-check" style={{ color: "var(--kf-primary)" }}>こちら</a></p>
          </div>
        )}

        <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 20 }}>※本ページはアフィリエイトプログラムを利用した商品紹介を含みます。価格・在庫は各販売サイトでご確認ください。</p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
