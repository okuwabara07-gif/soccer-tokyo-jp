import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import StatBar from "@/components/StatBar";
import SectionHeader from "@/components/SectionHeader";
import SiteFooter from "@/components/SiteFooter";

const BIG = [
  { label: "チームを探す", href: "/teams", img: "/images/kf/panels/p_teams.jpg", desc: "全国6,000チームから検索", color: "var(--kf-primary)" },
  { label: "セレクション情報", href: "/selection", img: "/images/kf/panels/p_selection.jpg", desc: "最新の募集・セレクションをチェック", color: "#2F6FDB" },
  { label: "口コミランキング", href: "/reviews", img: "/images/kf/panels/p_reviews.jpg", desc: "保護者のリアルな声をチェック", color: "var(--kf-accent-dark)" },
];
const SUPPORT = [
  { label: "準備物・グッズ", href: "/goods", img: "/images/kf/panels/p_goods.jpg", desc: "必要なものをチェック" },
  { label: "スパイク診断", href: "/shoes", img: "/images/kf/panels/p_shoes.jpg", desc: "最適なスパイクを見つける" },
  { label: "栄養・補食ガイド", href: "/nutrition", img: "/images/kf/panels/p_nutrition.jpg", desc: "成長を支える食事のヒント" },
  { label: "AI足型診断", href: "/foot-check", img: "/images/kf/panels/p_foot.jpg", desc: "足の特徴をAIが診断" },
  { label: "体格診断", href: "/body-check", img: "/images/kf/panels/p_body.jpg", desc: "体格に合ったポジションを提案" },
];
const FUN = [
  { label: "ゴールパフォーマンス図鑑", href: "/performance", img: "/images/kf/panels/p_performance.jpg", desc: "決め技を動画でチェック" },
  { label: "サッカー漫画", href: "/manga", img: "/images/kf/panels/p_manga.jpg", desc: "人気漫画をチェック" },
  { label: "ポジション別資料", href: "/position", img: "/images/kf/panels/p_position.jpg", desc: "役割や動きを学ぶ" },
  { label: "新ルール・用語", href: "/rules", img: "/images/kf/panels/p_rules.jpg", desc: "最新ルールを分かりやすく解説" },
  { label: "チームマッチング", href: "/matching", img: "/images/kf/panels/p_matching.jpg", desc: "あなたに合うチームを紹介" },
];
const AREAS = [
  { label: "東京エリア", href: "/teams?area=tokyo", img: "/images/kf/area_tokyo.jpg" },
  { label: "神奈川エリア", href: "/teams?area=kanagawa", img: "/images/kf/area_kanagawa.jpg" },
  { label: "埼玉エリア", href: "/teams?area=saitama", img: "/images/kf/area_saitama.jpg" },
  { label: "千葉エリア", href: "/teams?area=chiba", img: "/images/kf/area_chiba.jpg" },
];
const GOODS = ["入団準備ガイド","遠征準備ガイド","夏の暑さ対策ガイド","冬の寒さ対策ガイド","GK専用ガイド","ジュニアユース準備"];

