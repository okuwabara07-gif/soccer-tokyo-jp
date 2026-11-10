import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  admin, effectivePlan, instagramHandle, manageUrl, notifyOnce, notifyOperator, PLAN_LIMITS, SITE, todayJst, type Account,
} from "@/lib/partner";
import { addDays, PER_SLIDE, weeklyItems } from "@/lib/weekly";

// 掲載チーム向けの定期処理（Vercel Cron から1日1回。Authorization: Bearer CRON_SECRET）
// 1) 承認済みの登録・募集をチームへ知らせる（告知画像つき）
// 2) 承認済みの運営インスタ投稿を投稿する（IG_* が設定されている場合のみ）
// 3) 月初に先月の閲覧レポート
// 4) 募集が無いチームに更新の案内（45日おき）
// 5) お試し期間の終了案内と、終了後の表示プラン戻し
// 6) 月曜に週1まとめ投稿の下書きを作る（承認待ちに入るだけ。投稿は承認後）
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const log: string[] = [];

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  log.length = 0;
  const sb = admin();
  const only = req.nextUrl.searchParams.get("only");
  const run = async (name: string, fn: () => Promise<void>) => {
    if (only && only !== name) return;
    try { await fn(); } catch (e) { log.push(`${name}: error ${(e as Error).message}`); }
  };
  await run("followups", () => followups(sb));
  await run("reports", () => monthlyReports(sb));
  await run("reminders", () => reminders(sb));
  await run("trials", () => trials(sb));
  await run("weekly", () => weeklyDraft(sb, req.nextUrl.searchParams.get("force") === "1"));
  return NextResponse.json({ ok: true, log });
}

async function accountsByIds(sb: SupabaseClient, ids: string[]) {
  if (ids.length === 0) return new Map<string, Account>();
  const { data } = await sb.from("club_accounts").select("*").in("id", ids);
  return new Map(((data ?? []) as Account[]).map((a) => [a.id, a]));
}

