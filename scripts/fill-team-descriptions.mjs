#!/usr/bin/env node
/**
 * fill-team-descriptions.mjs  (v2 / 2026-06-30)
 * soccer-selection.jp : teams.description が空のチームを Haiku で補完。
 *
 * v2 の修正点（dry-run検証で判明した実害への対応）:
 *  1. fee=0 を「無料」と書かせない。fee>0 のときだけ月会費に言及。
 *     （fee=0 の多くは「未入力のデフォルト0」で実際は無料ではない＝景表法リスク）
 *  2. is_free 列は信頼度が低い(702件の矛盾)ため facts から除外。
 *  3. 文章を120〜180字に・構文テンプレ化を禁止（重複コンテンツ回避）。
 *  4. is_published=true の行のみ対象（ゴミ23件は隔離済み）。
 *  5. 念のためゴミ正規表現＋過長名(>22字=名前汚染)はスキップしREVIEW出力。
 *
 * 使い方:
 *   node scripts/fill-team-descriptions.mjs --dry-run --limit 5
 *   node scripts/fill-team-descriptions.mjs --limit 20
 *   node scripts/fill-team-descriptions.mjs
 *   node scripts/fill-team-descriptions.mjs --review   # スキップ対象だけ一覧表示
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!SUPABASE_URL || !SERVICE_KEY || !ANTHROPIC_API_KEY) {
  console.error('[FATAL] env 不足: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ANTHROPIC_API_KEY');
  process.exit(1);
}

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const REVIEW_ONLY = argv.includes('--review');
const limitArg = argv.indexOf('--limit');
const LIMIT = limitArg !== -1 ? parseInt(argv[limitArg + 1], 10) : null;

const MODEL = 'claude-haiku-4-5-20251001';
const CONCURRENCY = 4;
const SLEEP_BETWEEN_MS = 250;
const MAX_RETRY = 2;

const BANNED = ['絶対', 'No.1', 'NO.1', 'no.1', '日本一', '治る', '最高', '保証', '効果', '確実', '無料'];
// 「無料」をガード対象に含め、会費の無料断定を物理的に防ぐ。

// ゴミ・名前汚染の検出（生成スキップ＝手動レビュー対象）
const JUNK_RE = /^[0-9]{4}|リーグ|とは$|について|コラム|インタビュー|寄稿|^〒|http|ニュース|ランキング|まとめ|特集|全節|組合せ|要項|協会フットボールセンター/;
const POLLUTED = (name) => name.length > 30 || JUNK_RE.test(name); // 30: 改名済み正規名(東急S…等)を通す

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hasBanned = (t) => BANNED.some((w) => t.includes(w));

/** 構造化データからファクトを作る。fee=0 は「無料」でなく「記載なし」扱い＝出さない。 */
function buildFacts(t) {
  const lines = [];
  lines.push(`チーム名: ${t.name}`);
  if (t.name_kana) lines.push(`読み: ${t.name_kana}`);
  if (t.prefecture) lines.push(`都道府県: ${t.prefecture}`);
  if (t.area) lines.push(`エリア(市区町村): ${t.area}`);
  if (t.block) lines.push(`地区: ${t.block}`);
  if (t.category) lines.push(`カテゴリ: ${t.category}`);
  if (t.type) lines.push(`種別: ${t.type}`);
  if (t.practice_days) lines.push(`練習日: ${t.practice_days}`);
  if (t.access) lines.push(`アクセス: ${t.access}`);
  if (typeof t.fee === 'number' && t.fee > 0) lines.push(`月会費: ${t.fee}円`); // fee>0 のみ
  if (typeof t.founded === 'number' && t.founded > 1900) lines.push(`設立: ${t.founded}年`);
  if (typeof t.members === 'number' && t.members > 0) lines.push(`所属人数: 約${t.members}名`);
  return lines.join('\n');
}

