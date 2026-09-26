import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import SelectionClient from "@/components/SelectionClient";

export const revalidate = 3600;

type Selection = {
  id: string; slug: string; club_name: string; prefecture: string; city: string;
  selection_type: string; event_date: string; apply_deadline: string; venue: string;
  apply_url: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SelectionPage() {
  const { data: allSelections, error } = await supabase
    .from("selections")
    .select("id,club_id,selection_type,event_date,apply_deadline,venue,apply_url,clubs(slug,name,prefecture,city)")
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
      apply_deadline: row.apply_deadline || "",
      venue: row.venue || "",
      apply_url: row.apply_url || null,
    }));

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>セレクション情報センター</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px", lineHeight: 1.7 }}>
          関東・関西のジュニアユース・ジュニアのセレクション開催情報。日程・会場・申込先をまとめています。合否の傾向や合格率は扱いません。
        </p>
        <SelectionClient selections={selections} />
        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 20, lineHeight: 1.7 }}>
          ※掲載情報は変更される場合があります。応募前に必ず各クラブ公式サイトで最新の募集要項をご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
