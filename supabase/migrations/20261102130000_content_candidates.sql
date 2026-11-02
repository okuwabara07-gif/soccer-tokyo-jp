-- コンテンツ自動更新の候補置き場と、承認後に反映する関数
-- 流れ: 定期タスクが調べる → content_candidates に status='new' で入れる → 一覧をユーザーへ送る
--       → 返信で承認された番号だけ apply_content_candidate(id) で反映（反映前の clubs 行は clubs_backup_listing に控える）

create table if not exists public.content_candidates (
  id          uuid primary key default gen_random_uuid(),
  batch       text not null,                 -- 実行ごとのラベル（例: 2026-11-05-am）
  seq         integer not null,              -- 一覧の番号（batch 内で 1..n）
  kind        text not null check (kind in (
                'club_publish',              -- 既存の未公開クラブを公開
                'club_update',               -- 既存クラブの空欄を埋める（空で上書きしない）
                'club_new',                  -- 新しいクラブ（女子チーム含む）を追加
                'selection_new',             -- セレクション・練習会を追加
                'selection_review',          -- status='review' のセレクションを公開
                'article_publish'            -- 下書き記事（articles.status='draft'）を公開
              )),
  club_id     uuid references public.clubs(id) on delete cascade,
  target_id   uuid,                          -- selection_review / article_publish の対象行
  title       text not null,                 -- 一覧に出す1行（クラブ名など）
  payload     jsonb not null default '{}'::jsonb,
  evidence    text,                          -- 確認したURLと根拠1行
  status      text not null default 'new' check (status in ('new','applied','rejected','expired','error')),
  result      text,
  created_at  timestamptz not null default now(),
  decided_at  timestamptz,
  unique (batch, seq)
);
alter table public.content_candidates enable row level security;
create index if not exists content_candidates_status_idx on public.content_candidates (status, batch);

-- 巡回の順番づけ用（最後に公式サイトを確認した日時）
alter table public.clubs add column if not exists last_checked_at timestamptz;

-- 反映前の控え（既にあれば何もしない）
create table if not exists public.clubs_backup_listing as select * from public.clubs where false;
alter table public.clubs_backup_listing enable row level security;

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
begin
  select * into c from public.content_candidates where id = p_id for update;
  if not found then return 'not_found'; end if;
  if c.status <> 'new' then return 'skip:' || c.status; end if;
  p := c.payload;
  v_city := nullif(p->>'city', '');
  v_norm := case when v_city is null then null else regexp_replace(v_city, '(市|区|町|村)$', '') end;

  if c.kind in ('club_publish', 'club_update') then
    if not exists (select 1 from public.clubs where id = c.club_id) then raise exception 'club not found'; end if;
    insert into public.clubs_backup_listing select * from public.clubs where id = c.club_id;
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
  end if;

  update public.content_candidates set status = 'applied', decided_at = now(), result = v_id::text where id = p_id;
  return 'applied:' || coalesce(v_id::text, '');
exception when others then
  update public.content_candidates set status = 'error', decided_at = now(), result = sqlerrm where id = p_id;
  return 'error:' || sqlerrm;
end $$;

revoke all on function public.apply_content_candidate(uuid) from public, anon, authenticated;
