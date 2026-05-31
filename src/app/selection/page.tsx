"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { getSelections } from "@/lib/selections";

const FREE_LIMIT = 2; // 無料で見られる件数

export default function SelectionPage() {
  const [isPremium, setIsPremium] = useState(false);
  useEffect(() => {
    try { setIsPremium(!!localStorage.getItem("memberPlan")); } catch {}
  }, []);

  const all = getSelections();
  const visible = isPremium ? all : all.slice(0, FREE_LIMIT);
  const lockedCount = all.length - visible.length;

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "28px 16px 56px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Jリーグ・JFL下部組織 セレクション情報センター</h1>
        <p style={{ fontSize: 14, color: "var(--kf-muted)", margin: "0 0 20px" }}>
          各クラブが公式発表した募集要項（日時・会場・対象・申込先）を出典付きでまとめます。合否の傾向や合格率は扱いません。
        </p>

        {all.length === 0 ? (
          <div className="kf-empty">
            <div className="kf-empty__title">掲載準備中です</div>
            <div className="kf-empty__hint">各クラブの公式募集が確定次第、日時・会場・申込URLを出典付きで掲載します。</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {visible.map((s) => (
              <div key={s.id} className="kf-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontWeight: 800 }}>{s.club}<span className="kf-badge" style={{ marginLeft: 8 }}>{s.category}</span></div>
                  <span className="kf-badge kf-badge--deadline">締切 {s.deadline}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 8, lineHeight: 1.8 }}>
                  開催: {s.date}／会場: {s.venue}／対象: {s.target}／エリア: {s.area}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <a href={s.applyUrl} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>公式申込ページ</a>
                  <span style={{ fontSize: 12, color: "var(--kf-muted)" }}>出典: {s.source}</span>
                </div>
              </div>
            ))}

            {lockedCount > 0 && (
              <div className="kf-card" style={{ padding: 28, textAlign: "center", background: "var(--kf-primary-soft)", border: "none" }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>続き{lockedCount}件はプレミアム会員限定</div>
                <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "8px 0 14px" }}>Jリーグ・JFL下部組織のセレクション情報をすべて閲覧＋締切リマインドが使えます。</p>
                <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "12px 24px" }}>プレミアムを見る</Link>
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 24 }}>
          ※掲載情報は各クラブ公式発表に基づきます。最新の募集要項は必ず公式でご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