// ---- 1) 承認後のお知らせ ----
async function followups(sb: SupabaseClient) {
  const since = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: cands } = await sb
    .from("content_candidates")
    .select("id,kind,source,club_id,account_id,title,payload,result,decided_at")
    .eq("status", "applied").is("followup_at", null).gte("decided_at", since)
    .in("kind", ["club_profile", "selection_new", "sns_post"])
    .limit(50);
  const list = cands ?? [];
  // 運営が巡回で見つけた募集も、管理アカウントのあるクラブなら知らせる
  const clubIds = [...new Set(list.filter((c) => c.kind === "selection_new" && !c.account_id && c.club_id).map((c) => c.club_id as string))];
  const byClub = new Map<string, Account>();
  if (clubIds.length) {
    const { data } = await sb.from("club_accounts").select("*").in("club_id", clubIds).eq("status", "active");
    for (const a of (data ?? []) as Account[]) if (a.club_id) byClub.set(a.club_id, a);
  }
  const accs = await accountsByIds(sb, list.map((c) => c.account_id).filter(Boolean) as string[]);

  for (const c of list) {
    let result = "skip";
    if (c.kind === "sns_post") {
      result = await publishInstagram(c.payload as { images?: string[]; caption?: string });
    } else {
      const a = (c.account_id && accs.get(c.account_id)) || (c.club_id && byClub.get(c.club_id)) || null;
      if (!a) {
        result = "no_account";
      } else if (c.kind === "club_profile") {
        const { data: club } = await sb.from("clubs").select("slug,name").eq("id", a.club_id ?? c.result).maybeSingle();
        const page = club ? `${SITE}/clubs/${club.slug}` : SITE;
        const plan = effectivePlan(a);
        const trial = a.plan === "free" && plan === "standard" && a.trial_until ? `\n\n${a.trial_until.replaceAll("-", "/")}まではスタンダードプランを無料でお使いいただけます。` : "";
        result = await notifyOnce(sb, a, "approved", `approved:${c.id}`, `${club?.name ?? "チーム"}の掲載を開始しました`,
          [
            `${club?.name ?? "チーム"}の情報を soccer-selection.jp に掲載しました。`,
            `掲載ページ：${page}`,
            "", "セレクション・練習会の登録や、写真・紹介文の更新は管理ページからできます。",
            `管理ページ：${a.manage_token ? manageUrl(a.manage_token) : ""}`,
            "", `掲載バッジ（プロフィールや投稿にお使いください）：${club ? `${SITE}/api/og/badge/${club.slug}` : ""}`,
            trial,
          ].join("\n"));
      } else if (c.kind === "selection_new" && c.result) {
        const plan = effectivePlan(a);
        const month = todayJst().slice(0, 7);
        const { count } = await sb.from("partner_notify_log").select("id", { count: "exact", head: true })
          .eq("account_id", a.id).eq("kind", "selection_image").gte("sent_at", `${month}-01T00:00:00+09:00`);
        const limit = PLAN_LIMITS[plan].imagesPerMonth;
        const withImage = limit === null || (count ?? 0) < limit;
        const feed = `${SITE}/api/og/selection/${c.result}?size=feed`;
        const story = `${SITE}/api/og/selection/${c.result}?size=story`;
        const lines = [
          `募集情報を掲載しました：${c.title}`,
          "",
          withImage ? `告知画像（そのまま投稿できます）\nフィード用：${feed}\nストーリーズ用：${story}` : "今月の告知画像は作成済みです。スタンダードプランなら毎回お作りします。",
          withImage && process.env.NEXT_PUBLIC_IG_HANDLE ? `\n投稿するときに @${process.env.NEXT_PUBLIC_IG_HANDLE} をタグ付けいただくと、運営アカウントでも紹介します。` : "",
          a.manage_token ? `\n管理ページ：${manageUrl(a.manage_token)}` : "",
        ];
        const extra = withImage ? [{ type: "image", originalContentUrl: feed, previewImageUrl: feed }] : [];
        result = await notifyOnce(sb, a, withImage ? "selection_image" : "selection_approved", `selection:${c.id}`, "募集情報を掲載しました", lines.join("\n"), extra);
      }
    }
    await sb.from("content_candidates").update({ followup_at: new Date().toISOString(), followup_result: result }).eq("id", c.id);
    log.push(`followup ${c.kind} ${c.id}: ${result}`);
  }
}

// ---- 2) 運営インスタへの投稿（カルーセル） ----
async function publishInstagram(p: { images?: string[]; caption?: string }): Promise<string> {
  const user = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!user || !token) return "ig_not_configured";
  const images = (p.images ?? []).slice(0, 10);
  if (images.length < 2) return "ig_too_few_images";
  const base = `https://graph.facebook.com/${process.env.IG_GRAPH_VERSION || "v21.0"}`;
  const post = async (path: string, params: Record<string, string>) => {
    const r = await fetch(`${base}/${path}`, { method: "POST", body: new URLSearchParams({ ...params, access_token: token }) });
    const j = await r.json();
    if (!r.ok || !j.id) throw new Error(`ig ${path}: ${j?.error?.message ?? r.status}`);
    return j.id as string;
  };
  const children: string[] = [];
  for (const url of images) children.push(await post(`${user}/media`, { image_url: url, is_carousel_item: "true" }));
  const container = await post(`${user}/media`, { media_type: "CAROUSEL", children: children.join(","), caption: (p.caption ?? "").slice(0, 2200) });
  // コンテナの準備を少し待つ
  for (let i = 0; i < 10; i++) {
    const s = await (await fetch(`${base}/${container}?fields=status_code&access_token=${encodeURIComponent(token)}`)).json();
    if (s.status_code === "FINISHED") break;
    if (s.status_code === "ERROR") throw new Error("ig container error");
    await new Promise((r) => setTimeout(r, 3000));
  }
  const id = await post(`${user}/media_publish`, { creation_id: container });
  return `ig_published:${id}`;
}

