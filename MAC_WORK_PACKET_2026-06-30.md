# Mac作業パケット 2026/06/30 — バックエンド一括

このチャットで **DB/Vercel側のライブ点検は完了**。本ファイルは GitHub/Mac (Claude Code) で実行する分の完成手順。
上から順に実行すれば「全部一括」が回る。各タスクは独立しているので並行可。

## 今セッションで確定した検証済みファクト（コードはこの前提で書く）
- soccer DB `bhgvpikwhbphodswzfip` : teams **6,199** / 空説明 **329** / area 214 / prefecture 4値（東京2204・神奈川1545・埼玉1300・千葉1150）/ approved reviews 5。
- soccer インデックス: `idx_teams_pref_area`(prefecture,area) / `idx_teams_prefecture` / `idx_teams_category` / `idx_teams_featured`(is_jleague,is_premium,selection_start) / `idx_teams_lat_lng` 完備。**追加migration不要**。
- teams 列（32）: id(uuid PK) / name / name_kana / type / category / prefecture / area / block / selection_start,end(date) / apply_start(date) / apply_url / fee(int) / is_free,is_jleague,is_premium(bool) / description / coach_info / practice_days / access / website / instagram / twitter / facebook / founded(int) / members(int) / photo_url / lat,lng(double) / created_at / updated_at。
- reviews 列: id / team_id / team_name / nickname / body / axis / status / rating(int) / created_at。`status='approved'` のみ集計（既定pending）。
- soccer Vercel本番 READY（soccer-selection.jp）。**ビルドマシン種別はダッシュボード目視で Standard 維持を確認**（MCPで取れない）。

---

## ① soccer: 空説明329件をHaikuで補完（最優先・即実行可）
納品スクリプト `fill-team-descriptions.mjs` を `~/Documents/soccer-tokyo-jp/scripts/` に配置。

```bash
cd ~/Documents/soccer-tokyo-jp
# env（service_role は soccer のもの。.env から読むなら source でも可）
export SUPABASE_URL="https://bhgvpikwhbphodswzfip.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<soccer service_role>"
export ANTHROPIC_API_KEY="<sk-ant-...>"

node scripts/fill-team-descriptions.mjs --dry-run --limit 5   # 文面チェック
node scripts/fill-team-descriptions.mjs --limit 20            # 20件で本番試走
node scripts/fill-team-descriptions.mjs                        # 残り全329件
```
- 冪等（空の行だけ更新）・薬機法禁止語ガード・事実外の創作禁止プロンプト入り。
- 本番AI=Haiku遵守（claude-haiku-4-5-20251001）。
- 完了後、このSQLで0件を確認: `SELECT count(*) FROM teams WHERE description IS NULL OR btrim(description)='';`

---

## ② soccer: teams/[id]/page.tsx をサーバーコンポーネント化（SEO本丸）
現状 `"use client"`・generateMetadata/JSON-LD無し → クローラに評価されない。
**サーバー側でデータ取得＋メタ＋JSON-LD、対話UIは子のクライアント部品に分離**。

`src/app/team/[id]/page.tsx`（サーバー。`"use client"` を付けない）:
```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import TeamInteractive from './TeamInteractive'; // 既存の対話UIをここへ移す（"use client"）

export const revalidate = 86400; // ISR 24h

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 公開SELECTのみ。書込はしない
);

async function getTeam(id: string) {
  const { data } = await supabase.from('teams').select('*').eq('id', id).single();
  return data;
}

// 事前生成は重要4都県の一部に絞る（残りはオンデマンドISR）。約800件目安。
export async function generateStaticParams() {
  const { data } = await supabase
    .from('teams')
    .select('id')
    .order('is_premium', { ascending: false })
    .order('is_jleague', { ascending: false })
    .limit(800);
  return (data ?? []).map((t) => ({ id: t.id as string }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const t = await getTeam(params.id);
  if (!t) return { title: 'チームが見つかりません' };
  const loc = [t.prefecture, t.area].filter(Boolean).join('');
  const title = `${t.name}｜${loc}のジュニアサッカーチーム`;
  const description = (t.description && t.description.trim())
    ? t.description.slice(0, 120)
    : `${loc}で活動する${t.category ?? 'ジュニアサッカー'}チーム「${t.name}」の練習日・アクセス・募集情報。`;
  const url = `https://soccer-selection.jp/team/${t.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  };
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const t = await getTeam(params.id);
  if (!t) notFound();

  const loc = [t.prefecture, t.area].filter(Boolean).join('');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: t.name,
    sport: 'Soccer',
    ...(t.website && { url: t.website }),
    address: {
      '@type': 'PostalAddress',
      addressRegion: t.prefecture ?? undefined,
      addressLocality: t.area ?? undefined,
      addressCountry: 'JP',
    },
    ...(t.lat && t.lng && { geo: { '@type': 'GeoCoordinates', latitude: t.lat, longitude: t.lng } }),
    ...(t.description && { description: t.description }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <h1>{t.name}</h1>
        <p>{loc}{t.category ? `・${t.category}` : ''}</p>
        {t.description && <p>{t.description}</p>}
        {/* 既存の会員ゲート・レビュー投稿・地図などの対話UIはこの子に移植 */}
        <TeamInteractive team={t} />
      </main>
    </>
  );
}
```
注意点（MASTERの罠回避）:
- soccer は **src/app** 構成。root `app/` を作ると全404 → 置かない。
- 既存 page.tsx の `"use client"` ロジック（useState/onClick/会員ゲート/レビューfetch）は **`TeamInteractive.tsx`(`"use client"`)** に丸ごと移す。サーバー親→propsで`team`を渡すだけ。
- 会員限定行は **サーバー側で非会員に物理的に渡さない**（既存の `/api/team` 方針を踏襲。隠し行をHTMLに出さない）。
- `npm run build` を通してから push。commitメッセージは半角括弧のみ。

---

## ③ SalonRink: send-funnel-draft 送信層修正（メール自走ループ完走）
真因＝送信後に message id 保存と status 更新をしていない → 同一リードが無限再キュー。
対象: `send-funnel-draft` Edge Function（または `lib/approval/execute-nurture.ts` の送信後処理）。

Resend送信レスポンス受領後に必ず2点を行う:
```ts
// 1) Resend 応答検証
const resendRes = await resend.emails.send({ /* ... */ });
if (resendRes.error || !resendRes.data?.id) {
  // 失敗時は status を据え置き、エラーを記録して再試行対象に残す
  await logFailure(lead.id, resendRes.error);
  return; // ← status は new のまま（誤って nurture_sent にしない）
}

