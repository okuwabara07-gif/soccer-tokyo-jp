# Claude Code 実装指示書 — soccer LINE会員5機能 2026/07/01

対象リポ: `~/Documents/soccer-tokyo-jp`（src/app構成 / 本番 soccer-selection.jp / Supabase bhgvpikwhbphodswzfip）
DB土台は **2026/07/01 に本番構築済**（`sw_` 名前空間・6テーブル・RLS有効）。本書は「テーブルはある、コードを書く」フェーズ。

## 厳守ルール
- src/app 構成。root app/ は作らない(全404)。
- 本番AI生成は Claude Haiku のみ(claude-haiku-4-5-20251001)。
- 秘密値は env から読む。表示・cat .env* 禁止。
- 禁止語(絶対/No.1/日本一/治る/最高/保証/効果/確実/無料)を出力しない。fee=0は「無料」と書かない(fee>0のみ¥表示)。
- commit は半角括弧のみ。push前に npm run build。通るまで push しない。
- RLSは緩めない。書き込みは service_role(サーバー)経由のみ。
- 既存 sa_ テーブル(son-soccer-app=入団後の家族予定管理)は触らない。今回は sw_(入団前=探索/会員化)のみ。
- **口コミは絶対にAI自動生成・自作投入しない(景表法のサクラ規制)。本物の会員投稿のみ。詳細は機能④参照。**

## 使う既存資産
- LINE会員ゲート/OAuth: 既存の son-soccer-app 実装(サーバーサイドLINE OAuth・JWTセッション)を流用。
- LINE公式 @641jwqts(soccer)。push送信は Messaging API(pushMessage)。トークンは既存のsoccer OAチャネル。
- teams列: id(uuid) / name / prefecture / area / category / selection_start,end(date) / apply_url / is_published。
- 通知対象は is_published=true のチームのみ。

## DBスキーマ(構築済・参照用)
- `sw_watchers`(id, line_user_id UNIQUE, display_name, is_premium, trial_started_at, premium_until, timestamps)
- `sw_watches`(id, watcher_id, watch_type 'team'|'area', team_id, prefecture, area) — 重複防止unique index済
- `sw_notify_log`(id, watcher_id, team_id, kind, dedupe_key, sent_at) — (watcher_id,dedupe_key) unique
- `sw_diagnoses`(id, watcher_id nullable, share_code UNIQUE, answers jsonb, result jsonb)
- `sw_team_reviews`(id, team_id, watcher_id, rating 1-5, axis, body, status 'pending'|'approved'|'rejected') — (team_id,watcher_id) unique
- `sw_growth_cards`(id, watcher_id, child_name, grade, data jsonb, timestamps)

---

## 実装順(①→⑤。①②は連続、土台を共有)

### 機能① セレクション締切アラート ★最初
目的: 検索で来た保護者を「このチームの締切をLINEで受け取る」で会員化。
1. チーム個別ページ(TeamInteractive.tsx)に「LINEで締切通知を受け取る」ボタン追加。未ログインならLINEログインへ、ログイン済なら `sw_watches`(watch_type='team', team_id) に登録するAPIを叩く。
2. API `POST /api/watch`(サーバー): JWTセッションからline_user_id取得→ `sw_watchers` を upsert(なければ作成)→ `sw_watches` に team を追加。RLSがあるので service_role で。
3. Edge Function `notify-selection`(日次cron 例: 09:00 JST):
   - `teams` から is_published=true かつ selection_start が「今日から7日以内(未来)」を抽出。
   - 各チームを watch している watcher を `sw_watches`(team) から引く。
   - dedupe_key = `selection_deadline:{team_id}:{selection_start}` で `sw_notify_log` に無ければ LINE pushMessage 送信→ログ挿入。既にあればスキップ(二度送らない)。
   - push文面はテンプレ(禁止語なし)。「〇〇のセレクション申込開始が近づいています。詳細: https://soccer-selection.jp/teams/{id}」。
4. cron は Vercel cron か Supabase pg_cron。既存soccerのcron方式に合わせる。

### 機能② エリア一括ウォッチ(①の応用・ほぼ追加コストなし)
1. エリアページ or チームページに「{area}のセレクション情報をLINEで受け取る」ボタン→ `sw_watches`(watch_type='area', prefecture, area)。
2. `notify-selection` を拡張: team watch に加え、該当チームの (prefecture,area) を area watch する watcher にも送る。dedupe_key に watcher種別を含めて二重送信回避。

### ★実装順の変更(2026/07/01 実データ確認による)
selection_start が入っているのは公開6,175件中 **20件のみ**。①締切アラートは通知ネタが不足し空回りする。
→ **③診断を最初に実装**(既存データだけで全6,175件を絞り込める・今すぐ会員入口になる)。
→ 順序: **③ → ④/② → ①(selection_startデータ充実後) → ⑤**。①の器(sw_watches team)は構築済なのでデータが増えれば即動く。
→ 別途セレクション情報の収集(公式サイト巡回/会員投稿/手動)が①を活かす前提。

