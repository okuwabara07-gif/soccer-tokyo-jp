-- 掲載チーム（パートナー）向けの仕組み
-- 流れ: インスタのフォローに定型DMで登録リンクを返す → チーム責任者が /partner/register で登録（写真・紹介文など）
--       → content_candidates に kind='club_profile'（source='partner'）で入る → 運営が承認 → apply_content_candidate で反映
--       → 定期処理（/api/cron/partner）が承認通知・告知画像・月1レポート・更新案内・週1まとめ投稿の下書きを担当
-- 既存の列・行は変更しない（追加のみ）。新しい表はすべて RLS 有効・ポリシー無し（サーバーの service_role からのみ読み書き）。

-- 1) チームの管理アカウント（既存 club_accounts を拡張。未登録クラブの申請もあるので club_id を任意にする）
alter table public.club_accounts alter column club_id drop not null;
alter table public.club_accounts
  add column if not exists club_name_raw          text,
  add column if not exists prefecture             text,
  add column if not exists instagram              text,
  add column if not exists line_user_id           text,
  add column if not exists status                 text not null default 'pending',
  add column if not exists manage_token           text,
  add column if not exists plan_status            text not null default 'none',
  add column if not exists trial_until            date,
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id text,
  add column if not exists current_period_end     timestamptz,
  add column if not exists consent_at             timestamptz,
  add column if not exists last_reminded_at       timestamptz,
  add column if not exists last_report_month      text,
  add column if not exists updated_at             timestamptz not null default now();
do $$ begin
  alter table public.club_accounts add constraint club_accounts_status_chk check (status in ('pending','active','suspended'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.club_accounts add constraint club_accounts_plan_chk check (plan in ('free','standard','premium'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.club_accounts add constraint club_accounts_plan_status_chk check (plan_status in ('none','active','trialing','past_due','canceled'));
exception when duplicate_object then null; end $$;
create unique index if not exists club_accounts_manage_token_key on public.club_accounts (manage_token);
create index if not exists club_accounts_line_user_idx on public.club_accounts (line_user_id);
create index if not exists club_accounts_sub_idx on public.club_accounts (stripe_subscription_id);
alter table public.club_accounts enable row level security;

-- 2) クラブページに出すチーム提供の情報（承認後に反映される）
alter table public.clubs
  add column if not exists intro        text,                          -- チームの紹介文
  add column if not exists line_url     text,                          -- チームの公式LINE（友だち追加URL）
  add column if not exists contact_url  text,                          -- 問い合わせフォームURL
  add column if not exists logo_url     text,
  add column if not exists photos       jsonb not null default '[]'::jsonb,  -- [{url, caption}]
  add column if not exists partner_plan text not null default 'none'; -- none / free / standard / premium（表示の出し分け用。club_accounts から同期）
do $$ begin
  alter table public.clubs add constraint clubs_partner_plan_chk check (partner_plan in ('none','free','standard','premium'));
exception when duplicate_object then null; end $$;

-- 2b) 反映前の控え表を clubs と同じ列にそろえる（team_gender / last_checked_at が欠けていて club_update の控えが失敗していたため）
--     控えへの書き込みは列名で対応づける（jsonb_populate_record）ので、今後 clubs に列を足しても失敗しない。
alter table public.clubs_backup_listing
  add column if not exists team_gender     text,
  add column if not exists last_checked_at timestamptz,
  add column if not exists intro           text,
  add column if not exists line_url        text,
  add column if not exists contact_url     text,
  add column if not exists logo_url        text,
  add column if not exists photos          jsonb,
  add column if not exists partner_plan    text;

-- 3) クラブページの閲覧・クリック（月1レポート用。個人を特定する情報は持たない）
create table if not exists public.club_events (
  id         bigint generated always as identity primary key,
  club_id    uuid not null references public.clubs(id) on delete cascade,
  kind       text not null check (kind in ('view','official_click','instagram_click','line_click','contact_click','apply_click')),
  created_at timestamptz not null default now()
);
create index if not exists club_events_club_time_idx on public.club_events (club_id, created_at);
alter table public.club_events enable row level security;

-- 4) チームへの通知の送信記録（二重送信を防ぐ）
create table if not exists public.partner_notify_log (
  id          bigint generated always as identity primary key,
  account_id  uuid references public.club_accounts(id) on delete cascade,
  kind        text not null,               -- approved / report / reminder / selection_approved
  dedupe_key  text not null unique,
  channel     text,                        -- line / email / none
  detail      text,
  sent_at     timestamptz not null default now()
);
alter table public.partner_notify_log enable row level security;

-- 5) 候補表の拡張：チームからの登録（club_profile）と、運営インスタの投稿下書き（sns_post）
alter table public.content_candidates drop constraint if exists content_candidates_kind_check;
alter table public.content_candidates add constraint content_candidates_kind_check check (kind in (
  'club_publish','club_update','club_new','selection_new','selection_review','article_publish',
  'club_profile',   -- チーム責任者が登録・更新した情報（入力された項目で上書き。写真・紹介文・LINEなど）
  'sns_post'        -- 運営インスタへの投稿下書き（承認後に定期処理が投稿する）
));
alter table public.content_candidates
  add column if not exists source         text not null default 'crawler',  -- crawler / partner / system
  add column if not exists account_id     uuid references public.club_accounts(id) on delete set null,
  add column if not exists followup_at    timestamptz,                      -- 承認後の通知・投稿を済ませた日時
  add column if not exists followup_result text;
