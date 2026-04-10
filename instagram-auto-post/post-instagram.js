import { generateCaption } from './generate-caption.js';

const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

const CONTENT_TYPES = [
  { type: 'team_intro', theme: 'チーム紹介', description: '関東のジュニアサッカーチームを1チームピックアップして紹介する投稿' },
  { type: 'tips', theme: 'サッカーTips', description: 'ジュニア選手向けのサッカー上達tips・練習方法の投稿' },
  { type: 'site_feature', theme: 'サイト機能紹介', description: '関東ジュニアサッカー情報局のAI診断・マップ検索などの機能紹介投稿' },
  { type: 'motivation', theme: 'モチベーション', description: 'ジュニア選手・保護者向けのモチベーションアップ投稿' },
];

function getTodayContentType() {
  return CONTENT_TYPES[new Date().getDay() % CONTENT_TYPES.length];
}

async function createMediaContainer(imageUrl, caption) {
  const url = `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media`;
  const params = new URLSearchParams({ image_url: imageUrl, caption, access_token: META_ACCESS_TOKEN });
  const res = await fetch(`${url}?${params}`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`コンテナ作成失敗: ${JSON.stringify(data.error)}`);
  console.log(`✅ コンテナ作成成功: ${data.id}`);
  return data.id;
}

async function waitForContainer(containerId, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const params = new URLSearchParams({ fields: 'status_code', access_token: META_ACCESS_TOKEN });
    const res = await fetch(`${GRAPH_API_BASE}/${containerId}?${params}`);
    const data = await res.json();
    console.log(`⏳ 状態確認 (${i + 1}/${maxRetries}): ${data.status_code}`);
    if (data.status_code === 'FINISHED') return true;
    if (data.status_code === 'ERROR') throw new Error('コンテナ処理エラー');
  }
  throw new Error('タイムアウト');
}

async function publishPost(containerId) {
  const url = `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media_publish`;
  const params = new URLSearchParams({ creation_id: containerId, access_token: META_ACCESS_TOKEN });
  const res = await fetch(`${url}?${params}`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`投稿失敗: ${JSON.stringify(data.error)}`);
  console.log(`🎉 投稿成功! ID: ${data.id}`);
  return data.id;
}

async function main() {
  console.log('🚀 Instagram自動投稿開始...');
  console.log(`📅 ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);
  if (!INSTAGRAM_ACCOUNT_ID || !META_ACCESS_TOKEN) throw new Error('環境変数が未設定です');
  const imageUrl = process.env.IMAGE_URL;
  if (!imageUrl) throw new Error('IMAGE_URLが未設定です');
  const contentType = getTodayContentType();
  console.log(`📌 今日のテーマ: ${contentType.theme}`);
  const caption = await generateCaption(contentType);
  console.log(`📝 キャプション:\n${caption}\n`);
  const containerId = await createMediaContainer(imageUrl, caption);
  await waitForContainer(containerId);
  await publishPost(containerId);
  console.log('✅ 完了!');
}

main().catch(err => { console.error('❌ エラー:', err.message); process.exit(1); });