// ---- 3) 月初レポート ----
async function monthlyReports(sb: SupabaseClient) {
  const today = todayJst();
  if (Number(today.slice(8, 10)) > 3) return;
  const thisMonth = today.slice(0, 7);
  const prev = new Date(Date.parse(`${thisMonth}-01T00:00:00Z`) - 86400000).toISOString().slice(0, 7);
  const { data } = await sb.from("club_accounts").select("*").eq("status", "active").not("club_id", "is", null)
    .or(`last_report_month.is.null,last_report_month.neq.${prev}`).limit(100);
  for (const a of (data ?? []) as Account[]) {
    const { data: ev } = await sb.from("club_events").select("kind")
      .eq("club_id", a.club_id!).gte("created_at", `${prev}-01T00:00:00+09:00`).lt("created_at", `${thisMonth}-01T00:00:00+09:00`).limit(50000);
    const n = (k: string) => (ev ?? []).filter((e) => e.kind === k).length;
    const views = n("view");
    const detail = PLAN_LIMITS[effectivePlan(a)].reportDetail;
    const [y, m] = prev.split("-");
    const text = [
      `${Number(y)}年${Number(m)}月の掲載レポート`,
      `ページの閲覧：${views}回`,
      ...(detail ? [
        `公式サイトへ：${n("official_click")}回`,
        `Instagramへ：${n("instagram_click")}回`,
        `LINE・問い合わせへ：${n("line_click") + n("contact_click")}回`,
        `申込ページへ：${n("apply_click")}回`,
      ] : ["", "スタンダードプランでは、公式サイト・LINE・申込ページへのクリック数もお届けします。"]),
      "", a.manage_token ? `管理ページ：${manageUrl(a.manage_token)}` : "",
    ].join("\n");
    const r = await notifyOnce(sb, a, "report", `report:${a.id}:${prev}`, `${Number(m)}月の掲載レポート`, text);
    await sb.from("club_accounts").update({ last_report_month: prev }).eq("id", a.id);
    log.push(`report ${a.id}: ${r}`);
  }
}

// ---- 4) 更新の案内 ----
async function reminders(sb: SupabaseClient) {
  const today = todayJst();
  const cutoff = new Date(Date.now() - 45 * 86400000).toISOString();
  const { data } = await sb.from("club_accounts").select("*").eq("status", "active").not("club_id", "is", null)
    .lt("claimed_at", new Date(Date.now() - 14 * 86400000).toISOString())
    .or(`last_reminded_at.is.null,last_reminded_at.lt.${cutoff}`).limit(100);
  for (const a of (data ?? []) as Account[]) {
    const { data: up } = await sb.from("selections").select("id,event_date,event_date_end").eq("club_id", a.club_id!).eq("status", "published")
      .or(`event_date.is.null,event_date.gte.${today},event_date_end.gte.${today}`).limit(1);
    if (up && up.length) continue;
    const { data: club } = await sb.from("clubs").select("name").eq("id", a.club_id!).maybeSingle();
    const text = [
      `${club?.name ?? "チーム"}のご担当者さま`,
      "来年度のセレクション・練習会の予定は決まりましたか？",
      "管理ページから登録いただくと、確認のうえ掲載し、告知画像もお届けします。",
      "", a.manage_token ? manageUrl(a.manage_token) : "",
    ].join("\n");
    const r = await notifyOnce(sb, a, "reminder", `reminder:${a.id}:${today}`, "セレクション・練習会の予定はお決まりですか", text);
    await sb.from("club_accounts").update({ last_reminded_at: new Date().toISOString() }).eq("id", a.id);
    log.push(`reminder ${a.id}: ${r}`);
  }
}