### 機能③ AIチーム診断(新規獲得の入口) ★最初に実装
実データ確認済(2026/07/01)。category 20種・type 9種・area 214種すべて実在→どの回答でも結果が返せる。
質問設計(実カラム値にマップ):
- Q1 エリア: prefecture(東京都/神奈川県/埼玉県/千葉県) → area(市区町村214から選択)。→ teams.prefecture, teams.area で絞り込み。
- Q2 年代: 未就学(U6/U7/U8) / 低学年(U9/U10) / 高学年(U11/U12) / 中学生(U13/U14/U15) / 女子(女子U12/女子U15) / 高校(U18)。→ teams.category。
- Q3 環境: 本格志向(type in Jリーグ系,J下部,クラブチーム) / 楽しく(街クラブ,少年団) / 技術特化(スクール) / フットサル(フットサル)。→ teams.type。
- Q4 通える頻度: 週1-2 / 週3以上 / こだわらない。→ teams.practice_days(82%充足・部分一致で緩く判定・未入力は除外しない)。
実装:
1. `/diagnosis`(soccer側 src/app)。上記4問。kireiのヘア診断UIの型(1問1ステップ)を流用。
2. 回答→ サーバーで teams(is_published=true) を AND フィルタ→上位数件を提示。必要なら Haiku で「なぜ合うか」短文(事実ベース・禁止語なし・架空情報禁止・fee=0は無料と書かない)。結果を `sw_diagnoses`(answers jsonb, result jsonb{matched_team_ids,reason}, share_code) に保存。未ログインでも share_code で保存し、後でLINE会員に紐付け。
3. 結果画面から各チームへ `/teams/{id}` リンク＋「LINEでこのチーム/エリアを追う」→①②へ合流。ログイン時 watcher_id を diagnoses に紐付け。
4. 診断は無料開放(会員入口)。マッチ結果の詳細や複数保存を会員特典にする等の線引きは既存会員ゲート方針に合わせる。

### 機能④ 会員口コミ(SEO×会員の好循環) ※景表法遵守が最重要
**絶対禁止**: AIや運営による口コミの自動生成・代理投稿・水増し。サクラ/やらせは景表法(2023/10〜ステマ規制)違反。
やること(本物の投稿を増やす仕組みのみ):
1. 投稿UI: ログイン会員が実体験を投稿→ `sw_team_reviews`(status='pending')。1会員1チーム1件(unique済)。rating/axis/body。
2. 承認フロー: status を人が pending→approved/rejected(目視)。**自動承認しない**。運営承認したものだけ表示。
3. 表示: チームページに status='approved' のみ表示。投稿者は「会員の口コミ」等の匿名表記(個人特定情報を出さない)。
4. 「定期的に投稿が入る」施策=合法な範囲で投稿を"促す"だけ:
   - ①の締切通知や③診断の後、**実際にそのチームに関わった会員にだけ** LINEで「体験を投稿しませんか」と促す(週次バッチ)。
   - 投稿した会員に相互性のある特典(承認済み口コミの先行閲覧等)。
   - 促すだけで、中身は必ず本人が書く。運営が代筆・生成しない。
5. 承認運用の自動化(合法): 新規pendingを日次でSlackへ通知して運営が承認判断できるようにする(承認自体は人)。

### 機能⑤ 成長カルテ(KDP資産と接続・会員上位機能)
1. `sw_growth_cards` に記録UI(会員のみ)。child_name/grade/data(jsonb=可変記録)。
2. KDP「サッカー成長カルテ」の項目をデジタル化。まずは最小(記録の追加・一覧・編集)。
3. 継続率向上が目的なので①〜④で会員が育ってから拡張。

---

## 進め方
1. まず①だけ完成させて本番デプロイ→動作確認(自分のLINEで watch→翌日通知テスト)。
2. ②は①のcron拡張だけ。③④⑤は順次。
3. 各機能ごとに npm run build を通し、commit(半角括弧)→push。まとめて大きく変えない。
4. LINE push は少量でテスト(自分のuserIdのみ)してから本番配信。

## 注意(ハマりどころ)
- push対象が0件でもエラーにしない。dedupe_key で必ず冪等に。
- selection_start が null のチームは通知対象外。
- is_published=false(隔離24件)は通知にもページにも出さない。
- 会員判定(is_premium)ゲート: 締切通知の"登録"は無料で開放して会員化の入口にし、"詳細な申込先/複数エリア/成長カルテ"を有料にする等、無料と有料の線引きを設計(既存の会員ゲート方針に合わせる)。