create index if not exists content_candidates_followup_idx on public.content_candidates (status, followup_at) where source <> 'crawler';

-- 6) 候補を1件追加（バッチ名は partner-YYYY-MM-DD、番号は自動採番）
create or replace function public.add_partner_candidate(
  p_kind text, p_club_id uuid, p_account_id uuid, p_title text, p_payload jsonb, p_evidence text, p_source text default 'partner'
) returns table (id uuid, batch text, seq int)
language plpgsql
as $$
declare
  v_batch text := (case when p_source = 'system' then 'system-' else 'partner-' end) || to_char(now() at time zone 'Asia/Tokyo', 'YYYY-MM-DD');
  v_seq int;
  v_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(v_batch));
  select coalesce(max(c.seq), 0) + 1 into v_seq from public.content_candidates c where c.batch = v_batch;
  insert into public.content_candidates (batch, seq, kind, club_id, account_id, title, payload, evidence, source)
  values (v_batch, v_seq, p_kind, p_club_id, p_account_id, left(p_title, 200), coalesce(p_payload, '{}'::jsonb), p_evidence, p_source)
  returning content_candidates.id into v_id;
  return query select v_id, v_batch, v_seq;
end $$;
revoke all on function public.add_partner_candidate(text, uuid, uuid, text, jsonb, text, text) from public, anon, authenticated;

-- 7) 反映関数に club_profile / sns_post を追加（既存の分岐は 20261102130000 と同じ）
create or replace function public.apply_content_candidate(p_id uuid)
returns text
language plpgsql
as $$
declare
  c   public.content_candidates%rowtype;
  p   jsonb;
  v_id uuid;
  v_city text;
  v_norm text;
  v_plan text;
