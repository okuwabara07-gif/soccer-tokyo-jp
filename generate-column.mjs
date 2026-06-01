// articles テーブルに「未生成のテーマだけ」をHaikuで増分生成。lint+kill switch内蔵。
// 実行: node generate-column.mjs   (1回MAX_PER_RUN本)
// 初回まとめ生成: MAX_PER_RUN=30 node generate-column.mjs
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const e = { ...process.env };
  const p = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(p)) {
    fs.readFileSync(p, 'utf8').split('\n').forEach(line => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !e[m[1]]) {
        let v = m[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        e[m[1]] = v;
      }
    });
  }
  return e;
}
const env = loadEnv();
const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_PER_RUN = parseInt(env.MAX_PER_RUN || '3', 10);
const STATUS = env.ARTICLE_STATUS || 'published';
if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
  console.error('ERROR: キー不足 (ANTHROPIC_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'); process.exit(1);
}

const topicsFile = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'article-topics.json'), 'utf8'));
if (topicsFile.enabled === false) { console.log('KILL SWITCH: enabled=false のため生成停止。'); process.exit(0); }
const TOPICS = topicsFile.topics || [];

const FORBIDDEN = [/絶対/, /No\.?\s?1/i, /ナンバーワン/, /日本一/, /世界一/, /必ず(上達|勝|合格|うまく|強く)/, /確実に(上達|勝|合格)/, /治る/, /完治/, /治療(でき|に効)/, /症状が改善/, /予防できます/, /誰でも(必ず|簡単に|すぐ)/];
const LEAK = [/https?:\/\//i, /5253b9ed/, /hb\.afl\.rakuten/i, /af\.moshimo/i, /amazon\.co\.jp\/s\?/i, /haircolorab22/i, /picsum\.photos/i, /<\/?[a-zA-Z]+[\s>]/, /<!--/];
function lint(body) {
  const errs = [];
  if (!body || body.length < 300) errs.push('本文が短い(<300字)');
  for (const re of FORBIDDEN) if (re.test(body)) errs.push('禁止表現' + re);
  for (const re of LEAK) if (re.test(body)) errs.push('生リンク/HTML/露出' + re);
  return errs;
}

function buildPrompt(t) {
  return `あなたはジュニアサッカー(小中学生)とその保護者向けの情報サイトの編集者です。以下のテーマで記事本文を書いてください。

# テーマ
カテゴリ: ${t.category}
タイトル: ${t.title}

# 厳守ルール(法令・信頼性・YMYL配慮)
- 一般論・選び方・心構え・基本的な考え方に徹する。特定チーム名・選手名・実在セレクションの合否基準や開催日時など、事実確認が必要な個別情報は書かない。
- 上達・合格・勝利を保証しない。「絶対」「必ず上達」「No.1」「日本一」等の誇大・断定表現は使わない。
- ケガ・健康・栄養に触れる場合も治療・治癒・予防を保証しない(「一般的に」「とされています」等)。判断は専門家へと促す。
- 子どもの安全と人格を尊重し、過度にプレッシャーを煽らない。
- 外部リンク・URL・商品リンクは一切書かない(本文にhttp等を含めない)。

# スタイル
- 保護者・本人に語りかける丁寧で実用的なトーン。
- 見出しを ## で3〜5個。各見出しの下に2〜4文。箇条書き(- )も適宜。
- 全体700〜1000文字。練習・試合・家庭など具体的な場面を交える。
- 末尾に「## まとめ」。

# 出力
本文のみMarkdown。タイトルは含めず ## 見出しから開始。前置き・コードブロック・URL不要。`;
}

async function gen(t) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1800, messages: [{ role: 'user', content: buildPrompt(t) }] }),
    });
    const data = await res.json();
    if (!data.content) { console.error('(API応答異常)', JSON.stringify(data).slice(0, 120)); return null; }
    return data.content.map(c => c.text || '').join('').trim();
  } catch (e) { console.error('(fetch例外)', e.message); return null; }
}

async function existingSlugs() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=slug`, { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } });
  if (!res.ok) { console.error('既存slug取得NG', res.status); return new Set(); }
  return new Set((await res.json()).map(r => r.slug));
}

async function upsert(a) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?on_conflict=slug`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ slug: a.slug, title: a.title, excerpt: a.excerpt, category: a.category, body: a.body, status: STATUS, is_pr: false, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) console.error('  DB保存NG:', res.status, (await res.text()).slice(0, 150));
  return res.ok;
}

(async () => {
  console.log(`articles 増分生成 / model=${MODEL} / 上限${MAX_PER_RUN}本 / status=${STATUS}`);
  const have = await existingSlugs();
  const pending = TOPICS.filter(t => !have.has(t.slug));
  console.log(`テーマ総数${TOPICS.length} / 既存${have.size} / 未生成${pending.length}`);
  if (pending.length === 0) { console.log('未生成テーマなし。完了(増やすには article-topics.json に追記)。'); return; }
  const batch = pending.slice(0, MAX_PER_RUN);
  let ok = 0, ng = 0;
  for (const t of batch) {
    process.stdout.write(`  [${t.category}] ${t.title} ... `);
    const body = await gen(t);
    if (!body) { console.log('生成NG'); ng++; continue; }
    const errs = lint(body);
    if (errs.length) { console.log('LINT NG→保存せず: ' + errs.join(' / ')); ng++; continue; }
    const excerpt = body.replace(/^#.*$/gm, '').replace(/^[-*].*$/gm, '').split('\n').map(s => s.trim()).filter(Boolean)[0]?.slice(0, 70) || t.title;
    const saved = await upsert({ ...t, body, excerpt });
    console.log(saved ? `OK (${body.length}字)` : 'DB保存NG'); saved ? ok++ : ng++;
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\n完了: 生成${ok} / 失敗${ng} / 残り未生成${pending.length - batch.length}`);
})();
