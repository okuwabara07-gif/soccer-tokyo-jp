import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import SelectionClient from "@/components/SelectionClient";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { isActiveSelection, todayJst } from "@/lib/club-quality";

export const metadata = pageMeta(
  "/selection",
  "セレクション情報｜関東・関西のジュニアユース・ジュニア募集一覧 | サッカーセレクション",
  "関東・関西のジュニアユース・ジュニアのセレクション・練習会の日程・会場・申込先を、情報元へのリンクつきで一覧にまとめています。"
);

export const revalidate = 3600;

type Selection = {
  id: string; slug: string; club_name: string; prefecture: string; city: string;
  selection_type: string; event_date: string; event_date_end: string; apply_deadline: string; venue: string;
  apply_url: string | null; title: string; is_jleague: boolean;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SelectionPage() {
  const { data: allSelections, error } = await supabase
    .from("selections")
    .select("id,club_id,selection_type,title,event_date,event_date_end,apply_deadline,venue,apply_url,clubs(slug,name,prefecture,city,club_type)")
    .eq("status", "published")
    .order("event_date", { ascending: false });

  if (error) {
    console.error("[SelectionPage] Supabase error:", error);
  }

  const selections: Selection[] = (allSelections || [])
    .map((row: any) => ({
      id: row.id,
      slug: row.clubs?.slug || "",
      club_name: row.clubs?.name || "",
      prefecture: row.clubs?.prefecture || "",
      city: row.clubs?.city || "",
      selection_type: row.selection_type || "",
      event_date: row.event_date || "",
      event_date_end: row.event_date_end || "",
      title: row.title || "",
      is_jleague: row.clubs?.club_type === "j_academy",
      apply_deadline: row.apply_deadline || "",
      venue: row.venue || "",
      apply_url: row.apply_url || null,
    }));

  const today = todayJst();
  const isActive = (x: Selection) => isActiveSelection({ event_date: x.event_date || null, event_date_end: x.event_date_end || null }, today);
  // 受付中・開催予定（日付の近い順）→ 随時受付 の順に並べる
  const current = selections
    .filter(isActive)
    .sort((a, b) => (a.event_date || "9999").localeCompare(b.event_date || "9999"));
  const past = selections.filter((x) => !isActive(x));

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>セレクション情報センター</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px", lineHeight: 1.7 }}>
          関東・関西のジュニアユース・ジュニアのセレクション開催情報。日程・会場・申込先をまとめています。合否の傾向や合格率は扱いません。
        </p>
        <SelectionClient selections={current} />

        {past.length > 0 && (
          <section style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 6px" }}>過去の実施例（受付終了）</h2>
            <p style={{ fontSize: 12, color: "var(--kf-muted)", margin: "0 0 12px", lineHeight: 1.7 }}>
              今年度に実施されたセレクション・練習会です（{past.length}件）。翌年度の募集時期の目安としてご覧ください。
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.9 }}>
              {past.map((x) => (
                <li key={x.id}>
                  {x.event_date ? x.event_date.slice(5).replace("-", "/") : ""}{"　"}
                  {x.slug ? <Link href={`/clubs/${x.slug}`} style={{ color: "var(--kf-primary)" }}>{x.club_name}</Link> : x.club_name}
                  {"　"}{x.selection_type}（{x.prefecture}{x.city}）
                </li>
              ))}
            </ul>
          </section>
        )}
        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 20, lineHeight: 1.7 }}>
          ※掲載情報は変更される場合があります。応募前に必ず各クラブ公式サイトで最新の募集要項をご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