// ---- 5) お試し期間 ----
async function trials(sb: SupabaseClient) {
  const today = todayJst();
  const soon = addDays(today, 7);
  const { data: ending } = await sb.from("club_accounts").select("*").eq("status", "active").eq("plan", "free").eq("trial_until", soon);
  for (const a of (ending ?? []) as Account[]) {
    const r = await notifyOnce(sb, a, "trial_end", `trial_end:${a.id}:${a.trial_until}`, "スタンダードプランのお試し期間が終わります",
      [`スタンダードプランのお試し期間は${soon.replaceAll("-", "/")}までです。`, "そのあとも掲載は無料で続きます。告知画像の作成やクリック数のレポートを続ける場合は、管理ページからお申し込みください。", "", a.manage_token ? manageUrl(a.manage_token) : ""].join("\n"));
    log.push(`trial_end ${a.id}: ${r}`);
  }
  const { data: over } = await sb.from("club_accounts").select("club_id").eq("plan", "free").lt("trial_until", today).not("club_id", "is", null);
  const ids = (over ?? []).map((o) => o.club_id as string);
  if (ids.length) await sb.from("clubs").update({ partner_plan: "free" }).in("id", ids).eq("partner_plan", "standard");
}

// ---- 6) 週1まとめ投稿の下書き ----
async function weeklyDraft(sb: SupabaseClient, force: boolean) {
  const today = todayJst();
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay();
  if (dow !== 1 && !force) return;
  const { data: recent } = await sb.from("content_candidates").select("id").eq("kind", "sns_post")
    .gte("created_at", new Date(Date.now() - 6 * 86400000).toISOString()).limit(1);
  if (recent && recent.length && !force) return;
  const items = await weeklyItems(today);
  if (items.length < 3) { log.push(`weekly: only ${items.length} items`); return; }
  const slides = Math.min(9, Math.ceil(items.length / PER_SLIDE));
  const images = Array.from({ length: slides + 1 }, (_, i) => `${SITE}/api/og/weekly?from=${today}&page=${i}`);
  const tags = [...new Set(items.slice(0, slides * PER_SLIDE).map((i) => instagramHandle(i.club.instagram)).filter(Boolean))].map((h) => `@${h}`);
  const hasPaid = items.some((i) => i.club.partner_plan === "standard" || i.club.partner_plan === "premium");
  const caption = [
    `【関東・関西】これからのセレクション・練習会（${today.slice(5).replace("-", "/")}〜${addDays(today, 13).slice(5).replace("-", "/")}）`,
    "",
    ...items.slice(0, slides * PER_SLIDE).map((i) => `・${Number(String(i.event_date).slice(5, 7))}/${Number(String(i.event_date).slice(8, 10))} ${i.club.name}（${i.club.prefecture.replace(/[都府県]$/, "")}${i.club.city ? `・${i.club.city}` : ""}）${i.selection_type ?? ""}`),
    "",
    "日程・会場・申込先はプロフィールのリンク（soccer-selection.jp）から。参加前に必ずクラブの公式情報をご確認ください。",
    hasPaid ? "※掲載チームの情報を含みます" : "",
    "",
    tags.join(" "),
    "#ジュニアユース #セレクション #練習会 #少年サッカー #新中1",
  ].filter((l, idx, arr) => !(l === "" && arr[idx - 1] === "")).join("\n");
  const { data: cand, error } = await sb.rpc("add_partner_candidate", {
    p_kind: "sns_post", p_club_id: null, p_account_id: null, p_title: `インスタ投稿：これからのセレクション・練習会（${items.length}件・${images.length}枚）`,
    p_payload: { images, caption, from: today }, p_evidence: images[0], p_source: "system",
  });
  if (error) throw new Error(error.message);
  const c = Array.isArray(cand) ? cand[0] : cand;
  await notifyOperator(`[soccer-selection] 週1投稿の下書き（${items.length}件）`,
    [`画像：\n${images.join("\n")}`, "", `キャプション：\n${caption}`, "", `承認: select apply_content_candidate(id) from content_candidates where batch='${c?.batch}' and seq=${c?.seq};`, "承認後、翌日の定期処理で投稿されます（IG_USER_ID / IG_ACCESS_TOKEN が必要）。"].join("\n")).catch(() => null);
  log.push(`weekly draft ${c?.batch}/${c?.seq}`);
}
