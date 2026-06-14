const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const HASHTAG_SETS = {
  team_intro: ['#ジュニアサッカー','#少年サッカー','#関東サッカー','#サッカー少年','#サッカーチーム','#サッカー好きな人と繋がりたい','#ジュニアサッカー情報局','#東京サッカー','#神奈川サッカー','#埼玉サッカー','#千葉サッカー'],
  tips: ['#サッカー上達','#少年サッカー','#ジュニアサッカー','#サッカー練習','#サッカーtips','#サッカー好きな人と繋がりたい','#ジュニアサッカー情報局','#サッカー少年','#サッカーパパ','#サッカーママ'],
  site_feature: ['#ジュニアサッカー情報局','#少年サッカー','#ジュニアサッカー','#サッカーチーム探し','#AI診断','#関東サッカー','#サッカー少年','#サッカーパパ','#サッカーママ','#サッカー好きな人と繋がりたい'],
  motivation: ['#ジュニアサッカー','#少年サッカー','#サッカー少年','#サッカーパパ','#サッカーママ','#サッカー好きな人と繋がりたい','#ジュニアサッカー情報局','#がんばれ','#サッカー','#夢を追いかけろ'],
};

export async function generateCaption(contentType) {
  const hashtags = HASHTAG_SETS[contentType.type] || HASHTAG_SETS.motivation;
  const hashtagText = hashtags.join(' ');

  if (!ANTHROPIC_API_KEY) {
    return getSampleCaption(contentType, hashtagText);
  }

  const prompt = `あなたは関東ジュニアサッカー情報局のInstagram担当です。
アカウント: @soccer_kanto_jp
対象: 関東のジュニアサッカー選手・保護者・コーチ
サイト: https://soccer-tokyo-jp.vercel.app

今日のテーマ: ${contentType.theme}
内容: ${contentType.description}

要件:
- 日本語、100〜150文字
- 絵文字2〜4個
- 改行で読みやすく
- 最後にサイトへの誘導一言
- ハッシュタグは含めない

キャプション本文のみ出力してください。`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok || data.error) throw new Error(`Claude APIエラー: ${JSON.stringify(data.error)}`);

  return `${data.content[0].text.trim()}\n\n${hashtagText}`;
}

function getSampleCaption(contentType, hashtagText) {
  const samples = {
    team_intro: `⚽ 今日のチーム紹介！\n\n関東には個性豊かなジュニアサッカーチームが1,000以上あります。\nお子さんにぴったりのチームが必ず見つかる✨\n\nプロフィールのリンクからチームを探してみよう！`,
    tips: `⚽ 今日のサッカーTips！\n\nドリブルが上手くなりたいなら、まずはボールタッチの回数を増やすことが大切。\n毎日5分でも続けることが上達への近道です💪\n\n関東ジュニアサッカー情報局でチームを探そう！`,
    site_feature: `🔍 知ってた？\n\nAIがお子さんにぴったりのチームを診断してくれます✨\n7つの質問に答えるだけ！\n\nプロフィールのリンクから試してみてね👆`,
    motivation: `⚽ 今日も一日がんばろう！\n\n大切なのは昨日の自分より上手くなること。\n失敗を恐れずチャレンジし続ける姿勢が成長につながります💫\n\n関東のジュニアサッカー情報は情報局で！`,
  };
  return `${samples[contentType.type] || samples.motivation}\n\n${hashtagText}`;
}
