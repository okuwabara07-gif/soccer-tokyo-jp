'use client';
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import RakutenItems from "@/components/RakutenItems";
import MangaCover from "@/components/MangaCover";

const POS_TABS = [
  { id: "gk", label: "GK", color: "#2b9348" },
  { id: "df", label: "DF", color: "#1d3557" },
  { id: "mf", label: "MF", color: "#e9a000" },
  { id: "fw", label: "FW", color: "#e63946" },
];
const C = "#2b9348";

const SKILLS = [
  { name: "反応速度", val: 5.0, color: "#e63946" },
  { name: "ポジショニング", val: 4.5, color: "#e9a000" },
  { name: "コーチング（指示）", val: 4.0, color: "#2b9348" },
  { name: "キャッチング", val: 4.0, color: "#457b9d" },
  { name: "キック（展開力）", val: 3.5, color: "#7b2d8b" },
];


function Dot({ label, color, x, y }: { label: string; color: string; x: number; y: number }) {
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: 34, height: 34, borderRadius: "50%", background: color, border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,.25)", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 800 }}>{label}</div>
  );
}
function Pitch({ fmt }: { fmt: "8" | "11" }) {
  const eight = [
    { l: "GK", c: "#7b2d8b", x: 50, y: 88 },
    { l: "DF", c: "#1769e0", x: 20, y: 64 }, { l: "DF", c: "#1769e0", x: 40, y: 64 }, { l: "DF", c: "#1769e0", x: 60, y: 64 }, { l: "DF", c: "#1769e0", x: 80, y: 64 },
    { l: "MF", c: "#e9a000", x: 35, y: 40 }, { l: "MF", c: "#e9a000", x: 65, y: 40 },
    { l: "FW", c: "#e63946", x: 50, y: 18 },
  ];
  const eleven = [
    { l: "GK", c: "#7b2d8b", x: 50, y: 90 },
    { l: "DF", c: "#1769e0", x: 18, y: 70 }, { l: "DF", c: "#1769e0", x: 39, y: 70 }, { l: "DF", c: "#1769e0", x: 61, y: 70 }, { l: "DF", c: "#1769e0", x: 82, y: 70 },
    { l: "MF", c: "#2b9348", x: 38, y: 50 }, { l: "MF", c: "#2b9348", x: 62, y: 50 },
    { l: "MF", c: "#e9a000", x: 25, y: 30 }, { l: "MF", c: "#e9a000", x: 50, y: 30 }, { l: "MF", c: "#e9a000", x: 75, y: 30 },
    { l: "FW", c: "#e63946", x: 50, y: 12 },
  ];
  const dots = fmt === "8" ? eight : eleven;
  const arrows: number[][] = fmt === "8"
    ? [[50,24,30,40,20,58],[50,24,70,40,80,58],[35,46,28,55,22,68],[65,46,72,55,78,68],[35,46,50,52,65,46],[20,70,32,80,30,88],[80,70,68,80,70,88]]
    : [[50,18,28,32,18,64],[50,18,72,32,82,64],[38,36,28,45,25,62],[62,36,72,45,75,62],[38,56,30,64,18,76],[62,56,70,64,82,76]];
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "linear-gradient(#e8f3e2,#dcefe0)", borderRadius: 12, border: "2px solid #cfe6d4", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: "8%", border: "2px solid rgba(255,255,255,.8)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: "50%", top: "8%", bottom: "8%", width: 2, background: "rgba(255,255,255,.8)", transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: "26%", aspectRatio: "1", border: "2px solid rgba(255,255,255,.8)", borderRadius: "50%", transform: "translate(-50%,-50%)" }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <marker id="ah" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#2b9348" />
          </marker>
        </defs>
        {arrows.map((a, i) => (
          <path key={i} d={`M${a[0]},${a[1]} Q${a[2]},${a[3]} ${a[4]},${a[5]}`} fill="none" stroke="#2b9348" strokeWidth="0.8" strokeDasharray="2 2" markerEnd="url(#ah)" opacity="0.85" />
        ))}
      </svg>
      {dots.map((d, i) => <Dot key={i} label={d.l} color={d.c} x={d.x} y={d.y} />)}
    </div>
  );
}

