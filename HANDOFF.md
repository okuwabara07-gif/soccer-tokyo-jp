# Handoff: soccer-selection.jp フロント実装

**最終更新**: 2026-09-21 (本セッション完了後)  
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

### ✅ 本セッションで完了

1. `/clubs` の「0件のクラブ」表示を解決
   - 初期フィルタ clubType を "club" → "" (すべて) に修正
   - フィルタロジックを `clubType && ...` に修正
   - select タグに「すべて」オプション追加
   - 旧 `/api/diagnose` ルート削除（build エラー回避）

2. トップページの「読み込み中」2箇所を SSR 化
   - ReviewRankClient: props 受け取り型に変更
   - JleagueRailClient: props 受け取り型に変更
   - page.tsx で reviews・selections を SSR fetch

3. タイトル・説明の「関東の」→「関東・関西」に統一
   - layout.tsx、/selection/page.tsx 更新

4. StatBar・company ページを実値に修正
   - 「6,000+」→「544」クラブ
   - 「4都県」→「14都府県」

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

## メモ

- Supabase anon key: `sb_publishable_jI1EG0g1M-jEM1nx68ZCww_0eApZZ4V`
- 本セッションの修正内容
  - `/clubs` の 0件表示は初期フィルタ `clubType="club"` が原因 → "" に変更
  - 「読み込み中」状態の削除で初期 HTML に reviews・selections が埋め込まれる
  - StatBar・company ページの旧数字をすべて実値に更新
  - 本番反映待機中
