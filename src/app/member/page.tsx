"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLineAuth } from "@/components/LineLogin";

const PLANS = [
  { id: "papa_mama", name: "パパママ応援プラン", price: "¥4,500", sub: "6ヶ月一括", badge: "一番お得", badgeColor: "#854F0B", badgeBg: "#FAEEDA", features: ["Jリーグ/JFL下部組織セレクション情報フル閲覧", "セレクション締切リマインド通知", "AI診断フル開放（足型・体格・栄養）", "お気に入りチーム無制限", "診断結果・締切一覧のPDF保存"], highlight: true },
  { id: "standard", name: "スタンダード", price: "¥500", sub: "月額", badge: "まずはここから", badgeColor: "#0C447C", badgeBg: "#E6F1FB", features: ["Jリーグ/JFL下部組織セレクション情報フル閲覧", "セレクション締切リマインド通知", "AI診断フル開放（足型・体格・栄養）", "お気に入りチーム無制限"], highlight: false },
  { id: "premium", name: "プレミアム", price: "¥1,500", sub: "月額", badge: "しっかりサポート", badgeColor: "#3C3489", badgeBg: "#EEEDFE", features: ["スタンダード全機能", "診断結果・締切一覧のPDF保存", "過去のセレクション開催履歴", "新着セレクションの優先通知"], highlight: false },
];

export default function MemberPage() {
  const router = useRouter();
  const { ready, loggedIn, name, login } = useLineAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [inviteMsg, setInviteMsg] = useState("");

  useEffect(() => {
    if (inviteStatus === "success") {
      const timer = setTimeout(() => { router.push("/mypage"); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inviteStatus, router]);

  const handleCheckout = async (planId: string) => {
    if (!loggedIn) { login(); return; }
    setLoading(planId);
    const res = await fetch("/api/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planId }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  };

  const handleInviteCode = async () => {
    if (!loggedIn) { login(); return; }
    if (!inviteCode.trim()) return;
    setInviteStatus("loading");
    try {
      const res = await fetch("/api/use-invite-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: inviteCode.trim() }) });
      const data = await res.json();
      if (res.ok) {
        setInviteStatus("success");
        setInviteMsg("✅ 招待コードが適用されました！プレミアム会員として登録されました。");
      } else {
        setInviteStatus("error");
        setInviteMsg(data.error || "❌ 無効なコードです");
      }
    } catch {
      setInviteStatus("error");
      setInviteMsg("❌ エラーが発生しました");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "-apple-system,sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#0a0a0a", padding: "20px 16px 16px" }}>
          <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 8, cursor: "pointer", padding: 0 }}>← 戻る</button>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 300, marginBottom: 4 }}>会員プランを選ぶ</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>セレクション申込URL・詳細情報を閲覧できます</p>
        </div>
        <div style={{ padding: 16 }}>

          {/* ログイン状態 */}
          {ready && !loggedIn && (
            <div style={{ background: "white", borderRadius: 14, border: "2px solid #06c755", padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: "#067a3a" }}>登録・招待コードの利用にはLINEログインが必要です</p>
              <button onClick={login} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: "#06c755", color: "#fff" }}>LINEでログイン</button>
            </div>
          )}
          {ready && loggedIn && (
            <div style={{ fontSize: 12, color: "#2e7d32", marginBottom: 12 }}>✓ LINEログイン中{name ? `（${name}）` : ""}</div>
          )}

          {/* 招待コード */}
          <div style={{ background: "white", borderRadius: 14, border: "2px solid #4CAF50", padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: "#2e7d32" }}>🎟️ 招待コードをお持ちの方</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="招待コードを入力"
                style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none" }} />
              <button onClick={handleInviteCode} disabled={inviteStatus === "loading" || inviteStatus === "success"}
                style={{ padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: "#4CAF50", color: "white", whiteSpace: "nowrap" }}>
                {inviteStatus === "loading" ? "確認中..." : "適用する"}
              </button>
            </div>
            {inviteMsg && <p style={{ fontSize: 12, marginTop: 8, color: inviteStatus === "success" ? "#2e7d32" : "#c62828" }}>{inviteMsg}</p>}
          </div>

          {inviteStatus !== "success" && PLANS.map((plan) => (
            <div key={plan.id} style={{ background: "white", borderRadius: 14, border: plan.highlight ? "2px solid #c9a84c" : "1px solid #eeeeea", padding: "14px 16px", marginBottom: 10, position: "relative" }}>
              {plan.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#c9a84c", color: "white", fontSize: 9, padding: "3px 12px", borderRadius: 10, fontWeight: 500, whiteSpace: "nowrap" }}>一番お得</div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 500, background: plan.badgeBg, color: plan.badgeColor }}>{plan.badge}</span>
                  <p style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{plan.name}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 22, fontWeight: 300, lineHeight: 1 }}>{plan.price}</p>
                  <p style={{ fontSize: 10, color: "#999" }}>{plan.sub}</p>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>{plan.features.map((f) => <div key={f} style={{ fontSize: 11, color: "#444", padding: "2px 0" }}>✓ {f}</div>)}</div>
              <button onClick={() => handleCheckout(plan.id)} disabled={loading === plan.id}
                style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: plan.highlight ? "#c9a84c" : "#1a1a1a", color: "white" }}>
                {loading === plan.id ? "処理中..." : loggedIn ? plan.name + "に登録する" : "LINEログインして登録"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
