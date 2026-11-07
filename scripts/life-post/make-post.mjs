// サッカー人生シミュレーター「4.5万分の1」の毎日の投稿を作る。
// 使い方: node scripts/life-post/make-post.mjs 2026-11-02 [出力フォルダ]
// 出力: <日付>.png（1080x1350の結果カード）、<日付>.jpg（Instagram用。同じ絵をJPEGで）、<日付>.txt（X用投稿文）、<日付>.ig.txt（Instagram用キャプション）
// 水曜と土曜は女子版の人生を選ぶ。
// 画像の描画には playwright（chromium）を使う。ゲームのエンジンは public/life/play.html から読み込むので、ゲームと同じ確率で人生が決まる。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const date = process.argv[2] || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const outDir = process.argv[3] || "life-posts";
fs.mkdirSync(outDir, { recursive: true });

const html = fs.readFileSync(new URL("../../public/life/play.html", import.meta.url), "utf8");
const engine = [...html.matchAll(/<script>\s*([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => /function autoPlay/.test(s));
const ctx = {}; vm.createContext(ctx);
vm.runInContext(engine + "\n;globalThis.__E = { autoPlay, PREFS };", ctx);
// ゲーム画面と同じ「上位◯%」の表（男子・女子それぞれ16万回の自動プレイで測った値）
const grab = name => JSON.parse(html.match(new RegExp("const " + name + " = (\\[[^\\]]*\\]);"))[1]);
const TOP_B = grab("TOP_B"), TOP_G = grab("TOP_GL");
const { autoPlay } = ctx.__E;

// 曜日ごとに見せたい人生のタイプを変える（同じ結末が続かないように）
const T2 = st => (st.after && st.after.title) || "";
const KINDS_G = [
  ["女子・プロになった1人", st => !!st.pro],
  ["女子・12歳の壁を越えた", st => st.level >= 3 && st.career.some(c => /女子のクラブ|アカデミーU-15|男子にまじって/.test(c.team))],
  ["女子・なでしこリーグへ", st => st.level === 5],
  ["女子・子どもに教える側へ", st => /指導者|教えたコーチ/.test(T2(st)) && !st.pro],
  ["女子・何歳からでも戻れる", st => T2(st) === "何歳からでも戻ってきた人"],
  ["女子・当番をする側へ", st => T2(st) === "当番をする側になった元サッカー少女"],
  ["女子・70歳でもボールを蹴る", st => T2(st) === "70歳でもボールを蹴る人"],
];
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
const wd = day.getUTCDay(), girl = wd === 3 || wd === 6;
const [kindName, test] = (girl ? KINDS_G : KINDS)[girl ? (Math.floor(day.getTime() / 864e5 / 7) % KINDS_G.length) : wd];
const base = Number(date.replaceAll("-", "")) * 1000;
let r = null, seed = 0;
for (let k = 0; k < 200000; k++) { seed = base + k; const x = autoPlay(seed, { girl }); if (test(x.st)) { r = x; break; } }
if (!r) { seed = base; r = autoPlay(seed, { girl }); }
const st = r.st;
const COH = girl ? 3400 : 45000, COHL = girl ? "約3,400人" : "4.5万人", BRAND = girl ? "3,400分の1" : "4.5万分の1", HASH = girl ? `g${seed}` : `s${seed}`;

const TOP = girl ? TOP_G : TOP_B;
const top0 = TOP[st.level]; const top = top0 >= 10 ? Math.round(top0) : top0;
const path_ = [...new Set(st.career.map(c => c.team))].filter(t => !/幼稚園|キッズ|公園/.test(t));
const proName = st.pro ? (st.pro.best === "WE" ? "WEリーグ" : st.pro.best) : "";
const route = (st.pro ? [...path_, `${proName}で${st.pro.years}年`] : [...path_, st.ending]).join("→");
const title = st.after ? st.after.title : "";
const who = `${st.pref}・${st.month}月生まれの${girl ? "女の子・" : ""}${st.pos || ""}`;
const rank = top0 >= 90 ? `同学年${COHL}の1人として、ボールを蹴った。` : `同学年${COHL}のうち上位${top}%。`;
let text = `【今日の1人${girl ? "・女子版" : ""}】${who}\n${route}\n第2章「${title}」\n${rank}\nあなたの人生は→ https://soccer-selection.jp/life/play?utm_source=x&utm_medium=daily#${HASH}\n#少年サッカー #${girl ? "女子サッカー" : "サッカー人生"}`;
// 長すぎるときは経路を短くする（Xは全角140字が目安。URLは23字として数える）
const weight = s => [...s.replace(/https?:\/\/\S+/g, "x".repeat(23))].reduce((a, c) => a + (/[ -~]/.test(c) ? 1 : 2), 0);
if (weight(text) > 280) text = text.replace(route + "\n", `${path_[0]}→…→${st.pro ? proName + "で" + st.pro.years + "年" : st.ending}\n`);
fs.writeFileSync(path.join(outDir, `${date}.txt`), `${text}\n\n[タイプ] ${kindName}\n[seed] ${seed}\n`);
// Instagram：本文のリンクは押せないので、プロフィールのリンクへ誘導する。ハッシュタグは多め（上限30）
const tags = girl
  ? "#女子サッカー #少女サッカー #なでしこ #WEリーグ #サッカー女子 #サッカーママ #サッカーパパ #少年サッカー #ジュニアサッカー #サッカー人生 #サッカーセレクション"
  : "#少年サッカー #ジュニアサッカー #ジュニアユース #サッカー少年 #サッカーママ #サッカーパパ #セレクション #サッカー人生 #Jリーグ #サッカーセレクション";
const ig = `【今日の1人${girl ? "・女子版" : ""}】${who}\n\n${route}\n\n第2章「${title}」\n${rank}\n\n${girl ? "中学に上がるとき、女子は近くにチームがない「12歳の壁」がある。" : "プロになるのは1学年で約180人。"}それでも、サッカーは何歳になっても続けられる。\n\nあなたや、お子さんの条件で生きてみる無料シミュレーターは、プロフィールのリンクから（soccer-selection.jp/life）\n\n${tags}`;
fs.writeFileSync(path.join(outDir, `${date}.ig.txt`), ig);

// 結果カード（ゲームの結果カードと同じデザイン）
const card = { pref: st.pref, month: st.month, pos: st.pos || "", height: Math.round(st.height || 0), ending: st.ending, top, ppl: Math.max(1, Math.round(COH * top0 / 100)).toLocaleString("ja-JP"), title, career: st.after ? st.after.career : 0, route, kind: kindName, brand: BRAND, cohl: COHL, girl };
const page = `<html><body style="margin:0"><canvas id="c" width="1080" height="1350"></canvas><script>
const d = ${JSON.stringify(card)}; const c = document.getElementById("c"), x = c.getContext("2d"), W = 1080, H = 1350, F = "'Noto Sans CJK JP','Noto Sans JP',sans-serif";
x.fillStyle = "#14213a"; x.fillRect(0,0,W,H);
x.fillStyle = "rgba(255,255,255,.05)"; for (let i=0;i<54;i++) for (let j=0;j<68;j++){ x.beginPath(); x.arc(10+i*20, 10+j*20, 2, 0, Math.PI*2); x.fill(); }
x.strokeStyle = "rgba(255,255,255,.12)"; x.lineWidth = 4; x.strokeRect(60,60,W-120,H-120); x.beginPath(); x.moveTo(60,H/2); x.lineTo(W-60,H/2); x.stroke(); x.beginPath(); x.arc(W/2,H/2,150,0,Math.PI*2); x.stroke();
x.fillStyle = "#e8590c"; x.beginPath(); x.arc(W-160, 190, 22, 0, Math.PI*2); x.fill();
x.fillStyle = "#9aa7bc"; x.font = "700 30px " + F; x.fillText("今日の1人・" + d.kind, 110, 150);
x.fillStyle = "#eef2f8"; x.font = "900 64px " + F; x.fillText(d.brand, 110, 232); if (d.girl){ const w = x.measureText(d.brand).width; x.fillStyle = "#e8590c"; x.font = "700 34px " + F; x.fillText("女子版", 130 + w, 228); }
x.fillStyle = "#9aa7bc"; x.font = "700 34px " + F; x.fillText(d.pref + "・" + d.month + "月生まれ・" + d.pos + "・" + d.height + "cm", 110, 318);
let fs = 92; x.fillStyle = "#8ab8f0"; x.font = "900 " + fs + "px " + F; while (x.measureText(d.ending).width > W-220 && fs > 50){ fs -= 4; x.font = "900 " + fs + "px " + F; } x.fillText(d.ending, 110, 450);
x.fillStyle = "#eef2f8"; x.font = "700 38px " + F; x.fillText("一緒に始めた" + d.cohl + "のうち", 110, 560);
x.font = "900 124px " + F; x.fillText(d.top >= 90 ? d.cohl.replace("約","") + "の1人" : "上位" + d.top + "%", 100, 690);
x.font = "700 34px " + F; x.fillStyle = "#9aa7bc"; x.fillText(d.top >= 90 ? "プロでなくても、サッカーは続いていく" : "ここまで来たのは約" + d.ppl + "人", 110, 752);
x.font = "700 30px " + F; x.fillStyle = "#eef2f8"; let line = "", y = 850; for (const ch of d.route){ if (x.measureText(line + ch).width > W-220){ x.fillText(line, 110, y); y += 46; line = ""; } line += ch; } x.fillText(line, 110, y);
x.fillStyle = "#e8590c"; x.font = "700 36px " + F; x.fillText("第2章「" + d.title + "」", 110, Math.max(y + 80, 1010));
x.fillStyle = "#eef2f8"; x.font = "700 32px " + F; x.fillText("サッカー歴 " + d.career + "年", 110, Math.max(y + 130, 1060));
x.fillStyle = "#9aa7bc"; x.font = "700 28px " + F; x.fillText("あなたの人生は → soccer-selection.jp/life", 110, 1240);
</script></body></html>`;
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(process.env.PW_MODULE || "/opt/npm-tools/node_modules/playwright")); }
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.setContent(page); await p.waitForTimeout(300);
await p.locator("#c").screenshot({ path: path.join(outDir, `${date}.png`) });
await p.locator("#c").screenshot({ path: path.join(outDir, `${date}.jpg`), type: "jpeg", quality: 90 });
await b.close();
console.log(path.join(outDir, `${date}.png`)); console.log(text);
