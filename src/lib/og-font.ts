// 告知画像（next/og）用の日本語フォント。画像に使う文字だけを Google Fonts から取り寄せる（数KB〜数十KB）。
// 取得できない環境では OG_FONT_PATH（ttf/otf）を読む。どちらも無ければフォント指定なし（日本語は表示されない）。
type Font = { name: string; data: ArrayBuffer; weight: 400 | 700 | 900; style: "normal" };

const cache = new Map<string, ArrayBuffer>();

async function googleFont(text: string, weight: number): Promise<ArrayBuffer | null> {
  const key = `${weight}:${text}`;
  if (cache.has(key)) return cache.get(key)!;
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; soccer-selection-og)" },
    })).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const buf = await (await fetch(url)).arrayBuffer();
    if (cache.size > 200) cache.clear();
    cache.set(key, buf);
    return buf;
  } catch {
    return null;
  }
}

export async function ogFonts(text: string): Promise<Font[]> {
  const chars = Array.from(new Set(Array.from(text + "0123456789/〜・（）年月日時分：:-.　 ")) ).join("");
  const [b, k] = await Promise.all([googleFont(chars, 700), googleFont(chars, 900)]);
  if (b && k) return [{ name: "NotoSansJP", data: b, weight: 700, style: "normal" }, { name: "NotoSansJP", data: k, weight: 900, style: "normal" }];
  if (process.env.OG_FONT_PATH) {
    const { readFile } = await import("fs/promises");
    const f = await readFile(process.env.OG_FONT_PATH);
    const data = f.buffer.slice(f.byteOffset, f.byteOffset + f.byteLength) as ArrayBuffer;
    return [{ name: "NotoSansJP", data, weight: 700, style: "normal" }, { name: "NotoSansJP", data, weight: 900, style: "normal" }];
  }
  return [];
}
