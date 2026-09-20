# Handoff: soccer-selection.jp フロント実装

**最終更新**: 2026-09-20  
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

### ❌ 未完了

1. **`/clubs` で「0件のクラブ」が表示される**
   - 原因: クライアント側で `prefClubs` が空配列になっている
   - clubs テーブルから正しくデータが取得されていない可能性
   - SSR 時点では初期 HTML に空配列が埋め込まれている

2. **フィルタUI の旧選択肢が残っていないか検証**
   - 現在のコード: `club_type`（クラブ/J-アカデミー/学校）
   - 現在のコード: `strength_label` の実値（全国トップ/関東トップ/...）
   - 旧「カテゴリ U6〜U18」は削除済み

3. **Header 旧リンク `/teams`**
   - 現在: `/clubs` に統一完了
   - 本番確認済み

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

## 進行状況（2026-09-20 続き）

### 実装済み（本セッション）
1. **トップページ SSR 化** 
   - clubs テーブルから prefecture ごとの件数を動的集計
   - AREAS を `prefecture` カウント + `?prefecture=` パラメータ付きに変更
   - デプロイ中（bg task bi5mmhyg4）

### 次にやること（優先順）

### 1. 「0件のクラブ」の解決
```
原因特定が必要:
- ClubsClient で clubs prop が空か？
- prefecture フィルタが正しく機能しているか？
- Supabase クエリが実際に 346 件を返すか？
```

実装:
```tsx
// /clubs/page.tsx で clubs 数をログ出力（ISR 時点）
console.log(`Fetched ${clubs?.length || 0} clubs`);

// ClubsClient で initial state をチェック
console.log('Initial clubs:', clubs.length, 'prefClubs:', prefClubs.length);
```

### 2. initial state でも表示されるようにする
- SSR 時点で初期 6 クラブ分くらいを HTML に埋め込む
- 「読み込み中」状態を削除

### 3. P1 の残りルート実装
- `/leagues/[league]/[block]` — 73 ブロック
- `/areas/[pref]/[city]` — 29 市区町村
- `/selection/[id]` — 255 セレクション
- 回遊導線: `related_clubs` の理由表示

### 4. P2: sitemap.xml + IndexNow
- `v_sitemap` から全 URL を生成
- 1 ファイル 5 万 URL 上限で分割

### 5. P3: 投稿フォーム
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
- 本番で「0件」が表示されるのは非常におかしい
  - 指示書では「346 件の公開クラブ確定」
  - `v_health_check` は OK だった
  - クライアント側フィルタの初期値が問題か
  - または `/clubs` ページの SSR で clubs 配列が空になっている可能性
