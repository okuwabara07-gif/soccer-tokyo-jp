// サッカー人生シミュレーター「4.5万分の1」の毎日の投稿を作る。
// 使い方: node scripts/life-post/make-post.mjs 2026-11-02 [出力フォルダ]
// 出力: <日付>.png（1080x1350の結果カード）と <日付>.txt（X用投稿文）
// 画像の描画には playwright（chromium）を使う。ゲームのエンジンは public/life/play.html から読み込むので、ゲームと同じ確率で人生が決まる。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const date = process.argv[2] || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const outDir = process.argv[3] || "life-posts";
fs.mkdirSync(outDir, { recursive: true });

const html = fs.readFileSync(new URL("../../public/life/play.html", import.meta.url), "utf8");
const engine = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(engine + "\n;globalThis.__E = { autoPlay, PREFS };", ctx);
const { autoPlay } = ctx.__E;

// 曜日ごとに見せたい人生のタイプを変える（同じ結末が続かないように）
const T2 = st => (st.after && st.after.title) || "";
const KINDS = [
  ["プロになった1人", st => !!st.pro],
  ["早生まれの逆転", st => [1,2,3].includes(st.month) && st.level >= 5],
  ["夢をあきらめなかった", st => T2(st) === "夢をあきらめなかった社会人選手"],
  ["子どもに教える側へ", st => /指導者|教えたコーチ/.test(T2(st)) && !st.pro],
  ["何歳からでも戻れる", st => T2(st) === "何歳からでも戻ってきた人"],
  ["当番をする側へ", st => T2(st) === "当番をする側になった元サッカー少年"],
  ["70歳でもボールを蹴る", st => T2(st) === "70歳でもボールを蹴る人"],
];
const day = new Date(date + "T00:00:00Z");
const [kindName, test] = KINDS[day.getUTCDay()];
const base = Number(date.replaceAll("-", "")) * 1000;
let r = null, seed = 0;
for (let k = 0; k < 200000; k++) { seed = base + k; const x = autoPlay(seed); if (test(x.st)) { r = x; break; } }
if (!r) { seed = base; r = autoPlay(seed); }
const st = r.st;

const TOP = [null,100,94.99,73.97,16.5,1.5,0.39,0.31,0.18,0.05,0.02];
const top0 = TOP[st.level]; const top = top0 >= 10 ? Math.round(top0) : top0;
const path_ = [...new Set(st.career.map(c => c.team))].filter(t => !/幼稚園|キッズ|公園/.test(t));
const route = (st.pro ? [...path_, `${st.pro.best}で${st.pro.years}年`] : [...path_, st.ending]).join("→");
const title = st.after ? st.after.title : "";
let text = `【今日の1人】${st.pref}・${st.month}月生まれの${st.pos || ""}\n${route}\n第2章「${title}」\n${top0 >= 90 ? "同学年4.5万人の1人として、ボールを蹴った。" : `同学年4.5万人のうち上位${top}%。`}\nあなたの人生は→ https://soccer-selection.jp/life/play?utm_source=x&utm_medium=daily#s${seed}\n#少年サッカー #サッカー人生`;
// 長すぎるときは経路を短くする（Xは全角140字が目安。URLは23字として数える）
const weight = s => [...s.replace(/https?:\/\/\S+/g, "x".repeat(23))].reduce((a, c) => a + (/[ -~]/.test(c) ? 1 : 2), 0);
if (weight(text) > 280) text = text.replace(route + "\n", `${path_[0]}→…→${st.pro ? st.pro.best + "で" + st.pro.years + "年" : st.ending}\n`);
fs.writeFileSync(path.join(outDir, `${date}.txt`), `${text}\n\n[タイプ] ${kindName}\n[seed] ${seed}\n`);

// 結果カード（ゲームの結果カードと同じデザイン）
const card = { pref: st.pref, month: st.month, pos: st.pos || "", height: Math.round(st.height || 0), ending: st.ending, top, ppl: Math.max(1, Math.round(45000 * top0 / 100)).toLocaleString("ja-JP"), title, career: st.after ? st.after.career : 0, route, kind: kindName };
const page = `<html><body style="margin:0"><canvas id="c" width="1080" height="1350"></canvas><script>
const d = ${JSON.stringify(card)}; const c = document.getElementById("c"), x = c.getContext("2d"), W = 1080, H = 1350, F = "'Noto Sans CJK JP','Noto Sans JP',sans-serif";
x.fillStyle = "#14213a"; x.fillRect(0,0,W,H);
x.fillStyle = "rgba(255,255,255,.05)"; for (let i=0;i<54;i++) for (let j=0;j<68;j++){ x.beginPath(); x.arc(10+i*20, 10+j*20, 2, 0, Math.PI*2); x.fill(); }
x.strokeStyle = "rgba(255,255,255,.12)"; x.lineWidth = 4; x.strokeRect(60,60,W-120,H-120); x.beginPath(); x.moveTo(60,H/2); x.lineTo(W-60,H/2); x.stroke(); x.beginPath(); x.arc(W/2,H/2,150,0,Math.PI*2); x.stroke();
x.fillStyle = "#e8590c"; x.beginPath(); x.arc(W-160, 190, 22, 0, Math.PI*2); x.fill();
x.fillStyle = "#9aa7bc"; x.font = "700 30px " + F; x.fillText("今日の1人・" + d.kind, 110, 150);
x.fillStyle = "#eef2f8"; x.font = "900 64px " + F; x.fillText("4.5万分の1", 110, 232);
x.fillStyle = "#9aa7bc"; x.font = "700 34px " + F; x.fillText(d.pref + "・" + d.month + "月生まれ・" + d.pos + "・" + d.height + "cm", 110, 318);
let fs = 92; x.fillStyle = "#8ab8f0"; x.font = "900 " + fs + "px " + F; while (x.measureText(d.ending).width > W-220 && fs > 50){ fs -= 4; x.font = "900 " + fs + "px " + F; } x.fillText(d.ending, 110, 450);
x.fillStyle = "#eef2f8"; x.font = "700 38px " + F; x.fillText("一緒に始めた4.5万人のうち", 110, 560);
x.font = "900 124px " + F; x.fillText(d.top >= 90 ? "4.5万人の1人" : "上位" + d.top + "%", 100, 690);
x.font = "700 34px " + F; x.fillStyle = "#9aa7bc"; x.fillText(d.top >= 90 ? "プロでなくても、サッカーは続いていく" : "ここまで来たのは約" + d.ppl + "人", 110, 752);
x.font = "700 30px " + F; x.fillStyle = "#eef2f8"; let line = "", y = 850; for (const ch of d.route){ if (x.measureText(line + ch).width > W-220){ x.fillText(line, 110, y); y += 46; line = ""; } line += ch; } x.fillText(line, 110, y);
x.fillStyle = "#e8590c"; x.font = "700 36px " + F; x.fillText("第2章「" + d.title + "」", 110, Math.max(y + 80, 1010));
x.fillStyle = "#eef2f8"; x.font = "700 32px " + F; x.fillText("サッカー歴 " + d.career + "年", 110, Math.max(y + 130, 1060));
x.fillStyle = "#9aa7bc"; x.font = "700 28px " + F; x.fillText("あなたの人生は → soccer-selection.jp/life", 110, 1240);
</script></body></html>`;
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/opt/npm-tools/node_modules/playwright")); }
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.setContent(page); await p.waitForTimeout(300);
await p.locator("#c").screenshot({ path: path.join(outDir, `${date}.png`) });
await b.close();
console.log(path.join(outDir, `${date}.png`)); console.log(text);
