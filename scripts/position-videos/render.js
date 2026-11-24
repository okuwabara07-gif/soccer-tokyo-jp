/* eslint-disable @typescript-eslint/no-require-imports */
// usage: node render.js <page.html> preview t1,t2,...   |  node render.js <page.html> full <out.mp4> <durationSec>
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const [page, mode, a3, a4] = process.argv.slice(2);
const PR = 2;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: PR });
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto(`http://127.0.0.1:8765/${page}?pr=${PR}&aa=${process.env.AA||1}`);
  await p.waitForFunction('window.ready===true', null, { timeout: 60000 });
  if (mode === 'preview') {
    for (const t of a3.split(',').map(Number)) {
      const s = Date.now();
      await p.evaluate(t => window.render(t), t);
      await p.screenshot({ path: `prev_${page.replace('.html', '')}_${t}.jpg`, type: 'jpeg', quality: 85 });
      console.log('t', t, (Date.now() - s) + 'ms');
    }
  } else {
    const out = a3, tmp = out.replace(/\.mp4$/, '.tmp.mp4'), DUR = Number(a4), FPS = 30, START = Number(process.argv[6] || 0);
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp], { stdio: ['pipe', 'ignore', 'ignore'] });
    const t0 = Date.now();
    for (let i = Math.round(START * FPS); i < DUR * FPS; i++) {
      await p.evaluate(t => window.render(t), i / FPS);
      const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log('frame', i, Math.round((Date.now() - t0) / 1000) + 's');
    }
    ff.stdin.end();
    const code = await new Promise(r => ff.on('close', r));
    if (code === 0) { fs.renameSync(tmp, out); console.log('DONE', out); } else console.log('ffmpeg failed', code);
  }
  await b.close();
})();
