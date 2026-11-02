-- 2026-11-02 適用済み（soccer-kanto / bhgvpikwhbphodswzfip）。記録用。
-- サッカー人生シミュレーターの「近くのクラブ」検索のため、照合用の市区町村列を追加する。既存の列は変更しない。
alter table public.clubs add column if not exists city_norm text;
alter table public.clubs add column if not exists city_norm_source text;
comment on column public.clubs.city_norm is '照合用の市区町村名（末尾の市・区・町・村を外し空白を除いた形）。サッカー人生シミュレーターの近くのクラブ検索で使う';
comment on column public.clubs.city_norm_source is 'city_norm の出どころ: city（確認済みの市区町村）/ estimated（city_estimated からの推定）';

-- 値の埋め込み（適用時に実行済み。バックアップ: clubs_backup_20261102）
-- with src as (
--   select id, name,
--     case when coalesce(trim(city),'')<>'' then regexp_replace(regexp_replace(trim(city),'\s',''),'(市|区|町|村)$','')
--          when coalesce(trim(city_estimated),'')<>'' then regexp_replace(regexp_replace(trim(city_estimated),'\s',''),'(市|区|町|村)$','') end as norm,
--     case when coalesce(trim(city),'')<>'' then 'city' when coalesce(trim(city_estimated),'')<>'' then 'estimated' end as src
--   from clubs)
-- update clubs c set city_norm = s.norm, city_norm_source = s.src
-- from src s where c.id = s.id and c.name = s.name and s.norm is not null and c.city_norm is null;
