"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

// 文科省・学校保健統計をもとにした概算の同年代平均（参考値）
const AVG: Record<string, { h: number; w: number }> = {
  "小1": { h: 116.5, w: 21.4 }, "小2": { h: 122.6, w: 24.0 }, "小3": { h: 128.1, w: 27.0 },
  "小4": { h: 133.5, w: 30.4 }, "小5": { h: 138.9, w: 34.0 }, "小6": { h: 145.2, w: 38.2 },
  "中1": { h: 152.8, w: 44.0 }, "中2": { h: 160.0, w: 49.0 }, "中3": { h: 165.0, w: 53.9 },
};
const GRADES = Object.keys(AVG);

function diagnose(grade: string, h: number, w: number) {
  const a = AVG[grade];
  const hDiff = h - a.h, wDiff = w - a.w;
  // BMI的なバランスで傾向を出す（断定でなく傾向）
  const bmi = w / ((h / 100) ** 2);
  let type = "バランス型", desc = "スピードとパワーのバランスが良いタイプです。";
  let stats = { speed: 70, power: 65, stamina: 60, flex: 75 };
  let shoe = "オールラウンドモデル", shoeNote = "バランスの良いプレーをサポートする万能タイプ。";
  if (hDiff > 4 && bmi < 17) { type = "スピード型"; desc = "高さと軽さを活かしたスピードが武器になりやすいタイプ。"; stats = { speed: 85, power: 55, stamina: 65, flex: 70 }; shoe = "軽量スピードモデル"; shoeNote = "軽さ重視。加速・走力を活かせる。"; }
  else if (bmi >= 18) { type = "パワー型"; desc = "体格を活かした当たりの強さ・パワーが武器になりやすいタイプ。"; stats = { speed: 58, power: 82, stamina: 68, flex: 60 }; shoe = "安定感重視モデル"; shoeNote = "グリップ・安定性重視。体を支える。"; }
  return { type, desc, stats, shoe, shoeNote, hDiff, wDiff, a };
}

export default function BodyCheckPage() {
  const [grade, setGrade] = useState("小5");
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const [res, setRes] = useState<ReturnType<typeof diagnose> | null>(null);

  const run = () => {
    const hn = parseFloat(h), wn = parseFloat(w);
    if (!hn || !wn) { alert("身長・体重を入力してください"); return; }
    setRes(diagnose(grade, hn, wn));
  };

  const Bar = ({ label, val }: { label: string; val: number }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span>{label}</span><span style={{ color: "var(--kf-muted)" }}>{val}%</span></div>
      <div style={{ height: 8, background: "var(--kf-border)", borderRadius: 999 }}><div style={{ width: `${val}%`, height: "100%", background: "var(--kf-primary)", borderRadius: 999 }} /></div>
    </div>
  );

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 760 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 16px" }}>体格診断</h1>

        <div className="kf-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>お子さんの情報を入力してください</div>
          <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>学年</label>
          <select value={grade} onChange={e => setGrade(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 14px", fontSize: 14 }}>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>身長 (cm)</label>
              <input value={h} onChange={e => setH(e.target.value)} inputMode="decimal" placeholder="145" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", marginTop: 4, fontSize: 14 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>体重 (kg)</label>
              <input value={w} onChange={e => setW(e.target.value)} inputMode="decimal" placeholder="38" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", marginTop: 4, fontSize: 14 }} />
            </div>
          </div>
          <button onClick={run} className="kf-btn kf-btn--primary" style={{ width: "100%", padding: "12px", marginTop: 16 }}>診断する →</button>
        </div>

        {res && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>診断結果</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="kf-card" style={{ padding: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--kf-primary)" }}>{res.type}</div>
                <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "6px 0 14px", lineHeight: 1.6 }}>{res.desc}</p>
                <Bar label="スピード" val={res.stats.speed} />
                <Bar label="パワー" val={res.stats.power} />
                <Bar label="持久力" val={res.stats.stamina} />
                <Bar label="柔軟性" val={res.stats.flex} />
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                <div className="kf-card" style={{ padding: 18 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>おすすめのスパイクタイプ</div>
                  <div style={{ fontWeight: 700, color: "var(--kf-primary)" }}>{res.shoe}</div>
                  <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "4px 0 10px", lineHeight: 1.6 }}>{res.shoeNote}</p>
                  <Link href="/shoes" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 12 }}>スパイクを見る</Link>
                </div>
                <div className="kf-card" style={{ padding: 18 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>同年代の平均データ</div>
                  <div style={{ fontSize: 13, lineHeight: 1.9 }}>平均身長: {res.a.h} cm<br />平均体重: {res.a.w} kg</div>
                  <div style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 6 }}>※{grade}の概算平均値</div>
                </div>
              </div>
            </div>
            <div className="kf-card" style={{ padding: 18, marginTop: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>成長のためのアドバイス</div>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 6 }}>
                {["バランスの取れた食事を心がけましょう", "週2〜3回の筋力トレーニングがおすすめ", "十分な睡眠で成長をサポート"].map((t, i) => (
                  <li key={i} style={{ fontSize: 13, paddingLeft: 22, position: "relative", lineHeight: 1.6 }}><span style={{ position: "absolute", left: 0, color: "var(--kf-primary)" }}>✓</span>{t}</li>
                ))}
              </ul>
            </div>
            <p style={{ fontSize: 11, color: "var(--kf-muted)", marginTop: 14 }}>※平均値は学校保健統計等を参考にした概算です。成長には個人差があります。発育の心配は専門家にご相談ください。</p>
          </div>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
