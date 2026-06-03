"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { useLineAuth } from "@/components/LineLogin";

const QUICK = [
  { label: "チームを探す", href: "/teams", img: "/images/kf/panels/p_teams.jpg" },
  { label: "AI足型診断", href: "/foot-check", img: "/images/kf/panels/p_foot.jpg" },
  { label: "体格診断", href: "/body-check", img: "/images/kf/panels/p_body.jpg" },
  { label: "栄養ガイド", href: "/nutrition", img: "/images/kf/panels/p_nutrition.jpg" },
];

export default function MyPage() {
  const { ready, loggedIn, login } = useLineAuth();
  const [plan, setPlan] = useState<string | null>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(0);
  const [active, setActive] = useState(false);
  const [memLoaded, setMemLoaded] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [footResult, setFootResult] = useState<any>(null);
  const [bodyResult, setBodyResult] = useState<any>(null);
  const [tab, setTab] = useState<"home" | "status" | "settings">("home");

  const loadMembership = useCallback(async () => {
    try {
      const r = await fetch("/api/membership", { cache: "no-store" });
      const d = await r.json();
      setActive(!!d.active); setPlan(d.plan ?? null); setTrialDaysLeft(d.trialDaysLeft ?? 0);
    } catch {} finally { setMemLoaded(true); }
  }, []);

  useEffect(() => {
    setChildName(localStorage.getItem("childName") || "");
    setChildGrade(localStorage.getItem("childGrade") || "");
    try { const f = localStorage.getItem("footDiagnosis"); if (f) setFootResult(JSON.parse(f)); } catch {}
    try { const b = localStorage.getItem("bodyDiagnosis"); if (b) setBodyResult(JSON.parse(b)); } catch {}
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (loggedIn) loadMembership();
    else setMemLoaded(true);
  }, [ready, loggedIn, loadMembership]);

  useEffect(() => {
    if (tab !== "home") return;
    setAiLoading(true);
    const ctx = `名前:${childName || "未設定"} 学年:${childGrade || "未設定"}`;
    fetch("/api/mypage-advice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ context: ctx }) })
      .then((r) => r.json()).then((d) => setAiAdvice(d.advice || "今日も楽しくプレーしよう！⚽")).catch(() => setAiAdvice("今日も楽しくプレーしよう！⚽")).finally(() => setAiLoading(false));
  }, [tab, childName, childGrade]);

  const startTrial = async () => {
    if (!loggedIn) { login(); return; }
    await fetch("/api/trial/start", { method: "POST" });
    await loadMembership();
    alert("3日間の無料お試しを開始しました！");
  };

  const showTrialOffer = ready && loggedIn && memLoaded && !plan && !active;
  const showTrialRemaining = ready && loggedIn && !plan && active && trialDaysLeft > 0;

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "16px 16px 56px", maxWidth: 820 }}>
        {/* ヒーロー */}
        <div style={{ position: "relative", borderRadius: "var(--kf-radius)", overflow: "hidden", minHeight: 220 }}>
          <img src="/images/kf/hero.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.8),rgba(0,0,0,.2))" }} />
          <div style={{ position: "relative", padding: 24, color: "#fff", display: "flex", flexDirection: "column", height: "100%", minHeight: 220 }}>
            <Link href="/" style={{ color: "#fff", textDecoration: "none", fontSize: 13, opacity: .9 }}>← ホーム</Link>
            <div style={{ marginTop: "auto" }}>
              <div style={{ fontSize: 12, letterSpacing: 2, opacity: .85 }}>MY PAGE</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{childName ? `${childName}選手` : "マイページ"}</div>
            </div>
            <div style={{ position: "absolute", right: 20, bottom: 20 }}>
              {plan
                ? <span className="kf-badge" style={{ background: "var(--kf-accent)", color: "#3a2e0a" }}>{plan}会員</span>
                : loggedIn
                  ? <Link href="/member" className="kf-btn kf-btn--primary" style={{ padding: "10px 18px" }}>登録する ›</Link>
                  : <button onClick={login} className="kf-btn kf-btn--primary" style={{ padding: "10px 18px", border: "none", cursor: "pointer" }}>LINEでログイン</button>}
            </div>
          </div>
        </div>

        {/* 未ログイン案内 */}
        {ready && !loggedIn && (
          <div className="kf-card" style={{ marginTop: 14, padding: 16, textAlign: "center" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>LINEでログインすると会員機能が使えます</div>
            <div style={{ fontSize: 12, color: "var(--kf-muted)", marginBottom: 10 }}>無料お試し・セレクション情報・会員ステータスの保存</div>
            <button onClick={login} className="kf-btn kf-btn--primary" style={{ padding: "10px 20px", border: "none", cursor: "pointer" }}>LINEでログイン</button>
          </div>
        )}

        {/* 3日間無料お試し（ログイン・未登録・未トライアル時のみ） */}
        {showTrialOffer && (
          <div className="kf-card" style={{ marginTop: 14, padding: 0, overflow: "hidden", display: "flex", alignItems: "center", position: "relative", minHeight: 96 }}>
            <img src="/images/kf/panels/p_shoes.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .25 }} />
            <div style={{ position: "relative", padding: "16px 20px", flex: 1 }}>
              <div style={{ fontWeight: 800 }}>🎁 3日間無料お試し</div>
              <div style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 2 }}>カード不要で全機能を体験</div>
            </div>
            <button onClick={startTrial} className="kf-btn kf-btn--ghost" style={{ position: "relative", marginRight: 16, padding: "10px 18px", background: "#fff" }}>今すぐ試す ›</button>
          </div>
        )}
        {showTrialRemaining && (
          <div className="kf-card" style={{ marginTop: 14, padding: 16, textAlign: "center", background: "var(--kf-primary-soft)", border: "none" }}>
            <span style={{ fontWeight: 700 }}>無料お試し残り {trialDaysLeft} 日</span>
            <Link href="/member" style={{ marginLeft: 12, color: "var(--kf-primary)", fontWeight: 700, fontSize: 13 }}>プレミアムに登録 ›</Link>
          </div>
        )}

        {/* タブ */}
        <div style={{ display: "flex", gap: 4, background: "var(--kf-surface)", padding: 4, borderRadius: 12, margin: "16px 0" }}>
          {([["home", "ホーム"], ["status", "ステータス"], ["settings", "設定"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ flex: 1, padding: "10px", border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 13,
                background: tab === k ? "#fff" : "transparent", color: tab === k ? "var(--kf-primary)" : "var(--kf-muted)",
                boxShadow: tab === k ? "0 1px 4px rgba(0,0,0,.08)" : "none" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "home" && (
          <>
            <div className="kf-card" style={{ padding: 18, marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ width: 40, height: 40, borderRadius: 999, background: "var(--kf-primary)", display: "grid", placeItems: "center", flexShrink: 0, color: "#fff", fontSize: 18 }}>⚽</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "var(--kf-primary)" }}>TODAY'S ADVICE</div>
                  <p style={{ fontSize: 13, lineHeight: 1.8, margin: "6px 0 0" }}>{aiLoading ? "アドバイスを読み込み中…" : aiAdvice}</p>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "var(--kf-muted)", marginBottom: 10 }}>QUICK ACCESS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {QUICK.map((q) => (
                <Link key={q.label} href={q.href} style={{ position: "relative", borderRadius: "var(--kf-radius)", overflow: "hidden", height: 90, textDecoration: "none", display: "block" }}>
                  <img src={q.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.25))" }} />
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#fff", fontWeight: 800, fontSize: 14 }}>{q.label}</span>
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#fff", opacity: .8 }}>›</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {tab === "status" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div className="kf-card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>AI足型診断</div>
              {footResult ? <pre style={{ fontSize: 12, whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(footResult, null, 2)}</pre>
                : <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>まだ診断していません。<Link href="/foot-check" style={{ color: "var(--kf-primary)" }}>診断する ›</Link></div>}
            </div>
            <div className="kf-card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>体格診断</div>
              {bodyResult ? <pre style={{ fontSize: 12, whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(bodyResult, null, 2)}</pre>
                : <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>まだ診断していません。<Link href="/body-check" style={{ color: "var(--kf-primary)" }}>診断する ›</Link></div>}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="kf-card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>選手情報</div>
            <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>お名前</label>
            <input value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="例: 太郎"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 12px", fontSize: 14 }} />
            <label style={{ fontSize: 12, color: "var(--kf-muted)" }}>学年</label>
            <input value={childGrade} onChange={(e) => setChildGrade(e.target.value)} placeholder="例: 小5"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--kf-border)", margin: "4px 0 14px", fontSize: 14 }} />
            <button onClick={() => { localStorage.setItem("childName", childName); localStorage.setItem("childGrade", childGrade); alert("保存しました！"); }}
              className="kf-btn kf-btn--primary" style={{ padding: "10px 20px" }}>保存する</button>
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--kf-border)", fontSize: 13 }}>
              会員状態: {plan ? `${plan}会員` : active && trialDaysLeft > 0 ? `無料お試し（残り${trialDaysLeft}日）` : "未登録"}
              {!plan && <Link href="/member" style={{ marginLeft: 10, color: "var(--kf-primary)" }}>プレミアムを見る ›</Link>}
            </div>
          </div>
        )}

        {/* プレミアム会員限定バナー */}
        <Link href="/member" style={{ display: "block", marginTop: 18, position: "relative", borderRadius: "var(--kf-radius)", overflow: "hidden", minHeight: 80, textDecoration: "none" }}>
          <img src="/images/kf/area_tokyo.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.85),rgba(0,0,0,.4))" }} />
          <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", color: "#fff" }}>
            <span>
              <span style={{ display: "block", fontWeight: 800, color: "var(--kf-accent)" }}>👑 プレミアム会員限定</span>
              <span style={{ fontSize: 13 }}>セレクション情報・チームリンク</span>
            </span>
            <span style={{ background: "var(--kf-accent)", color: "#3a2e0a", padding: "10px 18px", borderRadius: 999, fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>¥500/月〜 ›</span>
          </span>
        </Link>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
