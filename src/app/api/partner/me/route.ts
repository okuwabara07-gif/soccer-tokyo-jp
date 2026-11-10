import { NextRequest, NextResponse } from "next/server";
import { admin, accountByManageToken, effectivePlan, PLAN_LIMITS, SITE } from "@/lib/partner";

// 管理ページ用：アカウントとクラブの情報、送った内容の状況、先月の閲覧数
export async function GET(req: NextRequest) {
  const sb = admin();
  const a = await accountByManageToken(sb, req.nextUrl.searchParams.get("t"));
  if (!a) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const plan = effectivePlan(a);
  let club: Record<string, unknown> | null = null;
  let selections: unknown[] = [];
  let stats = { views30: 0, clicks30: 0 };
  if (a.club_id) {
    const { data } = await sb.from("clubs")
      .select("id,slug,name,prefecture,city,official_url,instagram,line_url,contact_url,practice_days,practice_ground,nearest_station,monthly_fee,intro,logo_url,photos,team_gender")
      .eq("id", a.club_id).maybeSingle();
    club = data;
    const { data: s } = await sb.from("selections")
      .select("id,title,selection_type,event_date,event_date_end,venue,status")
      .eq("club_id", a.club_id).order("event_date", { ascending: false, nullsFirst: true }).limit(10);
    selections = s ?? [];
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const { count: v } = await sb.from("club_events").select("id", { count: "exact", head: true }).eq("club_id", a.club_id).eq("kind", "view").gte("created_at", since);
    const { count: k } = await sb.from("club_events").select("id", { count: "exact", head: true }).eq("club_id", a.club_id).neq("kind", "view").gte("created_at", since);
    stats = { views30: v ?? 0, clicks30: k ?? 0 };
  }
  const { data: pending } = await sb.from("content_candidates")
    .select("kind,title,status,created_at,decided_at")
    .eq("account_id", a.id).order("created_at", { ascending: false }).limit(10);

  return NextResponse.json({
    account: {
      status: a.status, plan: a.plan, effective_plan: plan, plan_status: a.plan_status, trial_until: a.trial_until,
      club_name: a.club_name_raw, line_linked: !!a.line_user_id,
    },
    limits: PLAN_LIMITS[plan],
    club,
    page_url: club ? `${SITE}/clubs/${club.slug}` : null,
    badge_url: club ? `${SITE}/api/og/badge/${club.slug}` : null,
    selections,
    submissions: pending ?? [],
    stats: PLAN_LIMITS[plan].reportDetail ? stats : { views30: stats.views30 },
  });
}
