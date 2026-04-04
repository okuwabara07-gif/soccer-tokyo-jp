"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NAV_ITEMS = [
  { label:"チーム検索", href:"/teams" },
  { label:"カレンダー", href:"/calendar" },
  { label:"栄養管理", href:"/nutrition" },
  { label:"シューズ", href:"/shoes" },
  { label:"AI足型診断", href:"/foot-camera" },
  { label:"体格診断", href:"/body-check" },
  { label:"会員登録", href:"/member" },
];

const CATEGORIES = [
  { key:"ジュニア",       label:"ジュニア",       sub:"小学生以下", color:"#00b4d8", live:true },
  { key:"ジュニアユース", label:"ジュニアユース", sub:"中学生",     color:"#e63946", live:true },
  { key:"ユース",         label:"ユース",         sub:"高校生",     color:"#2d6a4f", live:false },
  { key:"一般・社会人",   label:"一般・社会人",   sub:"大学生以上", color:"#f4a261", live:false },
];

export default function HomePage() {
  const [counts, setCounts] = useState<Record<string,number>>({});
  const [total, setTotal] = useState(0);
  const [selectedCat, setSelectedCat] = useState("ジュニア");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("teams").select("category");
      if (data) {
        const c: Record<string,number> = {};
        data.forEach((t:any) => { c[t.category] = (c[t.category]??0)+1; });
        setCounts(c); setTotal(data.length);
      }
    })();
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCat = CATEGORIES.find(c => c.key === selectedCat)!;

  return (
    <div style={{ fontFamily:"'Noto Sans JP',sans-serif", background:"#0a0e1a", minHeight:"100vh", color:"#fff" }}>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200,
        background: scrolled?"rgba(10,14,26,0.96)":"transparent",
        backdropFilter: scrolled?"blur(12px)":"none",
        borderBottom: scrolled?"1px solid rgba(255,255,255,0.08)":"none",
        transition:"all 0.3s", padding:"0 20px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex",
          justifyContent:"space-between", alignItems:"center", height:"52px" }}>
          <Link href="/" style={{ fontWeight:900, fontSize:"14px", color:"#fff", textDecoration:"none" }}>
            ⚽ 関東ジュニアサッカー
          </Link>
          <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}
                style={{ color:"rgba(255,255,255,0.8)", textDecoration:"none", fontSize:"12px", fontWeight:500, whiteSpace:"nowrap" }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ position:"relative", height:"100vh", minHeight:"600px", overflow:"hidden",
        background:"linear-gradient(135deg,#0a0e27 0%,#1a1a4e 40%,#0057b8 100%)" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,1) 80px,rgba(255,255,255,1) 81px),repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,1) 80px,rgba(255,255,255,1) 81px)" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", textAlign:"center", padding:"0 20px", paddingTop:"52px" }}>
          <div style={{ fontSize:"11px", letterSpacing:"6px", color:"#7ab3ff", marginBottom:"14px" }}>TOKYO & KANTO SOCCER</div>
          <h1 style={{ fontSize:"clamp(30px,6vw,68px)", fontWeight:900, margin:"0 0 14px", lineHeight:1.1, letterSpacing:"-2px" }}>
            関東ジュニア<br/>サッカー情報局
          </h1>
          <p style={{ fontSize:"clamp(13px,2vw,17px)", color:"rgba(255,255,255,0.7)", marginBottom:"32px" }}>
            {total > 0 ? `${total.toLocaleString()} チーム登録中 — 地図・カテゴリーで検索` : "チームを探す・つながる・成長する"}
          </p>
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center" }}>
            <Link href="/teams" style={{ padding:"13px 30px", background:"#e63946", color:"#fff",
              borderRadius:"12px", fontWeight:800, fontSize:"15px", textDecoration:"none",
              boxShadow:"0 4px 20px rgba(230,57,70,0.45)" }}>チームを探す</Link>
            <Link href="/body-check" style={{ padding:"13px 30px", background:"rgba(255,255,255,0.12)",
              color:"#fff", borderRadius:"12px", fontWeight:700, fontSize:"15px", textDecoration:"none",
              border:"1px solid rgba(255,255,255,0.25)" }}>体格診断</Link>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:"20px", left:"50%", transform:"translateX(-50%)",
          color:"rgba(255,255,255,0.35)", fontSize:"11px", textAlign:"center" }}>scroll ↓</div>
      </div>

      <div style={{ background:"#0f1320", padding:"56px 20px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <div style={{ fontSize:"10px", letterSpacing:"4px", color:"#7ab3ff", marginBottom:"6px" }}>CATEGORY</div>
            <h2 style={{ fontSize:"clamp(20px,4vw,34px)", fontWeight:900, margin:0 }}>カテゴリーから探す</h2>
          </div>
          <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap", marginBottom:"24px" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setSelectedCat(cat.key)}
                style={{ padding:"10px 22px", borderRadius:"24px", border:"none", cursor:"pointer",
                  fontWeight:700, fontSize:"14px", color:"#fff", transition:"all 0.2s",
                  background: selectedCat===cat.key ? cat.color : "rgba(255,255,255,0.08)",
                  boxShadow: selectedCat===cat.key ? `0 4px 16px ${cat.color}55` : "none" }}>
                {cat.label}
                {!cat.live
                  ? <span style={{ marginLeft:"5px", fontSize:"9px", background:"rgba(255,255,255,0.2)", padding:"1px 5px", borderRadius:"6px" }}>SOON</span>
                  : counts[cat.key] ? <span style={{ marginLeft:"5px", fontSize:"11px", opacity:0.75 }}>({counts[cat.key]})</span> : null}
              </button>
            ))}
          </div>
          <div style={{ borderRadius:"18px", overflow:"hidden", position:"relative", height:"300px",
            background: activeCat.live ? `linear-gradient(135deg,${activeCat.color}30,#0f1320)` : "#1a1a2e",
            border:`1px solid ${activeCat.color}30` }}>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
              justifyContent:"flex-end", padding:"28px 32px" }}>
              {!activeCat.live ? (
                <>
                  <span style={{ display:"inline-block", background:"rgba(255,255,255,0.12)",
                    border:"1px solid rgba(255,255,255,0.25)", color:"#fff", fontSize:"11px",
                    fontWeight:700, padding:"4px 14px", borderRadius:"20px", letterSpacing:"2px",
                    marginBottom:"10px", width:"fit-content" }}>COMING SOON</span>
                  <h3 style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:900, margin:"0 0 6px" }}>{activeCat.label}</h3>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", margin:0 }}>{activeCat.sub} — 近日公開予定</p>
                </>
              ) : (
                <>
                  <span style={{ display:"inline-block", background:activeCat.color, color:"#fff",
                    fontSize:"12px", fontWeight:700, padding:"4px 14px", borderRadius:"20px",
                    marginBottom:"10px", width:"fit-content" }}>
                    {counts[activeCat.key] ?? 0} チーム登録中
                  </span>
                  <h3 style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:900, margin:"0 0 6px" }}>{activeCat.label}</h3>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.65)", margin:"0 0 18px" }}>
                    {activeCat.sub}のチームを地図・エリアで検索
                  </p>
                  <Link href={`/teams?category=${encodeURIComponent(activeCat.key)}`}
                    style={{ display:"inline-block", padding:"11px 26px", background:activeCat.color,
                      color:"#fff", borderRadius:"10px", fontWeight:800, fontSize:"14px",
                      textDecoration:"none", width:"fit-content" }}>
                    {activeCat.label}のチームを探す →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:"#0f1320", padding:"44px 20px", textAlign:"center" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto" }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", color:"#7ab3ff", marginBottom:"14px" }}>SPONSOR</div>
          <h3 style={{ fontSize:"18px", fontWeight:800, margin:"0 0 8px" }}>スポンサー募集</h3>
          <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"20px" }}>
            ロゴ掲載・イベント協賛など詳細はお問い合わせください
          </p>
          <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap", marginBottom:"28px" }}>
            {[{plan:"GOLD",color:"#ffd700",icon:"🥇"},{plan:"SILVER",color:"#c0c0c0",icon:"🥈"},{plan:"BRONZE",color:"#cd7f32",icon:"🥉"}].map(sp=>(
              <Link key={sp.plan} href="/member"
                style={{ padding:"12px 20px", border:`1px solid ${sp.color}40`, borderRadius:"10px",
                  textDecoration:"none", color:"#fff", background:`${sp.color}10`,
                  minWidth:"110px", textAlign:"center", display:"block" }}>
                <div style={{ fontSize:"20px" }}>{sp.icon}</div>
                <div style={{ fontWeight:700, fontSize:"13px", color:sp.color }}>{sp.plan}</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)" }}>お問い合わせ</div>
              </Link>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:"20px" }}>
            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", marginBottom:"10px" }}>シェア</div>
            <div style={{ display:"flex", gap:"8px", justifyContent:"center" }}>
              {[
                {label:"X",bg:"#1d9bf0",href:`https://twitter.com/intent/tweet?text=${encodeURIComponent("関東ジュニアサッカー情報局")}`},
                {label:"LINE",bg:"#00b900",href:`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://soccer-tokyo-jp.vercel.app")}`},
                {label:"Facebook",bg:"#1877f2",href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://soccer-tokyo-jp.vercel.app")}`},
              ].map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ padding:"7px 16px", background:s.bg, color:"#fff", borderRadius:"7px", fontWeight:600, fontSize:"12px", textDecoration:"none" }}>{s.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
