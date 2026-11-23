# ポジション別の解説動画（3D）

`/position/{pos}/{slug}` に載せている縦型動画の元データ。three.js で場面を描き、Playwright で1コマずつ撮って ffmpeg で MP4 にする。

- `lib.js` / `lib.css` … ピッチ・人形・ボール・矢印・テロップなど共通部品
- `df.html` / `mf.html` … 動画ごとの台本（時間ごとの動き・カメラ・字幕）。`window.render(t)` で t 秒目を描く
- `render.js` … 書き出し

```bash
cd scripts/position-videos
npm install
python3 -m http.server 8765 --bind 127.0.0.1 &
# 確認用の静止画
NODE_PATH=$(npm root -g) node render.js df.html preview 4,13,21,31
# 本番（2160x3840・30fps、2コア環境で1本40〜50分）
NODE_PATH=$(npm root -g) node render.js df.html full df_4k.mp4 40
# サイト用（1080x1920）とサムネ
ffmpeg -i df_4k.mp4 -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 22 -preset slow -tune animation -pix_fmt yuv420p -movflags +faststart -an ../../public/videos/df-1v1-defense.mp4
ffmpeg -ss 1.6 -i df_4k.mp4 -frames:v 1 -vf scale=720:1280 -q:v 3 ../../public/videos/df-1v1-defense.jpg
```

新しい動画を足すときは、html を1本追加し、`src/lib/positionVideos.ts` に本文を書く。動画だけのページにしない。