export default function PositionPage() {
  const [tab, setTab] = useState("gk");
  const [fmt, setFmt] = useState<"8"|"11">("8");

  return (
    <div style={{ background: "var(--kf-bg,#f7f8fa)", minHeight: "100vh", color: "var(--kf-text,#1a1a1a)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "0 0 56px" }}>

        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
          <img src="/images/kf/position/gk-hero.jpg" alt="GK" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: 12, left: 16 }}>
            <Link href="/" style={{ color: "#fff", fontSize: 13, textDecoration: "none", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>← 戻る</Link>
          </div>
          <div style={{ position: "absolute", bottom: 14, left: 16 }}>
            <p style={{ color: "#fff", fontSize: 10, letterSpacing: "0.15em", marginBottom: 2, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>POSITION GUIDE</p>
            <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 900, margin: 0, textShadow: "0 2px 6px rgba(0,0,0,.6)" }}>GK</h1>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>ゴールキーパー</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, padding: "12px 16px", flexWrap: "wrap" }}>
          {POS_TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, minWidth: 64, padding: "10px 8px", borderRadius: 10, border: "1px solid " + (tab === t.id ? t.color : "#ddd"), background: tab === t.id ? t.color : "#fff", color: tab === t.id ? "#fff" : "#666", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab !== "gk" && (
          <div className="kf-card" style={{ margin: "8px 16px", padding: 32, textAlign: "center", color: "#888" }}>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>{tab.toUpperCase()} ガイドは準備中です</p>
            <button onClick={() => setTab("gk")} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 999, border: "none", background: C, color: "#fff", fontWeight: 700, cursor: "pointer" }}>GKを見る</button>
          </div>
        )}

        {tab === "gk" && (
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 18 }}>

            <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.7, margin: 0 }}>チームの最後の砦。ゴールを守り、勝利をつかめ。</p>

            <div style={{ display: "flex", gap: 8 }}>
              {([["8","8人制（小学生）"],["11","11人制（中学生以上）"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setFmt(v)} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: "none", background: fmt === v ? C : "#fff", color: fmt === v ? "#fff" : "#666", fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: fmt===v?"none":"0 1px 3px rgba(0,0,0,.08)" }}>{l}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#888", margin: "-8px 0 0", textAlign: "center" }}>試合形式を切り替えると、ポジション配置が変わります</p>

            <div className="kf-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>試合中のポジショニング（GK）</h2>
                <span style={{ fontSize: 11, background: C+"22", color: C, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>{fmt}人制</span>
              </div>
              <img src="/images/kf/position/gk-heatmap.jpg" alt="GKのポジショニング" style={{ width: "100%", borderRadius: 10, display: "block" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                {[["🔴 シュート対応エリア","ゴール前のシュートを素早く反応して止める"],["🟡 カバーエリア","DFの裏や横のスペースを声を出してカバー"],["🔵 展開エリア","味方へのロングパスやスローで攻撃の起点に"],["✅ ポジショニングの基本","ボールの位置を見て、ゴール中央を基本に動く"]].map(([t,d]) => (
                  <div key={t} style={{ background: "#f7f8fa", borderRadius: 8, padding: "8px 10px" }}>
                    <p style={{ fontSize: 12, fontWeight: 800, marginBottom: 2 }}>{t}</p>
                    <p style={{ fontSize: 11, color: "#666", lineHeight: 1.5 }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>GKの役割</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["🧤","守る","シュートを止め、失点を防ぐ","#e63946"],["📢","指示する","DFへの声かけで守備の連携をつくる","#7b2d8b"],["🎯","つなぐ","素早いスローやキックで攻撃を開始","#457b9d"],["👁","読む","相手の動きを先読みして対応する","#2b9348"]].map(([ic,t,d,col]) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: col+"1a", display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0 }}>{ic}</div>
                    <div><p style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>{t}</p><p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5 }}>{d}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>必要スキル</h2>
              {SKILLS.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, width: 110, flexShrink: 0 }}>{s.name}</span>
                  <div style={{ flex: 1, height: 8, background: "#eee", borderRadius: 999 }}>
                    <div style={{ width: `${s.val/5*100}%`, height: "100%", background: s.color, borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color, width: 30, textAlign: "right" }}>{s.val.toFixed(1)}</span>
                </div>
              ))}
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>{fmt}人制のポジション配置</h2>
              <Pitch fmt={fmt} />
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>向いている体格・性格</h2>
              {[["身長","平均 +5cm以上が有利"],["体重","がっしり型・安定感がある"],["性格","冷静・集中力が高い・声が大きい"]].map(([l,v]) => (
                <div key={l} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: 12, color: "#999", width: 40, flexShrink: 0 }}>{l}</span>
                  <span style={{ fontSize: 13 }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>GK手袋（グローブ）の選び方</h2>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, marginBottom: 10 }}>初めての1組は、次の3つの基準で選ぶと失敗しません。</p>
              {[["① グリップ","天然ラテックスのグリップ力が高いほどキャッチが安定。雨用と晴れ用で素材が分かれることも。"],["② サイズ","手の縦の長さ(cm)+1を目安に。ジュニアは指先に5mmほど余裕があるサイズが扱いやすい。"],["③ カット(縫製)","ロールフィンガーは指全体で掴みやすく初心者向け。ネガティブカットはフィット感重視。"]].map(([t,d]) => (
                <div key={t} style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: C, marginBottom: 2 }}>{t}</p>
                  <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>{d}</p>
                </div>
              ))}
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>GKグローブを探す</h2>
              <RakutenItems keyword="ゴールキーパー グローブ ジュニア" title="" />
            </div>

            <div className="kf-card" style={{ padding: 16, border: "1px solid #e63946", background: "#fff5f5" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: "#e63946" }}>GKは怪我に注意！インナーで守ろう</h2>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, marginBottom: 8 }}>GKは飛び込む・倒れ込むプレーが多く、太ももや肘・腰を擦りやすいポジション。インナーパンツや長袖インナーで擦過傷・打撲を予防しましょう。</p>
              <RakutenItems keyword="ゴールキーパー インナーパンツ ジュニア" title="" />
              <Link href="/goods" style={{ display: "inline-block", marginTop: 8, fontSize: 13, color: "#e63946", fontWeight: 700, textDecoration: "none" }}>準備物・グッズ一覧を見る →</Link>
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>おすすめトレーニング</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["gk-tr1","反応トレーニング","瞬時の反応を鍛える","毎日10分"],["gk-tr2","1対1対応トレーニング","相手との駆け引きを鍛える","毎日15分"],["gk-tr3","ロングパス練習","正確なキックで攻撃の起点に","週3回"]].map(([img,t,d,freq]) => (
                  <div key={img} style={{ textAlign: "center" }}>
                    <img src={`/images/kf/position/${img}.jpg`} alt={t} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 10, display: "block", marginBottom: 6 }} />
                    <p style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.4, marginBottom: 2 }}>{t}</p>
                    <p style={{ fontSize: 10, color: "#888", lineHeight: 1.4, marginBottom: 4 }}>{d}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C, background: C+"15", borderRadius: 999, padding: "2px 10px" }}>{freq}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kf-card" style={{ padding: 16, background: C+"0f" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10, color: C }}>💡 ワンポイントアドバイス</h2>
              {["常に声を出して味方を動かそう","ゴール中央を意識して構える","相手の動きを先読みする習慣をつけよう"].map((t) => (
                <p key={t} style={{ fontSize: 13, paddingLeft: 22, position: "relative", lineHeight: 1.8, margin: 0 }}><span style={{ position: "absolute", left: 0, color: C }}>✓</span>{t}</p>
              ))}
            </div>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>GKが活躍するサッカー漫画</h2>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 14, alignItems: "center" }}>
                <MangaCover keyword="サッカー ゴールキーパー コミック" alt="GK漫画" />
                <div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>守護神を主役にした作品でGKの奥深さを知ろう。漫画ランキングから他の名作も探せます。</p>
                  <Link href="/manga" style={{ display: "inline-block", marginTop: 8, fontSize: 13, color: C, fontWeight: 700, textDecoration: "none" }}>サッカー漫画ランキングへ →</Link>
                </div>
              </div>
            </div>

            <Link href="/foot-check" className="kf-card" style={{ padding: 16, textDecoration: "none", color: "inherit", display: "block" }}>
              <p style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>👟 足型診断であなたに合うスパイクを見つける</p>
              <p style={{ fontSize: 12, color: "#888" }}>3つの質問でタイプ別におすすめを提案 →</p>
            </Link>

            <div className="kf-card" style={{ padding: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>他のポジションも見る</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {POS_TABS.filter((t) => t.id !== "gk").map((t) => (
                  <button key={t.id} onClick={() => { setTab(t.id); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ padding: "12px 0", borderRadius: 10, border: "1px solid " + t.color, background: "#fff", color: t.color, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>{t.label}</button>
                ))}
              </div>
            </div>

            <div className="kf-card" style={{ padding: 20, borderRadius: 16, background: "linear-gradient(135deg,#0a3d62,#1a6ba0)" }}>
              <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>自分に合うチームを見つけよう</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 16 }}>関東1,000チーム以上からAIが無料診断</p>
              <Link href="/matching" style={{ display: "block", padding: "12px", borderRadius: 12, background: "#4CAF50", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>無料でチームを探す →</Link>
            </div>

            <p style={{ fontSize: 11, color: "#aaa", textAlign: "center" }}>※ポジションの役割は一般的なものです。チームの方針に従いましょう。本ページは広告（アフィリエイト）を含みます。</p>
          </div>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