begin
  select * into c from public.content_candidates where id = p_id for update;
  if not found then return 'not_found'; end if;
  if c.status <> 'new' then return 'skip:' || c.status; end if;
  p := c.payload;
  v_city := nullif(p->>'city', '');
  v_norm := case when v_city is null then null else regexp_replace(v_city, '(市|区|町|村)$', '') end;

  if c.kind in ('club_publish', 'club_update') then
    if not exists (select 1 from public.clubs where id = c.club_id) then raise exception 'club not found'; end if;
    insert into public.clubs_backup_listing select (jsonb_populate_record(null::public.clubs_backup_listing, to_jsonb(cl))).* from public.clubs cl where cl.id = c.club_id;
    update public.clubs set
      is_published    = case when c.kind = 'club_publish' then true else is_published end,
      official_url    = coalesce(official_url, nullif(p->>'official_url', '')),
      instagram       = coalesce(instagram, nullif(p->>'instagram', '')),
      city            = case when city is null or c.kind = 'club_publish' then coalesce(v_city, city) else city end,
      city_source     = case when v_city is not null and (city is null or c.kind = 'club_publish') then 'official' else city_source end,
      city_norm       = case when v_city is not null and (city is null or c.kind = 'club_publish') then v_norm else city_norm end,
      city_norm_source= case when v_city is not null and (city is null or c.kind = 'club_publish') then 'city' else city_norm_source end,
      practice_days   = coalesce(practice_days, nullif(p->>'practice_days', '')),
      practice_ground = coalesce(practice_ground, nullif(p->>'practice_ground', '')),
      monthly_fee     = coalesce(monthly_fee, nullif(p->>'monthly_fee', '')::int),
      nearest_station = coalesce(nearest_station, nullif(p->>'nearest_station', '')),
      notes           = coalesce(notes, nullif(p->>'notes', '')),
      url_status      = 'confirmed',
      last_checked_at = now(),
      updated_at      = now()
    where id = c.club_id;
    v_id := c.club_id;

  elsif c.kind = 'club_new' then
    if exists (select 1 from public.clubs where slug = p->>'slug') then raise exception 'slug exists'; end if;
    insert into public.clubs (slug, name, prefecture, club_type, team_gender, official_url, instagram,
                              city, city_source, city_norm, city_norm_source, practice_days, practice_ground,
                              monthly_fee, nearest_station, notes, is_published, url_status, last_checked_at)
    values (p->>'slug', p->>'name', p->>'prefecture', coalesce(p->>'club_type', 'club'), coalesce(p->>'team_gender', 'boys'),
            nullif(p->>'official_url', ''), nullif(p->>'instagram', ''),
            v_city, case when v_city is not null then 'official' end, v_norm, case when v_city is not null then 'city' end,
            nullif(p->>'practice_days', ''), nullif(p->>'practice_ground', ''), nullif(p->>'monthly_fee', '')::int,
            nullif(p->>'nearest_station', ''), nullif(p->>'notes', ''), true, 'confirmed', now())
    returning id into v_id;

  elsif c.kind = 'club_profile' then
    -- チーム責任者からの登録。club_id があれば上書き、無ければ新規クラブとして作る。
    if c.club_id is null then
      if coalesce(p->>'slug', '') = '' then raise exception 'slug required'; end if;
      if exists (select 1 from public.clubs where slug = p->>'slug') then raise exception 'slug exists'; end if;
      insert into public.clubs (slug, name, prefecture, club_type, team_gender, is_published, url_status, last_checked_at)
      values (p->>'slug', p->>'name', p->>'prefecture', 'club', coalesce(nullif(p->>'team_gender', ''), 'boys'), true, 'confirmed', now())
      returning id into v_id;
    else
      if not exists (select 1 from public.clubs where id = c.club_id) then raise exception 'club not found'; end if;
      insert into public.clubs_backup_listing select (jsonb_populate_record(null::public.clubs_backup_listing, to_jsonb(cl))).* from public.clubs cl where cl.id = c.club_id;
      v_id := c.club_id;
    end if;
    select case when a.trial_until >= current_date and a.plan = 'free' then 'standard' else a.plan end
      into v_plan from public.club_accounts a where a.id = c.account_id;
    update public.clubs set
      is_published    = true,
      official_url    = coalesce(nullif(p->>'official_url', ''), official_url),
      instagram       = coalesce(nullif(p->>'instagram', ''), instagram),
      city            = coalesce(v_city, city),
      city_source     = case when v_city is not null then 'official' else city_source end,
      city_norm       = case when v_city is not null then v_norm else city_norm end,
      city_norm_source= case when v_city is not null then 'city' else city_norm_source end,
      practice_days   = coalesce(nullif(p->>'practice_days', ''), practice_days),
      practice_ground = coalesce(nullif(p->>'practice_ground', ''), practice_ground),
      monthly_fee     = coalesce(nullif(p->>'monthly_fee', '')::int, monthly_fee),
      nearest_station = coalesce(nullif(p->>'nearest_station', ''), nearest_station),
      intro           = coalesce(nullif(p->>'intro', ''), intro),
      line_url        = coalesce(nullif(p->>'line_url', ''), line_url),
      contact_url     = coalesce(nullif(p->>'contact_url', ''), contact_url),
      logo_url        = coalesce(nullif(p->>'logo_url', ''), logo_url),
      photos          = case when jsonb_typeof(p->'photos') = 'array' and jsonb_array_length(p->'photos') > 0 then p->'photos' else photos end,
      partner_plan    = coalesce(v_plan, partner_plan, 'free'),
      url_status      = 'confirmed',
      last_checked_at = now(),
      updated_at      = now()
    where id = v_id;
    update public.club_accounts set club_id = v_id, status = 'active', claimed_at = coalesce(claimed_at, now()), updated_at = now()
    where id = c.account_id;

  elsif c.kind = 'selection_new' then
    insert into public.selections (club_id, intake_year, target_grade, selection_type, title, event_date, event_date_end,
                                   event_time, venue, apply_deadline, apply_url, requirements, notes,
                                   source_type, source_url, source_captured_at, status, reviewed_at)
    values (c.club_id, nullif(p->>'intake_year', '')::int, nullif(p->>'target_grade', ''), coalesce(p->>'selection_type', 'セレクション'),
            nullif(p->>'title', ''), nullif(p->>'event_date', '')::date, nullif(p->>'event_date_end', '')::date,
            nullif(p->>'event_time', ''), nullif(p->>'venue', ''), nullif(p->>'apply_deadline', '')::date,
            nullif(p->>'apply_url', ''), nullif(p->>'requirements', ''), nullif(p->>'notes', ''),
            coalesce(p->>'source_type', 'official_site'), p->>'source_url', now(), 'published', now())
    returning id into v_id;
    update public.clubs set last_checked_at = now() where id = c.club_id;

  elsif c.kind = 'selection_review' then
    update public.selections set status = 'published', reviewed_at = now(), updated_at = now()
    where id = c.target_id and status = 'review';
    if not found then raise exception 'selection not in review'; end if;
    v_id := c.target_id;

  elsif c.kind = 'article_publish' then
    update public.articles set status = 'published', published_at = coalesce(published_at, now()), updated_at = now()
    where id = c.target_id and status = 'draft';
    if not found then raise exception 'article not draft'; end if;
    v_id := c.target_id;

  elsif c.kind = 'sns_post' then
    -- DBは変えない。承認の印だけ付け、投稿は定期処理（/api/cron/partner）が行う。
    v_id := null;
  end if;

  update public.content_candidates set status = 'applied', decided_at = now(), result = v_id::text where id = p_id;
  return 'applied:' || coalesce(v_id::text, '');
exception when others then
  update public.content_candidates set status = 'error', decided_at = now(), result = sqlerrm where id = p_id;
  return 'error:' || sqlerrm;
end $$;
revoke all on function public.apply_content_candidate(uuid) from public, anon, authenticated;

-- 8) 写真の置き場（公開バケット。承認前の写真はどこにも一覧されず、承認後に clubs.photos から参照される）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('club-media', 'club-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
