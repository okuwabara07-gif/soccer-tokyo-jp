import { NextRequest, NextResponse } from "next/server";
import { admin, accountByManageToken, clean, cleanDate, cleanMultiline, cleanUrl, notifyOperator } from "@/lib/partner";

// チームからのセレクション・練習会の登録。承認後に selections へ入る（source_type='submission'）。
export async function POST(req: NextRequest) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const sb = admin();
  const a = await accountByManageToken(sb, clean(b.manage_token, 100));
  if (!a) return NextResponse.json({ error: "管理リンクが無効です。" }, { status: 403 });
  if (!a.club_id || a.status !== "active") return NextResponse.json({ error: "掲載が始まってから登録できます。" }, { status: 409 });

  const type = b.selection_type === "練習会" ? "練習会" : "セレクション";
  const always = b.always === true;
  const eventDate = always ? null : cleanDate(b.event_date);
  const eventEnd = always ? null : cleanDate(b.event_date_end);
  if (!always && !eventDate) return NextResponse.json({ error: "開催日を入れるか、「随時受付」にチェックしてください。" }, { status: 400 });
  if (eventDate && eventEnd && eventEnd < eventDate) return NextResponse.json({ error: "終了日が開始日より前になっています。" }, { status: 400 });
  const applyUrl = cleanUrl(b.apply_url);
  const sourceUrl = cleanUrl(b.source_url) || applyUrl;

  const { data: club } = await sb.from("clubs").select("name,prefecture,city,official_url").eq("id", a.club_id).single();
  const intake = Number(b.intake_year) || new Date().getFullYear() + 1;
  const payload: Record<string, unknown> = {
    intake_year: intake,
    target_grade: clean(b.target_grade, 20) || "新中1",
    selection_type: type,
    title: clean(b.title, 80) || `${intake}年度 ${type}`,
    event_date: eventDate,
    event_date_end: eventEnd,
    event_time: clean(b.event_time, 40),
    venue: clean(b.venue, 100),
    apply_deadline: cleanDate(b.apply_deadline),
    apply_url: applyUrl,
    requirements: cleanMultiline(b.requirements, 200),
    notes: always ? "随時受付" : null,
    source_type: "submission",
    source_url: sourceUrl || club?.official_url || null,
  };
  for (const k of Object.keys(payload)) if (payload[k] === null) delete payload[k];

  const md = (d: string | null) => (d ? `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}` : "");
  const when = always ? "随時" : eventEnd && eventEnd !== eventDate ? `${md(eventDate)}〜${md(eventEnd)}` : md(eventDate);
  const title = `${club?.name}（${[club?.prefecture, club?.city].filter(Boolean).join("・")}） ${when} ${type}`;
  const { data: cand, error } = await sb.rpc("add_partner_candidate", {
    p_kind: "selection_new", p_club_id: a.club_id, p_account_id: a.id, p_title: title, p_payload: payload,
    p_evidence: `チーム管理リンクから登録${sourceUrl ? ` / ${sourceUrl}` : ""}`, p_source: "partner",
  });
  if (error) return NextResponse.json({ error: "登録できませんでした。" }, { status: 500 });
  const c = Array.isArray(cand) ? cand[0] : cand;
  await notifyOperator(`[soccer-selection] 募集の登録 ${title}`, `${title}\n候補: batch=${c?.batch} seq=${c?.seq}\n${JSON.stringify(payload, null, 1)}`).catch(() => null);
  return NextResponse.json({ ok: true });
}
