// 15記事をHaikuで生成してSupabase goods_articlesに投入
// 実行: cd ~/Documents/soccer-tokyo-jp && node generate-articles.mjs
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) {
    let v = m[2].trim();
    // 前後のクォートを除去
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    env[m[1]] = v;
  }
});
const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
  console.error('ERROR: .env.local のキー不足'); process.exit(1);
}
console.log('キー確認: ANTHROPIC先頭', ANTHROPIC_API_KEY.slice(0,7), '/ SERVICE_KEY長', SERVICE_KEY.length);

const RAKUTEN = (kw) => `https://hb.afl.rakuten.co.jp/hgc/5253b9ed.08f9d938.5253b9ee.e71aefe8/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F${encodeURIComponent(kw)}%2F`;
const AMAZON = (kw) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=haircolorab22-22`;

const ARTICLES = [
  { slug:'nyudan-checklist-full', category:'入団準備', title:'サッカー入団準備チェックリスト【完全版】', kw:'サッカー 入団 準備セット', rakutenKw:'ジュニア サッカー スターターセット' },
  { slug:'ensei-mochimono', category:'遠征準備', title:'サッカー遠征の持ち物リストと選び方', kw:'サッカー 遠征 バッグ', rakutenKw:'サッカー 遠征 ボストンバッグ' },
  { slug:'natsu-suibun', category:'夏対策', title:'夏のサッカー 水分補給と熱中症対策ガイド', kw:'スポーツ 水筒 大容量 保冷', rakutenKw:'スポーツ 水筒 1リットル 保冷' },
  { slug:'fuyu-boukan', category:'冬対策', title:'冬のサッカー 防寒対策とウェアの選び方', kw:'サッカー 防寒 インナー', rakutenKw:'サッカー 防寒 ネックウォーマー' },
  { slug:'ame-taisaku', category:'雨の日対策', title:'雨の日のサッカー装備とケアの方法', kw:'サッカー ピステ レインウェア', rakutenKw:'サッカー ピステ 上下' },
  { slug:'gk-glove-erabi', category:'GK専用', title:'ジュニアGKグローブの選び方とお手入れ', kw:'キーパーグローブ ジュニア', rakutenKw:'キーパーグローブ ジュニア' },
  { slug:'jy-junbi', category:'ジュニアユース準備', title:'ジュニアユースに上がる前に準備したいこと', kw:'サッカー 大型バッグ', rakutenKw:'サッカー リュック 大容量' },
  { slug:'hoshoku-timing', category:'補食・栄養', title:'試合前後の補食タイミングとおすすめアイテム', kw:'スポーツ 補食 ゼリー', rakutenKw:'スポーツ ゼリー 補給' },
  { slug:'spike-erabikata', category:'スパイク', title:'サッカースパイクの選び方完全ガイド', kw:'ジュニア サッカースパイク', rakutenKw:'ジュニア サッカースパイク' },
  { slug:'bag-erabi', category:'バッグ', title:'サッカーバッグの選び方（容量・種類）', kw:'サッカー リュック ボール', rakutenKw:'サッカー リュック ボール収納' },
  { slug:'suito-erabi', category:'水筒', title:'スポーツ用水筒の選び方とおすすめタイプ', kw:'スポーツ 水筒 ジャグ', rakutenKw:'スポーツ ウォータージャグ' },
  { slug:'inner-erabi', category:'インナー', title:'サッカーインナーの選び方（夏・冬）', kw:'サッカー インナー コンプレッション', rakutenKw:'サッカー コンプレッション インナー' },
  { slug:'legguard-erabi', category:'レガース', title:'レガース（すね当て）の選び方とサイズ', kw:'サッカー レガース ジュニア', rakutenKw:'サッカー すね当て ジュニア' },
  { slug:'socks-erabi', category:'靴下', title:'サッカーソックスの選び方（厚さ・長さ・滑り止め）', kw:'サッカーソックス 滑り止め', rakutenKw:'サッカーソックス グリップ' },
  { slug:'care-kihon', category:'ケア用品', title:'ケガ予防と疲労ケアの基本アイテム', kw:'アイシング サッカー', rakutenKw:'スポーツ アイシング 冷却' },
];

function buildPrompt(a) {
  return `あなたはジュニアサッカー(小中学生)の保護者向け情報サイトの編集者です。以下のテーマで記事本文を書いてください。

# テーマ
カテゴリ: ${a.category}
タイトル: ${a.title}

# 厳守ルール(法令・信頼性)
- 価格や在庫、具体的なスペック数値は断定しない。必要なら「各販売サイトでご確認ください」と書く。
- 商品の効果・効能を断定しない(特に栄養・ケア用品は薬機法に配慮し「一般的に」「とされています」等)。
- 治療・治癒・予防を保証する表現は使わない。
- 特定の実在ブランド名・選手名・チーム名を主役にしない(一般名詞中心。ブランドは選び方の傾向として簡潔に触れる程度はOK)。
- 誇大表現・煽り・「絶対」「No.1」は使わない。
- 子どもの安全に配慮する。

# スタイル
- 保護者に語りかける丁寧で実用的なトーン。
- 見出しを ## で3〜5個(例: 選び方のポイント/季節・用途別/よくある質問/まとめ)。
- 各見出しの下に2〜4文。箇条書きも適宜(- で始める)。
- 全体600〜900文字。具体的な場面(練習・試合・遠征)を交える。
- 末尾に「まとめ」。

# 出力
本文のみMarkdown。タイトルは含めず##見出しから。前置き・コードブロック不要。`;
}

async function genArticle(a) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1500, messages: [{ role: 'user', content: buildPrompt(a) }] }),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { console.error('  非JSON応答:', text.slice(0,150)); return null; }
  if (!data.content) { console.error('  生成失敗:', JSON.stringify(data).slice(0,200)); return null; }
  let body = data.content.map(c => c.text || '').join('').trim();
  body += `\n\n## おすすめ商品をチェック\n商品の価格・在庫は各販売サイトでご確認ください。\n\n- [楽天市場で「${a.rakutenKw}」を見る](${RAKUTEN(a.rakutenKw)})\n- [Amazonで「${a.kw}」を見る](${AMAZON(a.kw)})`;
  const excerpt = body.replace(/^##.*$/gm, '').replace(/[-*].*$/gm,'').split('\n').map(s=>s.trim()).filter(Boolean)[0]?.slice(0, 60) || a.title;
  return { ...a, body, excerpt };
}

async function upsert(article) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/goods_articles?on_conflict=slug`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ slug: article.slug, title: article.title, excerpt: article.excerpt, category: article.category, body: article.body, is_pr: true, status: 'published', updated_at: new Date().toISOString() }),
  });
  if (!res.ok) { const t = await res.text(); console.error('  DB保存NG:', res.status, t.slice(0,150)); }
  return res.ok;
}

(async () => {
  console.log('15記事をHaikuで生成中...');
  let ok = 0;
  for (const a of ARTICLES) {
    process.stdout.write(`  ${a.category}「${a.title}」... `);
    const art = await genArticle(a);
    if (!art) { console.log('生成NG'); continue; }
    const saved = await upsert(art);
    console.log(saved ? `OK (${art.body.length}字)` : 'DB保存NG');
    if (saved) ok++;
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(`\n完了: ${ok}/15 記事を投入しました。`);
})();
