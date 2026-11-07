-- サッカー人生ゲームの利用回数（遊び始め・最後まで遊んだ）を数えるテーブル。個人情報は持たない。
-- 書き込みは /api/life/log から service role で行う。RLS を有効にし、ポリシーは作らない（anon からは読めない・書けない）。
create table if not exists public.life_plays (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  event text not null check (event in ('start','end')),
  mode text not null check (mode in ('play','ikusei','world')),
  girl boolean not null default false,
  country text,
  result text,
  utm_source text,
  ref_host text
);
alter table public.life_plays enable row level security;
create index if not exists life_plays_created_at_idx on public.life_plays (created_at);
create index if not exists life_plays_mode_event_idx on public.life_plays (mode, event);