const SYSTEM_PROMPT = `あなたは関東のジュニアサッカーチーム情報メディアの編集者です。
与えられた「事実」だけを使い、保護者がチーム概要を把握できる中立で具体的な日本語の紹介文を書きます。

厳守:
- 事実に書かれていない情報を創作しない（架空のコーチ名・実績・受賞・指導方針・人数・費用の断定は禁止）。
- 費用について、事実に月会費の記載が無い場合は費用に一切触れない。「無料」「0円」と書かない。
- 誇大表現・優劣の断定をしない。禁止語: 絶対 / No.1 / 日本一 / 治る / 最高 / 保証 / 効果 / 確実 / 無料。
- 推測（〜のようです等）を書かない。事実の言い換えと、エリアの地理的文脈の一般的説明のみ許可。
- 120〜180文字。2〜3文。毎回同じ構文を避け、与えられた事実の組み合わせで自然に変化させる。
- 地名・エリア・カテゴリを自然に含めSEOに配慮。出力は本文のみ（前置き・記号・引用符なし）。`;

async function generateDescription(team) {
  const facts = buildFacts(team);
  const userMsg = `次の事実だけを使い、このチームの紹介文を1つ書いてください。事実に無いことは書かないでください。\n\n${facts}`;
  for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 500, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: userMsg }] }),
    });
    if (res.status === 429 || res.status >= 500) { await sleep(1500 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
    if (!text) continue;
    if (hasBanned(text)) { console.warn('  [guard] 禁止語検出 -> 再生成'); continue; }
    if (text.length < 60) { console.warn('  [guard] 短すぎ -> 再生成'); continue; }
    return text;
  }
  return null;
}

async function main() {
  console.log(`[start] mode=${REVIEW_ONLY ? 'REVIEW' : DRY_RUN ? 'DRY-RUN' : 'WRITE'} model=${MODEL}`);

  let query = supabase
    .from('teams')
    .select('id,name,name_kana,prefecture,area,block,category,type,practice_days,access,fee,founded,members,description,is_published')
    .eq('is_published', true)
    .or('description.is.null,description.eq.')
    .order('prefecture', { ascending: true });
  if (LIMIT && !REVIEW_ONLY) query = query.limit(LIMIT);

  const { data: rows, error } = await query;
  if (error) { console.error('[FATAL]', error.message); process.exit(1); }

  const all = rows.filter((t) => !t.description || t.description.trim() === '');
  const clean = all.filter((t) => !POLLUTED(t.name));
  const review = all.filter((t) => POLLUTED(t.name));

  console.log(`[info] 対象=${all.length} / 生成=${clean.length} / 要レビュー(スキップ)=${review.length}`);

  if (REVIEW_ONLY) {
    console.log('\n=== 名前汚染で手動レビューが必要な行（生成しない） ===');
    review.forEach((t) => console.log(`  ${t.id}  ${t.name}`));
    console.log('\n対処: name 列を正規のチーム名に修正後、本スクリプトを再実行すれば自動で拾われます。');
    return;
  }

  const targets = LIMIT ? clean.slice(0, LIMIT) : clean;
  let ok = 0, fail = 0, idx = 0;

  async function worker() {
    while (idx < targets.length) {
      const my = idx++;
      const team = targets[my];
      const tag = `[${my + 1}/${targets.length}]`;
      try {
        const desc = await generateDescription(team);
        if (!desc) { fail++; console.warn(`${tag} FAIL  ${team.name}`); }
        else if (DRY_RUN) { ok++; console.log(`${tag} DRY   ${team.name}\n        ${desc}`); }
        else {
          const { error: upErr } = await supabase.from('teams')
            .update({ description: desc, updated_at: new Date().toISOString() }).eq('id', team.id);
          if (upErr) { fail++; console.warn(`${tag} DBERR ${team.name}: ${upErr.message}`); }
          else { ok++; console.log(`${tag} OK    ${team.name}`); }
        }
      } catch (e) { fail++; console.warn(`${tag} ERR   ${team.name}: ${e.message}`); }
      await sleep(SLEEP_BETWEEN_MS);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, () => worker()));
  console.log(`\n[done] ok=${ok} fail=${fail}  (要レビュー${review.length}件は別途 name 修正)`);
  if (DRY_RUN) console.log('※ DRY-RUN。問題なければ --dry-run を外して再実行。');
}

main().catch((e) => { console.error('[FATAL]', e); process.exit(1); });
