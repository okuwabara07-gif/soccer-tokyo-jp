"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import RakutenItems from "@/components/RakutenItems";

const STEPS = [
  { key: "width", title: "足の幅を教えてください", hint: "一番広い部分に合わせて選んでください。",
    opts: [ { v: "narrow", label: "細め", sub: "スリムな足型" }, { v: "normal", label: "標準", sub: "一般的な足型" }, { v: "wide", label: "やや幅広", sub: "幅広めの足型" }, { v: "xwide", label: "幅広", sub: "ゆったりした足型" } ] },
  { key: "arch", title: "土踏まずのタイプは？", hint: "アーチの高さで選んでください。",
    opts: [ { v: "low", label: "低い", sub: "扁平ぎみ" }, { v: "mid", label: "標準", sub: "平均的" }, { v: "high", label: "高い", sub: "ハイアーチ" }, { v: "unknown", label: "わからない", sub: "標準で判定" } ] },
  { key: "heel", title: "かかとの形は？", hint: "後ろから見た形で選んでください。",
    opts: [ { v: "narrow", label: "細い", sub: "小さめのかかと" }, { v: "normal", label: "標準", sub: "一般的" }, { v: "wide", label: "広い", sub: "大きめのかかと" }, { v: "unknown", label: "わからない", sub: "標準で判定" } ] },
];

const STEP_LABELS = ["幅の測定", "土踏まず", "かかとの形", "完了"];

function judge(a: Record<string, string>) {
  // 一般的な傾向（事実ベース・ブランド名を出さない・断定/効能を言わない）
  const width = a.width;
  const arch = a.arch;
  const archNote = arch === "high" ? " アーチ高めの傾向なので、クッション性のあるインソールの併用も選択肢になります。"
    : arch === "low" ? " アーチ低めの傾向。土踏まずを支える設計のインソール併用も選択肢になります。"
    : "";
  if (width === "wide" || width === "xwide")
    return { type: "幅広・甲高タイプ", keyword: "サッカースパイク 3E 幅広 ジュニア",
      note: "横幅にゆとりのある設計（3E・ワイド表記など）のモデルが履きやすい傾向です。" + archNote };
  if (width === "narrow")
    return { type: "細め・甲低タイプ", keyword: "サッカースパイク ジュニア 軽量",
      note: "フィット感を重視した、細め・軽量設計のモデルが合いやすい傾向です。" + archNote };
  return { type: "標準タイプ", keyword: "サッカースパイク ジュニア",
    note: "多くのモデルが合いやすい足型です。サイズ感や好みで選べます。" + archNote };
}

export default function FootCheckPage() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const done = step >= STEPS.length;
  const result = done ? judge(ans) : null;

  const pick = (key: string, v: string) => {
    setAns(p => ({ ...p, [key]: v }));
    setTimeout(() => setStep(s => s + 1), 150);
  };

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 680 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px", textAlign: "center" }}>足型診断</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 20px", textAlign: "center" }}>あなたの足型に合いやすいスパイクの傾向を診断します</p>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          {STEP_LABELS.map((l, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <div style={{ width: 14, height: 14, borderRadius: 999, background: i <= step ? "var(--kf-primary)" : "var(--kf-border)", zIndex: 1 }} />
              <span style={{ fontSize: 10, color: i <= step ? "var(--kf-primary)" : "var(--kf-muted)", marginTop: 6, fontWeight: 600 }}>{l}</span>
              {i < STEP_LABELS.length - 1 && <div style={{ position: "absolute", top: 7, left: "50%", width: "100%", height: 2, background: i < step ? "var(--kf-primary)" : "var(--kf-border)" }} />}
            </div>
          ))}
        </div>

        {!done ? (
          <div>
            <div style={{ fontSize: 12, color: "var(--kf-muted)", marginBottom: 4 }}>STEP {step + 1} / {STEPS.length}</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>{STEPS[step].title}</h2>
            <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px" }}>{STEPS[step].hint}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {STEPS[step].opts.map(o => (
                <button key={o.v} onClick={() => pick(STEPS[step].key, o.v)}
                  className="kf-card" style={{ padding: 18, textAlign: "center", cursor: "pointer", border: ans[STEPS[step].key] === o.v ? "2px solid var(--kf-primary)" : "1px solid var(--kf-border)" }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 4 }}>{o.sub}</div>
                </button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ marginTop: 16, background: "none", border: "none", color: "var(--kf-muted)", fontSize: 13, cursor: "pointer" }}>← 戻る</button>}
          </div>
        ) : (
          <div>
            <div className="kf-card" style={{ padding: 24, textAlign: "center", background: "var(--kf-primary-soft)", border: "none" }}>
              <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>あなたの足型は</div>
              <div style={{ fontSize: 24, fontWeight: 800, margin: "6px 0", color: "var(--kf-primary)" }}>{result!.type}</div>
              <p style={{ fontSize: 13, color: "var(--kf-text)", margin: 0, lineHeight: 1.7 }}>{result!.note}</p>
            </div>
            <RakutenItems keyword={result!.keyword} title="このタイプに合いやすいスパイク" />
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              <Link href="/shoes" className="kf-btn kf-btn--ghost" style={{ padding: "12px 20px" }}>スパイクの選び方を読む</Link>
              <button onClick={() => { setStep(0); setAns({}); }} className="kf-btn kf-btn--ghost" style={{ padding: "12px 20px" }}>もう一度診断する</button>
            </div>
            <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 16 }}>※一般的な傾向の目安です。フィットには個人差があるため、購入時は試着・サイズ確認をおすすめします。</p>
          </div>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