// 2) 成功時のみ status 更新 + message id 保存（これが欠けていた）
const messageId = resendRes.data.id;
await supabase.from('funnel_leads')
  .update({ status: 'nurture_sent', updated_at: new Date().toISOString() })
  .eq('id', lead.id)
  .eq('status', 'new'); // 競合防止（new のときだけ遷移）

await supabase.from('funnel_lead_events').insert({
  lead_id: lead.id,
  type: 'nurture_sent',
  metadata: { resend_message_id: messageId, sent_at: new Date().toISOString() },
});
```
ポイント:
- `funnel_leads.status` 列は `new → nurture_sent` 遷移。`.eq('status','new')` で二重送信防止。
- `funnel_lead_events` は `metadata` 列（`channel` は `payload->>'channel'` 側の話。混同しない）。
- `public.leads`（既存営業CRM）は**絶対に触らない**。対象は `public.funnel_leads`。
- 実顧客流入が無いと完走テストできない＝集客（攻め）と並行で意味を持つ。テストは source='test' を1件だけ作って検証→済んだらアーカイブ。

---

## ④ kirei / soccer: 記事ワークフロー再有効化（05/31停止分）
aokae（`weekly-auto-post-aokae.yml`）は再開済。残り2本を同型で復活。

各リポで `.github/workflows/` を確認:
```bash
# kirei
cd ~/Documents/kirei-tsurumi && ls -la .github/workflows/
# soccer
cd ~/Documents/soccer-tokyo-jp && ls -la .github/workflows/
```
対処（どちらか該当する方）:
- **`.disabled` リネームされている場合**: 末尾の `.disabled` を外して元の `*.yml` に戻す。
- **`schedule:` がコメントアウト/削除されている場合**: `on:` に cron を復活。
```yaml
on:
  schedule:
    - cron: '0 0 * * 1,5'   # 例: Mon/Fri 09:00 JST (= UTC 00:00)
  workflow_dispatch:         # 手動実行も残す
```
復活後の検証:
1. GitHub → Actions → 該当ワークフロー → "Run workflow"（手動トリガ）で1回流す。
2. 各DBで当日行が増えたか確認（soccer: articles / goods_articles / nutrition_posts、kirei: 記事テーブル）。
3. commit は半角括弧のみ。資格情報エラーではなく schedule無効化が原因なので、**再有効化＋手動1回**で回復するはず。

---

## ⑤ aokae: collect-products キーワード拡張（セルフカラー欠落ブランド）
欠落: **ビゲン / リーゼ / フレッシュライト** 等。`collect-products` Edge Function のキーワード配列に追加。

```ts
// collect-products 内のセルフヘアカラー収集キーワードに追記
const SELF_COLOR_KEYWORDS = [
  // 既存...
  'ビゲン ヘアカラー',
  'リーゼ 泡カラー',
  'フレッシュライト ミルキー',
  'ビゲン 香りのヘアカラー',
  'リーゼ プリティア',
  'フレッシュライト',
  // 楽天APIは UUID App ID 10892c8a-... を直書き（旧19桁は使わない）
];
```
注意:
- 物販表示の恒久ルール: 楽天/Yahoo公式APIの客観データ（実価格・実★・レビュー数・売れ筋順）をそのまま再提示＋sort明示。自社の優劣断定・架空★・No.1等は禁止。
- 楽天base = `openapi.rakuten.co.jp`。Yahooは LinkSwitch（`//aml.valuecommerce.com/vcdal.js`）でhead設置→生URL自動アフィリ変換。
- aokae は **app/直下（srcなし）**。`list-products` は v11（SERIES map・PRIORITY array・round-robin）。
- 拡張後 `collect-products` を一度実行→ products 行が増えたか確認→ `/ranking` 反映チェック。

---

## ⑥ aokae: DiagnosisTool.tsx「1問1ステップ」適用（納品済・未適用）
納品済リデザインをまだ当てていない。差し替え→`npm run build`→デプロイ。choices/options のフィールド名は `options`（過去バグ b249b2d の教訓）。

---

## 実行順の推奨（攻めを最優先）
1. **① soccer空説明補完**（即・無人で329件埋まる＝SEO面の地力）
2. **② server component化**（クローラ評価＝6,199ページの本番化）
3. **④ workflow再有効化**（自動集客の蛇口を戻す）
4. **⑤⑥ aokae物販＋診断**（PLF入口の転換改善）
5. **③ send-funnel-draft修正**（実顧客流入が出る前提なので最後でよい）

> ボトルネックは製品でなく集客。①②④（露出を増やす攻め）を先に倒すのが最短。
