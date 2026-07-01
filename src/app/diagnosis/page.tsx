"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import LineAddPanel from "@/components/LineAddPanel";

interface DiagnosisResult {
  matched_team_ids: string[];
  teams: Array<{
    id: string;
    name: string;
    prefecture: string;
    area: string;
  }>;
  reason?: string;
}

type Step = "q1" | "q2" | "q3" | "q4" | "result" | "loading";

const PREFECTURES = ["東京都", "神奈川県", "埼玉県", "千葉県"];

const AREAS: Record<string, string[]> = {
  "東京都": ["23区", "多摩地区"],
  "神奈川県": ["横浜市", "川崎市", "相模原市", "その他"],
  "埼玉県": ["さいたま市", "その他"],
  "千葉県": ["千葉市", "その他"],
};

const AGE_GROUPS = [
  { label: "未就学(U6/U7/U8)", value: "未就学" },
  { label: "低学年(U9/U10)", value: "低学年" },
  { label: "高学年(U11/U12)", value: "高学年" },
  { label: "中学生(U13/U14/U15)", value: "中学生" },
  { label: "女子(女子U12/女子U15)", value: "女子" },
  { label: "高校(U18)", value: "高校" },
];

const ENVIRONMENT = [
  { label: "本格志向(Jリーグ系など)", value: "本格志向" },
  { label: "楽しく活動(街クラブなど)", value: "楽しく" },
  { label: "技術特化(スクール)", value: "技術特化" },
  { label: "フットサル", value: "フットサル" },
];

const FREQUENCY = [
  { label: "週1-2回", value: "週1-2" },
  { label: "週3回以上", value: "週3以上" },
  { label: "こだわらない", value: "こだわらない" },
];

