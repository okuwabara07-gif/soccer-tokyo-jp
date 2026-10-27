import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import { isActiveSelection, todayJst } from "@/lib/club-quality";

// 当サイトに掲載したセレクション・練習会の実データから、月別の開催傾向を集計するページ。
// 「例年いつ頃か」を一般論ではなく掲載実績（件数・クラブ名）で示す。
export const revalidate = 3600;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const KANTO = ["東京都", "神奈川県", "埼玉県", "千葉県", "茨城県", "栃木県", "群馬県", "山梨県"];

type Row = {
  id: string;
  selection_type: string | null;
  event_date: string | null;
  event_date_end: string | null;
  intake_year: number | null;
  clubs: { slug: string; name: string; prefecture: string | null; club_type: string | null } | null;
};

type Cell = { sel: number; prac: number };

function pct(n: number, total: number) {
  return total ? Math.round((n / total) * 100) : 0;
}

export default async function CalendarPage() {
  const { data } = await supabase
    .from("selections")
    .select("id,selection_type,event_date,event_date_end,intake_year,clubs(slug,name,prefecture,club_type)")
    .eq("status", "published")
    .order("event_date", { ascending: true });

  const rows = ((data || []) as unknown as Row[]).filter((r) => r.clubs);
  const dated = rows.filter((r) => r.event_date);
  const rolling = rows.filter((r) => !r.event_date);
  const today = todayJst();
  const upcoming = dated.filter((r) => isActiveSelection(r, today)).slice(0, 12);

  const isSel = (r: Row) => (r.selection_type || "").includes("セレクション");
  const isJ = (r: Row) => r.clubs?.club_type === "j_academy";
  const isKanto = (r: Row) => KANTO.includes(r.clubs?.prefecture || "");

  // 月別集計（4月始まりの年度順）
  const order = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  const byMonth = new Map<number, { all: Cell; j: Cell; town: Cell; kanto: number; other: number; clubs: Map<string, string> }>();
  for (const m of order) byMonth.set(m, { all: { sel: 0, prac: 0 }, j: { sel: 0, prac: 0 }, town: { sel: 0, prac: 0 }, kanto: 0, other: 0, clubs: new Map() });
  for (const r of dated) {
    const m = Number(r.event_date!.slice(5, 7));
    const b = byMonth.get(m)!;
    const key: keyof Cell = isSel(r) ? "sel" : "prac";
    b.all[key]++;
    (isJ(r) ? b.j : b.town)[key]++;
    if (isKanto(r)) b.kanto++;
    else b.other++;
    if (r.clubs?.slug) b.clubs.set(r.clubs.slug, r.clubs.name);
  }
  const months = order.map((m) => ({ m, ...byMonth.get(m)! })).filter((x) => x.all.sel + x.all.prac > 0);
  const maxCount = Math.max(1, ...months.map((x) => x.all.sel + x.all.prac));

  const totalSel = dated.filter(isSel).length;
  const totalPrac = dated.length - totalSel;
  const jRows = dated.filter(isJ);
  const jSel = jRows.filter(isSel);
  const townSel = dated.filter((r) => !isJ(r) && isSel(r));
  const clubCount = new Set(rows.map((r) => r.clubs?.slug)).size;

  const peak = (list: Row[]) => {
    const c = new Map<number, number>();
    for (const r of list) {
      const m = Number(r.event_date!.slice(5, 7));
      c.set(m, (c.get(m) || 0) + 1);
    }
    const sorted = [...c.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0] ? { month: sorted[0][0], n: sorted[0][1] } : null;
  };
  const share = (list: Row[], months: number[]) => pct(list.filter((r) => months.includes(Number(r.event_date!.slice(5, 7)))).length, list.length);

  const jPeak = peak(jSel);
  const townPeak = peak(townSel);
  const pracPeak = peak(dated.filter((r) => !isSel(r)));
  const jMayJul = share(jSel, [5, 6, 7]);
  const townJulOn = share(townSel, [7, 8, 9, 10, 11]);
  const firstDate = dated[0]?.event_date;
  const lastDate = dated[dated.length - 1]?.event_date;
  const fmt = (d?: string | null) => (d ? `${Number(d.slice(5, 7))}月${Number(d.slice(8, 10))}日` : "");

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>セレクション年間カレンダー（2026年度の掲載実績）</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px", lineHeight: 1.8 }}>
          当サイトが各クラブの公式サイト・公式SNSで確認して掲載した、ジュニアユース（中学生）・ジュニアのセレクションと練習会
          {dated.length}件（{clubCount}クラブ）を月別に集計しました。「例年いつ頃動けばよいか」を、実際の開催日から読み取るためのページです。
        </p>

        <section style={box}>
          <h2 style={h2}>集計からわかること</h2>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.9 }}>
            <li>
              掲載した開催日は{fmt(firstDate)}〜{fmt(lastDate)}。内訳はセレクション{totalSel}件・練習会（体験会）{totalPrac}件です。
            </li>
            {jPeak && (
              <li>
                Jリーグ下部組織のセレクション{jSel.length}件のうち{jMayJul}%が5〜7月に集中し、最多は{jPeak.month}月（{jPeak.n}件）。小6の春には要項の公開を確認し始める必要があります。
              </li>
            )}
            {townPeak && (
              <li>
                街クラブのセレクション{townSel.length}件は最多が{townPeak.month}月（{townPeak.n}件）で、{townJulOn}%が7月以降。Jの結果が出たあとに受けられる日程が多く組まれています。
              </li>
            )}
            {pracPeak && (
              <li>
                練習会・体験会は{pracPeak.month}月が最多（{pracPeak.n}件）。セレクション本番の1〜2か月前に開かれるケースが目立ちます。
              </li>
            )}
            {rolling.length > 0 && (
              <li>日程を決めず「随時受付」としているクラブも{rolling.length}件あります。時期を逃しても、問い合わせれば体験できる場合があります。</li>
            )}
          </ul>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={h2}>月別の開催件数</h2>
          <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "0 0 10px" }}>
            <span style={{ ...dot, background: "#d97706" }} />セレクション　<span style={{ ...dot, background: "#60a5fa" }} />練習会・体験会
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {months.map((x) => {
              const n = x.all.sel + x.all.prac;
              return (
                <div key={x.m} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <span style={{ width: 34, flexShrink: 0, fontWeight: 700 }}>{x.m}月</span>
                  <div style={{ flex: 1, display: "flex", height: 16, borderRadius: 4, overflow: "hidden", background: "var(--kf-border, #eee)" }}>
                    <div style={{ width: `${(x.all.sel / maxCount) * 100}%`, background: "#d97706" }} />
                    <div style={{ width: `${(x.all.prac / maxCount) * 100}%`, background: "#60a5fa" }} />
                  </div>
                  <span style={{ width: 36, textAlign: "right", flexShrink: 0 }}>{n}件</span>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginTop: 24, overflowX: "auto" }}>
          <h2 style={h2}>Jリーグ下部組織と街クラブの比較</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 360 }}>
            <thead>
              <tr>
                <th style={th}>月</th>
                <th style={th}>J下部 セレクション</th>
                <th style={th}>J下部 練習会</th>
                <th style={th}>街クラブ セレクション</th>
                <th style={th}>街クラブ 練習会</th>
              </tr>
            </thead>
            <tbody>
              {months.map((x) => (
                <tr key={x.m}>
                  <td style={td}>{x.m}月</td>
                  <td style={td}>{x.j.sel || "—"}</td>
                  <td style={td}>{x.j.prac || "—"}</td>
                  <td style={td}>{x.town.sel || "—"}</td>
                  <td style={td}>{x.town.prac || "—"}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>計</td>
                <td style={{ ...td, fontWeight: 700 }}>{jSel.length}</td>
                <td style={{ ...td, fontWeight: 700 }}>{jRows.length - jSel.length}</td>
                <td style={{ ...td, fontWeight: 700 }}>{townSel.length}</td>
                <td style={{ ...td, fontWeight: 700 }}>{dated.length - jRows.length - townSel.length}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={h2}>月ごとの開催クラブ</h2>
          <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "0 0 10px", lineHeight: 1.7 }}>
            その月にセレクションか練習会を行ったクラブです。クラブ名から月謝・練習日・過去の募集内容を確認できます。
          </p>
          {months.map((x) => {
            const clubs = [...x.clubs.entries()];
            return (
              <details key={x.m} style={{ ...box, padding: "10px 14px", marginBottom: 8 }}>
                <summary style={{ fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  {x.m}月：{clubs.length}クラブ（関東{x.kanto}件・関東以外{x.other}件）
                </summary>
                <p style={{ fontSize: 13, lineHeight: 2, margin: "8px 0 0" }}>
                  {clubs.map(([slug, name], i) => (
                    <span key={slug}>
                      {i > 0 && "／"}
                      <Link href={`/clubs/${slug}`} style={{ color: "var(--kf-primary)" }}>{name}</Link>
                    </span>
                  ))}
                </p>
              </details>
            );
          })}
        </section>

        {upcoming.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <h2 style={h2}>これから開催される募集</h2>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.9 }}>
              {upcoming.map((r) => (
                <li key={r.id}>
                  {fmt(r.event_date)}
                  <Link href={`/clubs/${r.clubs!.slug}`} style={{ color: "var(--kf-primary)" }}>{r.clubs!.name}</Link>
                  　{r.selection_type}（{r.clubs!.prefecture}）
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              <Link href="/selection" style={{ color: "var(--kf-primary)", fontWeight: 700 }}>募集一覧をすべて見る →</Link>
            </p>
          </section>
        )}

        <section style={{ ...box, marginTop: 24 }}>
          <h2 style={h2}>この集計から逆算した動き方（小学6年生の場合）</h2>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.9 }}>
            <li><b>3〜4月</b>：候補クラブを5〜10に絞り、公式サイト・SNSをフォロー。J下部は5月開催もあるため、この時期に要項が出ます。</li>
            <li><b>5〜7月</b>：J下部のセレクションと、街クラブの練習会が重なる山場。日程が重なる場合は、第一志望を優先して申込順を決めます。</li>
            <li><b>7〜10月</b>：街クラブのセレクションが本格化。J下部の結果を見てから受けられる日程を確保しておきます。</li>
            <li><b>11月以降</b>：募集枠に空きがあるクラブの追加募集や「随時受付」を確認します。</li>
          </ol>
          <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "10px 0 0", lineHeight: 1.7 }}>
            関連：<Link href="/column/selection-junbi-kiso" style={{ color: "var(--kf-primary)" }}>セレクション準備の基本</Link>
          </p>
        </section>

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 20, lineHeight: 1.7 }}>
          ※集計対象は当サイトに掲載した募集のみで、すべてのクラブを網羅したものではありません。開催日は年度によって変わります。応募前に必ず各クラブ公式サイトで最新の募集要項をご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}

const box: React.CSSProperties = { background: "var(--kf-card, #fff)", border: "1px solid var(--kf-border, #e5e7eb)", borderRadius: 12, padding: 16 };
const h2: React.CSSProperties = { fontSize: 17, fontWeight: 800, margin: "0 0 10px" };
const th: React.CSSProperties = { borderBottom: "2px solid var(--kf-border, #e5e7eb)", padding: "6px 4px", textAlign: "left", fontSize: 12 };
const td: React.CSSProperties = { borderBottom: "1px solid var(--kf-border, #e5e7eb)", padding: "6px 4px" };
const dot: React.CSSProperties = { display: "inline-block", width: 10, height: 10, borderRadius: 2, marginRight: 4, verticalAlign: "middle" };
