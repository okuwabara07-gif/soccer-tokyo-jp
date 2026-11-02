-- 女子チーム枠: clubs に男女の区分を追加する（既存行は男子 = boys）
-- boys: 男子チーム（従来どおり /clubs に掲載）
-- girls: 女子チーム（/clubs/girls に掲載）
-- mixed: 男女混合で女子の受け入れを公式に明記（将来用）
alter table public.clubs
  add column if not exists team_gender text not null default 'boys';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'clubs_team_gender_chk') then
    alter table public.clubs
      add constraint clubs_team_gender_chk check (team_gender in ('boys', 'girls', 'mixed'));
  end if;
end $$;

create index if not exists clubs_team_gender_published_idx on public.clubs (team_gender) where is_published;
