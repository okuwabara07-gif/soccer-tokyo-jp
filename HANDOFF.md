# Handoff: soccer-selection.jp フロント実装

**最終更新**: 2026-09-26 (本セッション完了後)  
**プロジェクト**: soccer-selection (Vercel)  
**Supabase**: bhgvpikwhbphodswzfip (soccer-kanto)

---

## 現状

### ✅ 完了

**P0: クローラ・AdSense 対応**
- CSR → SSR 化（`/clubs` で初期 HTML にコンテンツ含める）
- canonical 修正（すべてのページで固有 URL）
- 301 リダイレクト（middleware で `/teams` → `/clubs` + DB redirects テーブル対応）
- 削除ページ処理（`is_published = true` のみ表示、自動 404）
- title/description 固有化

**P1: クラブページ実装**
- `/clubs` 一覧ページ（SSR、346 クラブ表示開始）
- `/clubs/[slug]` 詳細ページ（`v_page_club` ビューで 6 要素）
- クライアント側フィルタリング（都道府県・レベル・月謝・練習頻度）
- `slug` ベースの SEO 最適化 URL
- ISR キャッシュ設定（3600 秒）
- JSON-LD Schema.org 対応
- Header/Footer/BottomNav から `/teams` → `/clubs` 統一
- フッター説明を「関東8都県・関西6府県」に修正

### ✅ 本セッション対応内容（2026-09-26）

**P0: /selection の SSR 化**
- CSR で API を呼び出していたため、クローラと AdSense が空ページを見ていた
- サーバー側で `selections` テーブルから全 255 件を直接取得して SSR で描画
- `/src/components/SelectionClient.tsx` にフィルタ UI を分離
- 都県リスト 4 → 14 に拡張

**P1: /clubs の真因判明と対処**
- 表示が 73 件だった原因は RLS や SERVICE_ROLE_KEY ではなく、ClubsClient の `.slice(0, 100)` の仕様
- クエリ側で 352 件すべて正常に取得されていることを console.log で確認
- SERVICE_ROLE_KEY を一時的に使ったが、セキュリティリスク（is_published=false の 188 件が公開される）ため ANON_KEY に戻す
- **ページネーション実装**: `/clubs?page=2` 形式で SSR ページネーション対応
  - 100 件/ページで表示
  - First/Previous/Next/Last ナビゲーション付き

**その他の修正**
- Supabase エラーを console.error で出力するようにした（デバッグ用）
- /selection API を `v_upcoming_selections` → `selections` テーブルに変更（255 件対応）
- /clubs デフォルト表示を東京都のみ → すべての都県に変更

**教訓**
- RLS が原因ではない 73 件という中途半端な数字は、仕様的な制限の可能性が高い
- 推測で SERVICE_ROLE_KEY を使わない。必ず `curl で実測` で検証する
- build ログの「Compiled successfully」は信用できない。`Route (app)` 一覧を確認する

---

## clubs テーブル実スキーマ

```
id (UUID)
slug (string, PK of v_page_club) ← URL に使用
name (string)
name_kana (string)
prefecture (string): "東京都", "神奈川県", ... (「都」「県」まで含む)
city (string): 市区町村
club_type (string): "club" / "j_academy" / "school"
strength_label (string):
  - "全国トップクラス"
  - "関東トップクラス"
  - "関西トップクラス"
  - "府県トップクラス"
  - "府県上位"
  - "府県中位"
  - "地域リーグ"
official_url (string)
instagram (string)
monthly_fee (number): 0 = 無料、NULL = 要問合せ
practice_days (string)
practice_ground (string)
description (string)
is_published (boolean): true のみ表示
```

**重要**: `category` フィールドは存在しない（削除済み）。`area` も存在しない。

---

## 本番未反映だった原因と対処

### 原因
1. `git push origin main` を実行していなかった（ローカルコミットのみ）
2. Vercel は GitHub からのコミット時に自動デプロイする
3. vercel deploy --prod で手動デプロイしても、git push がないと次ビルドで戻る

### 対処
1. `git push origin main` 実行済み
2. その後 `vercel deploy --prod` で本番デプロイ
3. 本番確認済み:
   - ✅ `/clubs` に 14 都道府県ボタン表示
   - ✅ 「関東8都県・関西6府県」がフッターに表示
   - ✅ Header/Footer/BottomNav が `/clubs` リンク
   - ✅ フィルタUI が club_type + strength_label の実値

---

## 進行状況（2026-09-21 本セッション完了）

### 実装済み（前セッション）
1. ✅ **トップページ SSR 化 + エリア別件数の動的生成**
   - clubs テーブルから prefecture ごとの件数を動的集計
   - AREAS を `prefecture` カウント + `?prefecture=` パラメータ付きに変更
   - 本番反映済み：東京 73・神奈川 64・埼玉 50・千葉 43

### 次にやること（優先順）

### 1. 本番確認待機中
- /clubs ページで実際に都道府県別クラブ数が表示されているか確認
- StatBar で「544」「14都府県」が表示されているか確認
- トップページで口コミランキング・Jリーグセレクション情報が SSR で埋め込まれているか確認

### 2. P1 の残りルート実装
- `/leagues/[league]/[block]` — 73 ブロック
- `/areas/[pref]/[city]` — 29 市区町村
- `/selection/[id]` — 255 セレクション
- 回遊導線: `related_clubs` の理由表示

### 3. P2: sitemap.xml + IndexNow
- `v_sitemap` から全 URL を生成
- 1 ファイル 5 万 URL 上限で分割

### 4. P3: 投稿フォーム
- 口コミ (`club_reviews`)
- セレクション結果報告 (`selection_reports`)

---

## Vercel プロジェクト確認

```
vercel project ls    # soccer-selection
vercel deploy --prod # 本番デプロイ
git push origin main # GitHub 反映
```

projectId: `prj_jbKBhQE6GGzEFN7asTOAFWUiE7YE`  
本番 URL: https://soccer-selection.jp

---

## Git コミット履歴

```
796c254 fix: 存在しない area フィールドへの参照を削除
fc94137 fix: clubs テーブルスキーマに合わせて修正（category削除、club_type/city対応、strength_label実値化）+ Header/Footer URL統一
ffbd516 refactor: /clubs/[id] → /clubs/[slug] に変更（SEO改善）
e8ec9a4 fix: /teams → /clubs 301リダイレクト追加（ハードコード）
```

---

## 本セッションの検証結果（2026-09-26）

```
✅ /clubs?page=1: 100 unique clubs
✅ /clubs?page=2: 100 unique clubs
✅ /selection: SSR で 255 件の selection データ表示
✅ Supabase error logging: console.error で出力確認
```

## 次にやること（優先順）

**P2: sitemap 分割・IndexNow**
- `/clubs?page=*` すべてのページを sitemap に含める
- 5 万 URL 上限で分割

**P3: 投稿フォーム**
- 口コミ (`club_reviews`)
- 結果報告 (`selection_reports`)
- 情報提供フォーム

**AdSense 再申請**
- SSR 化・ページネーション完成後に再申請

## メモ

- Supabase anon key: `sb_publishable_jI1EG0g1M-jEM1nx68ZCww_0eApZZ4V`
- docs/SCHEMA.md に全テーブル・ビューの列定義あり
- CLAUDE.md に作業規約あり
