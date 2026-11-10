import { NextRequest, NextResponse } from "next/server";
import {
  admin, accountByManageToken, clean, cleanMultiline, cleanUrl, instagramUrl, newToken, notifyOperator,
  PLAN_LIMITS, PREFS, slugify, verifyLineUser, effectivePlan, todayJst, SITE,
} from "@/lib/partner";

// チーム責任者の登録・更新。内容は content_candidates（kind='club_profile'）に入り、運営が承認すると掲載される。
// 新規: 招待リンク（t=invite_token）か、運営LINEからのリンク（lu=署名付き）、どちらも無ければ通常の申請として受け付ける。
// 更新: manage_token（管理リンク）を付けて送る。
const TRIAL_DAYS = Number(process.env.PARTNER_TRIAL_DAYS ?? 90);

type Photo = { path: string; caption?: string };

export async function POST(req: NextRequest) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (clean(b.website_hp)) return NextResponse.json({ ok: true }); // 迷惑投稿よけ（人には見えない欄）

  const sb = admin();
  const manage = await accountByManageToken(sb, clean(b.manage_token, 100));
  if (b.manage_token && !manage) return NextResponse.json({ error: "管理リンクが無効です。運営に連絡してください。" }, { status: 403 });
  if (manage && !manage.club_id) return NextResponse.json({ error: "登録内容を確認中です。掲載が始まってから更新できます。" }, { status: 409 });
  if (manage?.status === "suspended") return NextResponse.json({ error: "このアカウントは停止中です。運営に連絡してください。" }, { status: 403 });

  const clubName = clean(b.club_name, 80);
  const pref = clean(b.prefecture, 10);
  const contactName = clean(b.contact_name, 60);
  const email = clean(b.contact_email, 200);
  const lineUser = await verifyLineUser(clean(b.lu, 600));
  if (!manage) {
    if (!clubName || !pref || !PREFS.includes(pref)) return NextResponse.json({ error: "クラブ名と都道府県を入力してください。" }, { status: 400 });
    if (!contactName) return NextResponse.json({ error: "責任者の役職・お名前を入力してください。" }, { status: 400 });
    if (!email && !lineUser) return NextResponse.json({ error: "連絡先のメールアドレスを入力してください。" }, { status: 400 });
    if (b.agree !== true) return NextResponse.json({ error: "掲載規約への同意が必要です。" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "メールアドレスの形式を確認してください。" }, { status: 400 });

  // 写真（アップロード済みのパスだけ受け付ける）
  const rawPhotos: Photo[] = Array.isArray(b.photos) ? (b.photos as Photo[]) : [];
  const okPath = (p: unknown) => typeof p === "string" && /^pending\/[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+$/.test(p);
  const planForLimit = manage ? effectivePlan(manage) : TRIAL_DAYS > 0 ? "standard" : "free";
  const photos = rawPhotos.filter((p) => okPath(p?.path)).slice(0, PLAN_LIMITS[planForLimit].photos);
  if (photos.length > 0 && b.photo_consent !== true) {
    return NextResponse.json({ error: "写真を載せる場合は、写っている選手・保護者の同意の確認にチェックしてください。" }, { status: 400 });
  }
  const pub = (path: string) => sb.storage.from("club-media").getPublicUrl(path).data.publicUrl;
  const logo = okPath(b.logo_path) ? pub(String(b.logo_path)) : null;

  const fee = Number(String(b.monthly_fee ?? "").replace(/[^\d]/g, ""));
  const gender = ["boys", "girls", "mixed"].includes(String(b.team_gender)) ? String(b.team_gender) : null;
  const payload: Record<string, unknown> = {
    name: clubName,
    prefecture: pref,
    city: clean(b.city, 30),
    team_gender: gender,
    official_url: cleanUrl(b.official_url),
    instagram: instagramUrl(b.instagram),
    line_url: cleanUrl(b.line_url),
    contact_url: cleanUrl(b.contact_url),
    practice_days: clean(b.practice_days, 100),
    practice_ground: clean(b.practice_ground, 150),
    nearest_station: clean(b.nearest_station, 60),
    monthly_fee: fee > 0 && fee < 200000 ? fee : null,
    intro: cleanMultiline(b.intro, 600),
    logo_url: logo,
    photos: photos.map((p) => ({ url: pub(p.path), caption: clean(p.caption, 60) })),
  };
  for (const k of Object.keys(payload)) if (payload[k] === null || payload[k] === undefined) delete payload[k];

  // 既存クラブとのひも付け
  let clubId: string | null = manage?.club_id ?? null;
  let clubLabel = "";
  if (!clubId && clean(b.club_id, 40)) {
    const { data: c } = await sb.from("clubs").select("id,name,prefecture,city").eq("id", clean(b.club_id, 40)!).maybeSingle();
    if (c) { clubId = c.id; clubLabel = `${c.name}（${[c.prefecture, c.city].filter(Boolean).join("・")}）`; }
  }
  if (clubId && !clubLabel) {
    const { data: c } = await sb.from("clubs").select("name,prefecture,city").eq("id", clubId).maybeSingle();
    if (c) clubLabel = `${c.name}（${[c.prefecture, c.city].filter(Boolean).join("・")}）`;
  }
  if (!clubId) payload.slug = slugify(clubName || "club");

  // 招待リンク（運営がDMで送ったもの）
  const invite = clean(b.t, 100);
  let invited: { id: string } | null = null;
  if (invite && !manage) {
    const { data } = await sb.from("club_accounts").select("id").eq("invite_token", invite).is("claimed_at", null).maybeSingle();
    invited = data;
  }

  let accountId = manage?.id ?? invited?.id ?? null;
  let manageToken = manage?.manage_token ?? null;
  const warn: string[] = [];
  if (!manage) {
    if (clubId) {
      const { data: other } = await sb.from("club_accounts").select("id,status").eq("club_id", clubId).maybeSingle();
      if (other && other.id !== accountId) warn.push(`このクラブには既に管理アカウントあり（${other.status}）`);
    }
    manageToken = newToken(24);
    const row = {
      club_name_raw: clubName, prefecture: pref, contact_name: contactName, contact_email: email,
      instagram: payload.instagram ?? null, line_user_id: lineUser, manage_token: manageToken,
      consent_at: new Date().toISOString(), status: "pending", plan: "free",
      trial_until: TRIAL_DAYS > 0 ? new Date(Date.parse(todayJst()) + TRIAL_DAYS * 86400000).toISOString().slice(0, 10) : null,
      updated_at: new Date().toISOString(),
    };
    if (accountId) {
      const { error } = await sb.from("club_accounts").update(row).eq("id", accountId);
      if (error) return NextResponse.json({ error: "登録できませんでした。時間をおいてお試しください。" }, { status: 500 });
    } else {
      const { data, error } = await sb.from("club_accounts").insert(row).select("id").single();
      if (error || !data) return NextResponse.json({ error: "登録できませんでした。時間をおいてお試しください。" }, { status: 500 });
      accountId = data.id;
    }
  }

  const loc = [pref ?? "", (payload.city as string) ?? ""].filter(Boolean).join("・");
  const title = manage
    ? `【チーム更新】${clubLabel || manage.club_name_raw}`
    : `【チーム登録】${clubLabel || `${clubName}（${loc}）`}${clubId ? "" : "＊新規クラブ"}`;
  const evidence = [
    manage ? "管理リンクからの更新" : invited ? "招待リンクから登録（DM送付先のアカウント）" : lineUser ? "運営LINEから登録" : "招待なしの申請（公式インスタ等で本人確認が必要）",
    `責任者: ${contactName ?? manage?.contact_name ?? "-"}`,
    photos.length ? `写真${photos.length}枚（同意チェック済み）` : "",
    ...warn,
  ].filter(Boolean).join(" / ");

  const { data: cand, error: cerr } = await sb.rpc("add_partner_candidate", {
    p_kind: "club_profile", p_club_id: clubId, p_account_id: accountId, p_title: title, p_payload: payload, p_evidence: evidence, p_source: "partner",
  });
  if (cerr) return NextResponse.json({ error: "登録できませんでした。時間をおいてお試しください。" }, { status: 500 });
  const c = Array.isArray(cand) ? cand[0] : cand;

  await notifyOperator(
    `[soccer-selection] ${title}`,
    [
      title, evidence, "",
      `候補: batch=${c?.batch} seq=${c?.seq}`,
      `承認: select apply_content_candidate(id) from content_candidates where batch='${c?.batch}' and seq=${c?.seq};`,
      `却下: update content_candidates set status='rejected', decided_at=now() where batch='${c?.batch}' and seq=${c?.seq};`,
      "", `写真: ${(payload.photos as { url: string }[]).map((p) => p.url).join(" ") || "なし"}`,
    ].join("\n")
  ).catch(() => null);

  return NextResponse.json({ ok: true, manage_url: `${SITE}/partner/manage?t=${manageToken}` });
}