function PanelCard({ p, big=false }: { p:{label:string;href:string;img:string;desc:string;color?:string}; big?:boolean }) {
  return (
    <Link href={p.href} className="kf-card" style={{ overflow:"hidden", textDecoration:"none", color:"var(--kf-text)", display:"block" }}>
      <div style={{ position:"relative", height: big?170:120 }}>
        <img src={p.img} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
      </div>
      <div style={{ padding: big?"16px 18px":"12px 14px" }}>
        <div style={{ fontWeight:800, fontSize: big?17:14 }}>{p.label}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6 }}>
          <span style={{ fontSize:12, color: p.color||"var(--kf-muted)", fontWeight:600 }}>{p.desc}</span>
          <span style={{ color:"var(--kf-muted)" }}>›</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <section style={{ background: "var(--kf-surface)", borderBottom: "1px solid var(--kf-border)" }}>
        <div style={{ position:"relative", maxWidth:"var(--kf-maxw)", margin:"0 auto" }}>
          <div className="kf-hero-wrap" style={{ position:"relative", minHeight:480, display:"flex", alignItems:"center" }}>
            <img src="/images/kf/hero.jpg" alt="サッカーボールを持つ子ども" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"right center" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,#fff 26%,rgba(255,255,255,.82) 44%,rgba(255,255,255,0) 68%)" }} />
            <div style={{ position:"relative", padding:"48px 16px", maxWidth:640 }}>
              <h1 style={{ margin:0, fontSize:42, lineHeight:1.2, fontWeight:800 }}>子どもに合う<br/>サッカーチームを探そう</h1>
              <p style={{ margin:"16px 0 8px", fontSize:18, fontWeight:700, color:"var(--kf-primary)" }}>関東 6,000チーム掲載</p>
              <p style={{ margin:0, color:"var(--kf-muted)", fontSize:14, lineHeight:1.7 }}>東京・神奈川・埼玉・千葉のジュニアサッカー・ジュニアユース・スクールまで完全網羅</p>
              <div style={{ display:"flex", gap:12, marginTop:24, flexWrap:"wrap" }}>
                <Link href="/teams" className="kf-btn kf-btn--primary" style={{ padding:"14px 24px" }}>チームを探す</Link>
                <Link href="/teams#area" className="kf-btn kf-btn--ghost" style={{ padding:"14px 24px" }}>エリアから探す</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kf-container" style={{ padding:"24px 16px 0" }}><StatBar /></section>

      <section className="kf-container" style={{ padding:"40px 16px 0" }}>
        <SectionHeader title="今月のセレクション情報" moreHref="/selection" />
        <div className="kf-empty">
          <div className="kf-empty__title">セレクション情報は準備中です</div>
          <div className="kf-empty__hint">各チームの募集・締切・会場が確定次第ここに掲載します。</div>
          <Link href="/selection" className="kf-btn kf-btn--ghost" style={{ marginTop:8, padding:"10px 18px", fontSize:13 }}>セレクション情報を見る</Link>
        </div>
      </section>

      <section className="kf-container" style={{ padding:"48px 16px 0" }}>
        <h2 style={{ margin:0, fontSize:24, fontWeight:800 }}>何をしたいですか？</h2>
        <p style={{ margin:"6px 0 18px", fontSize:14, color:"var(--kf-muted)" }}>目的に合わせてコンテンツを選ぼう</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {BIG.map(p=><PanelCard key={p.label} p={p} big />)}
        </div>
      </section>

      <section className="kf-container" style={{ padding:"32px 16px 0" }}>
        <h3 style={{ margin:"0 0 14px", fontSize:18, fontWeight:800 }}>準備・成長をサポート</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:14 }}>
          {SUPPORT.map(p=><PanelCard key={p.label} p={p} />)}
        </div>
      </section>

      <section className="kf-container" style={{ padding:"32px 16px 0" }}>
        <h3 style={{ margin:"0 0 14px", fontSize:18, fontWeight:800 }}>楽しむ・学ぶ</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:14 }}>
          {FUN.map(p=><PanelCard key={p.label} p={p} />)}
        </div>
      </section>

      <section id="area" className="kf-container" style={{ padding:"48px 16px 0" }}>
        <SectionHeader title="エリアから人気チームを探す" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
          {AREAS.map(a=>(
            <Link key={a.label} href={a.href} style={{ position:"relative", borderRadius:"var(--kf-radius)", overflow:"hidden", height:120, textDecoration:"none", display:"block" }}>
              <img src={a.img} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
              <span style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,.15))" }} />
              <span style={{ position:"absolute", left:16, bottom:14, color:"#fff", fontWeight:800, fontSize:18 }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="kf-container" style={{ padding:"48px 16px 0" }}>
        <SectionHeader title="保護者口コミランキング" subtitle="送迎負担・雰囲気・育成・費用感などで比較" moreHref="/reviews" />
        <div className="kf-empty">
          <div className="kf-empty__title">口コミ募集中</div>
          <div className="kf-empty__hint">保護者の口コミが集まり次第ランキングを公開します（個人の感想です）。</div>
          <Link href="/reviews" className="kf-btn kf-btn--ghost" style={{ marginTop:8, padding:"10px 18px", fontSize:13 }}>口コミを見る・投稿する</Link>
        </div>
      </section>

      <section className="kf-container" style={{ padding:"48px 16px 0" }}>
        <SectionHeader title="準備物・グッズガイド" subtitle="入団・遠征・季節対策の必需品を解説" moreHref="/goods" />
        <div style={{ marginBottom:10 }}><span className="kf-pr-label">PR</span></div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:14 }}>
          {GOODS.map(g=>(<Link key={g} href="/goods" className="kf-card" style={{ textDecoration:"none", color:"var(--kf-text)", padding:18, fontWeight:700, fontSize:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>{g}<span style={{ color:"var(--kf-primary)" }}>›</span></Link>))}
        </div>
      </section>

      {/* LINE友だち追加導線 */}
      <section className="kf-container" style={{ padding: "40px 16px 0" }}>
        <div className="kf-card" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", background: "#06C755", border: "none" }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: .9 }}>LINE公式アカウント</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>LINEで友だち追加</div>
            <p style={{ margin: "6px 0 0", fontSize: 13, opacity: .95 }}>セレクション情報や最新のお知らせをLINEでお届け。マイカルテ・通知が使えるミニアプリも順次公開予定です。</p>
          </div>
          <a href="https://line.me/R/ti/p/@641jwqts" target="_blank" rel="noopener noreferrer"
            style={{ background: "#fff", color: "#06C755", padding: "12px 24px", borderRadius: 999, fontWeight: 800, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>
            友だち追加する
          </a>
        </div>
      </section>

      <section style={{ background:"var(--kf-surface)", borderTop:"1px solid var(--kf-border)", marginTop:48, padding:"56px 0" }}>
        <div className="kf-container">
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <h2 style={{ margin:0, fontSize:24, fontWeight:800 }}>プレミアム会員</h2>
            <p style={{ margin:"8px 0 0", fontSize:14, color:"var(--kf-muted)" }}>地図検索・お気に入り無制限・締切通知・PDF保存・AI診断</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16, maxWidth:720, margin:"0 auto" }}>
            <div className="kf-card" style={{ padding:24, textAlign:"center" }}>
              <div style={{ fontWeight:700, color:"var(--kf-muted)" }}>月額プラン</div>
              <div style={{ fontSize:30, fontWeight:800, margin:"8px 0" }}>¥500<span style={{ fontSize:14, color:"var(--kf-muted)" }}>/月</span></div>
              <div style={{ fontSize:12, color:"var(--kf-muted)", marginBottom:14 }}>いつでも解約OK</div>
              <Link href="/member" className="kf-btn kf-btn--primary" style={{ padding:"12px 22px", width:"100%" }}>月額で登録</Link>
            </div>
            <div className="kf-card" style={{ padding:24, textAlign:"center", border:"2px solid var(--kf-accent)" }}>
              <div style={{ fontWeight:700, color:"var(--kf-muted)" }}>年額プラン</div>
              <div style={{ fontSize:30, fontWeight:800, margin:"8px 0" }}>¥4,980<span style={{ fontSize:14, color:"var(--kf-muted)" }}>/年</span></div>
              <div style={{ fontSize:12, color:"var(--kf-danger)", marginBottom:14 }}>2ヶ月分お得</div>
              <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding:"12px 22px", width:"100%" }}>年額で登録</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <BottomNav />
      <style>{`@media (max-width:760px){.kf-hero-wrap h1{font-size:30px !important}.kf-hero-wrap>div:last-child{background:rgba(255,255,255,.7)}}`}</style>
    </div>
  );
}
