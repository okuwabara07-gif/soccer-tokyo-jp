-- life_plays に「ページを開いた（view）」と、紹介ページ /life（mode = lp）を記録できるようにする。
alter table public.life_plays drop constraint if exists life_plays_event_check;
alter table public.life_plays add constraint life_plays_event_check check (event in ('view','start','end'));
alter table public.life_plays drop constraint if exists life_plays_mode_check;
alter table public.life_plays add constraint life_plays_mode_check check (mode in ('lp','play','ikusei','world'));
