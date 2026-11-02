-- 2026-11-02 適用済み（soccer-kanto）。記録用。
-- 「今日の1人」のInstagram投稿用画像を置く公開バケット。Instagram Graph API は公開URLの画像しか受け付けないため公開にする。
-- 書き込みは GitHub Actions からサービスロールキーでのみ行う（anon の書き込みポリシーは作らない）。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('life-posts', 'life-posts', true, 5242880, array['image/jpeg','image/png','application/json','text/plain'])
on conflict (id) do nothing;
-- 2026-11-03: TikTok（Higgsfield経由）用にキャプション（text/plain）も置けるようにした