export default function DiagnosisPage() {
  const [step, setStep] = useState<Step>("q1");
  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [environment, setEnvironment] = useState("");
  const [frequency, setFrequency] = useState("");
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState("");

  const handleQ1Next = () => {
    if (!prefecture) {
      setError("都道府県を選択してください");
      return;
    }
    setError("");
    setStep("q2");
  };

  const handleQ2Next = () => {
    if (!area) {
      setError("エリアを選択してください");
      return;
    }
    setError("");
    setStep("q3");
  };

  const handleQ3Next = () => {
    if (!ageGroup) {
      setError("年代を選択してください");
      return;
    }
    setError("");
    setStep("q4");
  };

  const handleQ4Next = () => {
    if (!environment) {
      setError("環境を選択してください");
      return;
    }
    setError("");
    setStep("loading");
    submitDiagnosis();
  };

  const submitDiagnosis = async () => {
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefecture,
          area,
          ageGroup,
          environment,
          frequency: frequency || "こだわらない",
        }),
      });

      if (!res.ok) {
        throw new Error("診断に失敗しました");
      }

      const data = await res.json();
      setResult(data.result);
      setStep("result");
    } catch (err) {
      setError((err as Error).message);
      setStep("q4");
    }
  };

  const handleBack = () => {
    if (step === "q1") return;
    if (step === "q2") setStep("q1");
    if (step === "q3") setStep("q2");
    if (step === "q4") setStep("q3");
    if (step === "result") {
      setPrefecture("");
      setArea("");
      setAgeGroup("");
      setEnvironment("");
      setFrequency("");
      setResult(null);
      setStep("q1");
    }
  };

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 600 }}>
        {step === "q1" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>チーム診断</h1>
            <p style={{ color: "var(--kf-muted)", marginBottom: 24 }}>
              4つの質問に答えて、あなたに合うチームを診断します
            </p>
            <div className="kf-card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Q1. どのエリアで探していますか？
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PREFECTURES.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setPrefecture(pref)}
                    className={`kf-btn ${prefecture === pref ? "kf-btn--primary" : "kf-btn--ghost"}`}
                    style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              {error && <p style={{ color: "#e74c3c", marginTop: 12, fontSize: 13 }}>{error}</p>}
              <button
                onClick={handleQ1Next}
                className="kf-btn kf-btn--primary"
                style={{ marginTop: 20, width: "100%", padding: "12px" }}
              >
                次へ
              </button>
            </div>
          </>
        )}

        {step === "q2" && (
          <>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                color: "var(--kf-primary)",
                cursor: "pointer",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              ← 戻る
            </button>
            <div className="kf-card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Q2. お子さんの年代は？
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {AGE_GROUPS.map((group) => (
                  <button
                    key={group.value}
                    onClick={() => setAgeGroup(group.value)}
                    className={`kf-btn ${ageGroup === group.value ? "kf-btn--primary" : "kf-btn--ghost"}`}
                    style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
              {error && <p style={{ color: "#e74c3c", marginTop: 12, fontSize: 13 }}>{error}</p>}
              <button
                onClick={handleQ2Next}
                className="kf-btn kf-btn--primary"
                style={{ marginTop: 20, width: "100%", padding: "12px" }}
              >
                次へ
              </button>
            </div>
          </>
        )}

        {step === "q3" && (
          <>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                color: "var(--kf-primary)",
                cursor: "pointer",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              ← 戻る
            </button>
            <div className="kf-card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Q3. どんな環境が理想ですか？
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ENVIRONMENT.map((env) => (
                  <button
                    key={env.value}
                    onClick={() => setEnvironment(env.value)}
                    className={`kf-btn ${environment === env.value ? "kf-btn--primary" : "kf-btn--ghost"}`}
                    style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}
                  >
                    {env.label}
                  </button>
                ))}
              </div>
              {error && <p style={{ color: "#e74c3c", marginTop: 12, fontSize: 13 }}>{error}</p>}
              <button
                onClick={handleQ3Next}
                className="kf-btn kf-btn--primary"
                style={{ marginTop: 20, width: "100%", padding: "12px" }}
              >
                次へ
              </button>
            </div>
          </>
        )}

        {step === "q4" && (
          <>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                color: "var(--kf-primary)",
                cursor: "pointer",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              ← 戻る
            </button>
            <div className="kf-card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Q4. 通える頻度は？
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FREQUENCY.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setFrequency(freq.value)}
                    className={`kf-btn ${frequency === freq.value ? "kf-btn--primary" : "kf-btn--ghost"}`}
                    style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 12 }}>
                ※「こだわらない」を選ぶと全チームが対象になります
              </p>
              {error && <p style={{ color: "#e74c3c", marginTop: 12, fontSize: 13 }}>{error}</p>}
              <button
                onClick={handleQ4Next}
                className="kf-btn kf-btn--primary"
                style={{ marginTop: 20, width: "100%", padding: "12px" }}
              >
                診断結果を見る
              </button>
            </div>
          </>
        )}

        {step === "loading" && (
          <div className="kf-card" style={{ padding: 40, textAlign: "center" }}>
            <p style={{ fontSize: 14 }}>診断中...</p>
          </div>
        )}

        {step === "result" && result && (
          <>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                color: "var(--kf-primary)",
                cursor: "pointer",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              ← もう一度診断する
            </button>
            <div className="kf-card" style={{ padding: 20, marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>あなたにおすすめのチーム</h2>
              {result.reason && (
                <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16, color: "var(--kf-muted)" }}>
                  {result.reason}
                </p>
              )}
            </div>
            {result.teams.length > 0 ? (
              result.teams.map((team) => (
                <div key={team.id} className="kf-card" style={{ padding: 16, marginBottom: 12 }}>
                  <Link href={`/teams/${team.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{team.name}</h3>
                    <p style={{ fontSize: 13, color: "var(--kf-muted)", marginBottom: 12 }}>
                      {team.prefecture} {team.area}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--kf-primary)",
                        fontWeight: 600,
                      }}
                    >
                      詳細を見る →
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="kf-card" style={{ padding: 20, textAlign: "center" }}>
                <p style={{ color: "var(--kf-muted)" }}>該当するチームが見つかりませんでした</p>
              </div>
            )}
            <LineAddPanel />
          </>
        )}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
