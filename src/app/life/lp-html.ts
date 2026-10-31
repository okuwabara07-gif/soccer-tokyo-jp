// Claude Designの「4.5万分の1 LP」をそのまま載せる。文言の修正はこのファイルで行う。
export const LP_HTML = String.raw`<style>@import url("https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=JetBrains+Mono:wght@500;700;800&display=swap");

a{color:#1d5fa8}a:hover{color:#164a85}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(232,89,12,.55)}50%{box-shadow:0 0 0 14px rgba(232,89,12,0)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style><div style="background: #ffffff; color: #16202e; font-family: 'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; font-size: 16px; line-height: 1.75; width: 100%; overflow: hidden">

<header style="max-width: 1240px; margin: 0 auto; padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap">
<div style="display: flex; align-items: center; gap: 10px">
<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12.5" fill="none" stroke="#14213a" stroke-width="2"></circle><circle cx="14" cy="14" r="3" fill="#e8590c"></circle><line x1="1.5" y1="14" x2="26.5" y2="14" stroke="#14213a" stroke-width="2"></line></svg>
<span style="font-family: 'Dela Gothic One', sans-serif; font-size: 19px; letter-spacing: 0.02em; color: #14213a">4.5万分の1</span>
</div>
<nav style="display: flex; gap: 22px; flex-wrap: wrap; font-size: 14px; font-weight: 700">
<a href="#how" style="color: #4b5668; text-decoration: none">遊び方</a>
<a href="#data" style="color: #4b5668; text-decoration: none">数字の根拠</a>
<a href="#faq" style="color: #4b5668; text-decoration: none">よくある質問</a>
</nav>
</header>

<section style="max-width: 1240px; margin: 0 auto; padding: 40px 24px 80px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr)); gap: 56px; align-items: center">
<div style="display: flex; flex-direction: column; gap: 26px; min-width: 0">
<div style="display: inline-flex; align-self: flex-start; align-items: center; gap: 8px; padding: 6px 14px; border: 1px solid #dde3ea; border-radius: 999px; font-size: 13px; font-weight: 700; color: #4b5668"><span style="width: 8px; height: 8px; border-radius: 4px; background: #e8590c"></span>サッカー人生シミュレーター・無料・登録不要</div>
<h1 style="margin: 0; display: flex; flex-direction: column; gap: 6px">
<span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(76px, 13vw, 156px); line-height: 0.9; letter-spacing: -0.04em; color: #14213a">45,000</span>
<span style="font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(30px, 4.4vw, 54px); line-height: 1.15; color: #1d5fa8">分の、あなた。</span>
</h1>
<p style="margin: 0; font-size: clamp(17px, 1.8vw, 20px); line-height: 1.85; max-width: 29em; color: #3c475a">小学生でサッカー選手として登録している子は、1学年およそ4.5万人。毎年プロになるのは約180人。その中の1人として生まれ、幼稚園の年長から70歳までを5分で生きる。</p>
<div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center">
<a href="/life/play" style="display: inline-flex; align-items: center; gap: 12px; min-height: 60px; padding: 0 30px 0 34px; border-radius: 999px; background: #14213a; color: #ffffff; font-weight: 700; font-size: 18px; text-decoration: none; box-shadow: 0 10px 24px -10px rgba(20,33,58,.6)">年長の春から始める<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
<span style="font-size: 14px; color: #5a6576">所要5〜10分<br>スマホでそのまま遊べます</span>
</div>
</div>

<div style="position: relative; min-width: 0; aspect-ratio: 1 / 1; max-width: 560px; width: 100%; justify-self: center; border-radius: 28px; background-color: #14213a; background-image: radial-gradient(circle, #3b5788 1.6px, transparent 2px); background-size: 14px 14px; background-position: 7px 7px; overflow: hidden; box-shadow: 0 30px 60px -30px rgba(20,33,58,.55)">
<svg viewBox="0 0 560 560" preserveAspectRatio="none" style="position: absolute; inset: 0; width: 100%; height: 100%" aria-hidden="true"><g fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"><rect x="24" y="24" width="512" height="512" rx="4"></rect><line x1="24" y1="280" x2="536" y2="280"></line><circle cx="280" cy="280" r="74"></circle><rect x="160" y="24" width="240" height="96"></rect><rect x="160" y="440" width="240" height="96"></rect></g></svg>
<div style="position: absolute; left: 63%; top: 34%; width: 16px; height: 16px; border-radius: 8px; background: #e8590c; border: 3px solid #ffffff; animation: pulse 2.4s ease-in-out infinite"></div>
<div style="position: absolute; right: calc(37% + 14px); top: calc(34% - 8px); background: #ffffff; color: #14213a; border-radius: 10px; padding: 6px 12px; font-size: 13px; font-weight: 700; line-height: 1.4; box-shadow: 0 8px 20px -8px rgba(0,0,0,.4)">あなた<br><span style="font-weight: 500; color: #5a6576; font-size: 12px">4.5万人のうちの1人</span></div>
<div style="position: absolute; left: 24px; right: 24px; bottom: 22px; display: flex; justify-content: space-between; align-items: end; gap: 12px; flex-wrap: wrap">
<span style="color: #c9d4e6; font-size: 12px; line-height: 1.5">点の一つひとつが、同じ学年でボールを蹴る子どもたち</span>
<span style="font-family: 'JetBrains Mono', monospace; color: #ffffff; font-size: 12px; font-weight: 700; background: rgba(255,255,255,.12); padding: 4px 10px; border-radius: 6px">JFA 2025</span>
</div>
</div>
</section>

<div style="background: #14213a; color: #ffffff; overflow: hidden; padding: 16px 0" aria-label="プレイ結果の例">
<div style="display: flex; gap: 14px; width: max-content; animation: drift 40s linear infinite">
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">北海道・6月生まれ → 高校で卒業</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">東京都・2月生まれ → 大学で卒業</span>
<span style="white-space: nowrap; padding: 6px 16px; border-radius: 999px; font-size: 14px; background: #e8590c; font-weight: 700">静岡県・4月生まれ → J1でプロ9年</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">大阪府・11月生まれ → 中学で卒業</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">福岡県・5月生まれ → JFL・地域リーグでプレー</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">宮城県・8月生まれ → 高校で卒業</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">北海道・6月生まれ → 高校で卒業</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">東京都・2月生まれ → 大学で卒業</span>
<span style="white-space: nowrap; padding: 6px 16px; border-radius: 999px; font-size: 14px; background: #e8590c; font-weight: 700">静岡県・4月生まれ → J1でプロ9年</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">大阪府・11月生まれ → 中学で卒業</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">福岡県・5月生まれ → JFL・地域リーグでプレー</span>
<span style="white-space: nowrap; padding: 6px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; font-size: 14px">宮城県・8月生まれ → 高校で卒業</span>
</div>
</div>

<section style="max-width: 1240px; margin: 0 auto; padding: 96px 24px 88px; display: flex; flex-direction: column; gap: 44px">
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 24px 56px; align-items: end">
<h2 style="margin: 0; font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(32px, 4.2vw, 52px); line-height: 1.2; color: #14213a; text-wrap: balance">同じ学年の仲間は、<br>こうして減っていく。</h2>
<p style="margin: 0; color: #4b5668; max-width: 30em">中学生が多いのは、部活のJFA登録が加わるため。高校で約3割が登録をやめ、プロになるのは小学生登録の約0.4%です。</p>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 16px; align-items: end">
<div style="display: flex; flex-direction: column; gap: 10px; border-top: 2px solid #14213a; padding-top: 14px"><span style="font-size: 13px; font-weight: 700; color: #5a6576">小学生</span><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 34px; line-height: 1; color: #14213a">45,000</span><div style="height: 150px; display: flex; align-items: flex-end"><div style="width: 100%; height: 63%; background: #c9d8ee; border-radius: 6px 6px 0 0"></div></div></div>
<div style="display: flex; flex-direction: column; gap: 10px; border-top: 2px solid #14213a; padding-top: 14px"><span style="font-size: 13px; font-weight: 700; color: #5a6576">中学生</span><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 34px; line-height: 1; color: #14213a">72,000</span><div style="height: 150px; display: flex; align-items: flex-end"><div style="width: 100%; height: 100%; background: #c9d8ee; border-radius: 6px 6px 0 0"></div></div></div>
<div style="display: flex; flex-direction: column; gap: 10px; border-top: 2px solid #14213a; padding-top: 14px"><span style="font-size: 13px; font-weight: 700; color: #5a6576">高校生</span><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 34px; line-height: 1; color: #14213a">50,000</span><div style="height: 150px; display: flex; align-items: flex-end"><div style="width: 100%; height: 69%; background: #c9d8ee; border-radius: 6px 6px 0 0"></div></div></div>
<div style="display: flex; flex-direction: column; gap: 10px; border-top: 2px solid #14213a; padding-top: 14px"><span style="font-size: 13px; font-weight: 700; color: #5a6576">大学で続ける</span><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 34px; line-height: 1; color: #14213a">7,400</span><div style="height: 150px; display: flex; align-items: flex-end"><div style="width: 100%; height: 10%; background: #c9d8ee; border-radius: 6px 6px 0 0"></div></div></div>
<div style="display: flex; flex-direction: column; gap: 10px; border-top: 2px solid #e8590c; padding-top: 14px"><span style="font-size: 13px; font-weight: 700; color: #c2410c">プロ</span><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 34px; line-height: 1; color: #c2410c">約180</span><div style="height: 150px; display: flex; align-items: flex-end"><div style="width: 100%; height: 4px; background: #e8590c; border-radius: 2px"></div></div></div>
</div>
<p style="margin: 0; font-size: 12px; color: #5a6576">小〜高：JFA サッカー選手登録数2025年度を1学年あたりに換算。大学：ゲーム内の再現値。プロ：Jリーグの毎年の新人数。</p>
</section>

<section id="how" style="background: #eef3fa">
<div style="max-width: 1240px; margin: 0 auto; padding: 96px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr)); gap: 64px; align-items: center">
<div style="display: flex; flex-direction: column; gap: 24px; min-width: 0">
<div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: 0.14em; color: #1d5fa8; font-weight: 700">HOW TO PLAY</div>
<h2 style="margin: 0; font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(32px, 4.2vw, 52px); line-height: 1.2; color: #14213a; text-wrap: balance">生まれる県も、誕生月も、家庭も選べない。</h2>
<p style="margin: 0; font-size: 17px; color: #3c475a; max-width: 31em">47都道府県のどこかに、実際の登録者数の比率で生まれる。そこから1年ずつ人生が進み、セレクション、ケガ、監督の交代、進路の岐路が訪れる。選べるのは、そのとき目の前にある道だけ。</p>
<ol style="margin: 8px 0 0; padding: 0; list-style: none; display: grid; gap: 0; border-left: 2px solid #c9d8ee">
<li style="position: relative; padding: 0 0 22px 28px"><span style="position: absolute; left: -9px; top: 6px; width: 16px; height: 16px; border-radius: 8px; background: #ffffff; border: 3px solid #1d5fa8; box-sizing: border-box"></span><b style="display: block; color: #14213a">誕生</b><span style="color: #4b5668">都道府県・生まれ月・家庭・体の成長タイプが決まる</span></li>
<li style="position: relative; padding: 0 0 22px 28px"><span style="position: absolute; left: -9px; top: 6px; width: 16px; height: 16px; border-radius: 8px; background: #ffffff; border: 3px solid #1d5fa8; box-sizing: border-box"></span><b style="display: block; color: #14213a">1年ずつ進む</b><span style="color: #4b5668">身長、トレセン、ケガ、親の負担が毎年積み上がる</span></li>
<li style="position: relative; padding: 0 0 22px 28px"><span style="position: absolute; left: -9px; top: 6px; width: 16px; height: 16px; border-radius: 8px; background: #ffffff; border: 3px solid #1d5fa8; box-sizing: border-box"></span><b style="display: block; color: #14213a">岐路で選ぶ</b><span style="color: #4b5668">少年団か街クラブか、Jクラブを受けるか、高校はどこか、プロか大学か</span></li>
<li style="position: relative; padding: 0 0 0 28px"><span style="position: absolute; left: -9px; top: 6px; width: 16px; height: 16px; border-radius: 8px; background: #e8590c; border: 3px solid #e8590c; box-sizing: border-box"></span><b style="display: block; color: #14213a">結末と6人の比較</b><span style="color: #4b5668">同じチームで始めた5人の人生と並べて見る</span></li>
</ol>
</div>

<div style="justify-self: center; width: min(100%, 390px); background: #14213a; border-radius: 44px; padding: 12px; box-shadow: 0 40px 80px -40px rgba(20,33,58,.7)">
<div style="background: #ffffff; border-radius: 34px; overflow: hidden">
<div style="background: #14213a; color: #eef2f8; padding: 18px 20px 14px; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center">
<span style="font-family: 'Dela Gothic One', sans-serif; font-size: 26px; line-height: 1">中2</span>
<span style="line-height: 1.3"><b style="font-size: 14px">街クラブJY</b><br><span style="font-size: 11px; color: #9aa7bc">静岡県・2月生まれ・MF</span></span>
<span style="text-align: right; line-height: 1.2"><b style="font-family: 'JetBrains Mono', monospace; font-size: 17px">72,000</b><br><span style="font-size: 10px; color: #9aa7bc">同学年の登録選手</span></span>
<span style="grid-column: 1 / -1; display: flex; gap: 14px; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,.14); padding-top: 8px; font-size: 11px; color: #9aa7bc">身長 <b style="color: #ffffff; font-family: 'JetBrains Mono', monospace">151cm</b>　同期 <b style="color: #ffffff; font-family: 'JetBrains Mono', monospace">4/5人</b>　費用 <b style="color: #ffffff; font-family: 'JetBrains Mono', monospace">142.6万円</b></span>
</div>
<div style="padding: 6px 18px 18px; display: flex; flex-direction: column; font-size: 14px">
<div style="display: grid; grid-template-columns: 38px minmax(0, 1fr); gap: 8px; padding: 10px 0; border-bottom: 1px dashed #dde3ea"><span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #5a6576">小4</span><span>JクラブU-12のセレクションは不合格。悔しくて帰りの車で泣いた。<span style="display: inline-block; margin-left: 4px; font-size: 11px; padding: 0 7px; border-radius: 999px; background: #e6eef8; color: #3d4b60">合格率 約3%</span></span></div>
<div style="display: grid; grid-template-columns: 38px minmax(0, 1fr); gap: 8px; padding: 10px 0; border-bottom: 1px dashed #dde3ea"><span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #5a6576">中1</span><span>身長151.2cm。全国平均より9.9cm低い。<span style="display: inline-block; margin-left: 4px; font-size: 11px; padding: 0 7px; border-radius: 999px; background: #e6eef8; color: #3d4b60">学校保健統計</span></span></div>
<div style="display: grid; grid-template-columns: 38px minmax(0, 1fr); gap: 8px; padding: 10px 0; border-bottom: 1px dashed #dde3ea"><span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #5a6576">中2</span><span style="color: #1d5fa8; font-weight: 700">都道府県トレセンに選ばれた。<span style="display: inline-block; margin-left: 4px; font-size: 11px; padding: 0 7px; border-radius: 999px; background: #e6eef8; color: #3d4b60; font-weight: 500">同学年の約7%</span></span></div>
<div style="margin-top: 12px; border: 2px solid #1d5fa8; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 8px">
<b style="font-size: 15px; color: #14213a">中3の秋。高校年代の進路は？</b>
<span style="display: block; background: #e6eef8; border-radius: 10px; padding: 9px 12px"><b>JクラブU-18のセレクション</b><br><span style="font-size: 12px; color: #5a6576">狭き門</span></span>
<span style="display: block; background: #e6eef8; border-radius: 10px; padding: 9px 12px"><b>全国常連の強豪校へ</b><br><span style="font-size: 12px; color: #5a6576">寮生活・月6万円前後</span></span>
<span style="display: block; background: #e6eef8; border-radius: 10px; padding: 9px 12px"><b>地元の高校のサッカー部</b><br><span style="font-size: 12px; color: #5a6576">通学も費用も軽い</span></span>
</div>
</div>
</div>
</div>
</div>
</section>

<section style="max-width: 1240px; margin: 0 auto; padding: 96px 24px; display: flex; flex-direction: column; gap: 44px">
<div style="display: flex; flex-direction: column; gap: 14px; max-width: 780px">
<div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: 0.14em; color: #1d5fa8; font-weight: 700">WHAT YOU LEARN</div>
<h2 style="margin: 0; font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(32px, 4.2vw, 52px); line-height: 1.2; color: #14213a; text-wrap: balance">才能だけでは決まらない、6つの現実。</h2>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: 20px">
<div style="border: 1px solid #dde3ea; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 14px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><b style="font-size: 20px; color: #14213a">生まれ月</b><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 28px; color: #1d5fa8">32.8%</span></div><span style="color: #4b5668; font-size: 15px">Jリーガーの4〜6月生まれの割合。1〜3月生まれは14.6%。ゲームでも同じ偏りが出る。</span></div>
<div style="border: 1px solid #dde3ea; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 14px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><b style="font-size: 20px; color: #14213a">身長と成長期</b><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 28px; color: #1d5fa8">161.1cm</span></div><span style="color: #4b5668; font-size: 15px">13歳男子の全国平均。毎年の身長を平均と比べて表示し、早熟か晩熟かで中学の評価が変わる。</span></div>
<div style="border: 1px solid #dde3ea; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 14px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><b style="font-size: 20px; color: #14213a">住んでいる県</b><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 28px; color: #1d5fa8">47</span></div><span style="color: #4b5668; font-size: 15px">都道府県ごとの登録者数で生まれる場所が決まり、1チームあたりの人数や地域リーグ名も変わる。</span></div>
<div style="border: 1px solid #dde3ea; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 14px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><b style="font-size: 20px; color: #14213a">親の負担</b><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 28px; color: #1d5fa8">18歳</span></div><span style="color: #4b5668; font-size: 15px">月謝、遠征費、当番、送迎時間を18歳まで積み上げ、最後に合計で見せる。</span></div>
<div style="border: 1px solid #dde3ea; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 14px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><b style="font-size: 20px; color: #14213a">同期の5人</b><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 28px; color: #1d5fa8">6人</span></div><span style="color: #4b5668; font-size: 15px">同じチームで始めた5人の人生も同時に進む。誰が、いつ、ボールを置いたか。</span></div>
<div style="border: 1px solid #dde3ea; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 14px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><b style="font-size: 20px; color: #14213a">プロのお金</b><span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 28px; color: #1d5fa8">240万円</span></div><span style="color: #4b5668; font-size: 15px">J3の年俸下限。1年目の上限1,200万円など、2026年からの新制度で毎年の年俸を出す。</span></div>
</div>
</section>

<section id="data" style="background: #14213a; color: #eef2f8; position: relative; overflow: hidden">
<div style="position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.07) 1.4px, transparent 1.8px); background-size: 16px 16px" aria-hidden="true"></div>
<div style="position: relative; max-width: 1240px; margin: 0 auto; padding: 100px 24px; display: flex; flex-direction: column; gap: 48px">
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 24px 56px; align-items: end">
<div style="display: flex; flex-direction: column; gap: 14px">
<div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: 0.14em; color: #8ab8f0; font-weight: 700">EVIDENCE</div>
<h2 style="margin: 0; font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(32px, 4.2vw, 52px); line-height: 1.2; text-wrap: balance">16万回遊ばせて、<br>本物の統計と照合した。</h2>
</div>
<p style="margin: 0; color: #c9d4e6; max-width: 30em">ゲームを16万回自動でプレイさせ、結果がJリーグやJFAの公開データと一致するまで確率を調整しています。主要な指標はすべて実績の±3ポイント以内です。</p>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px">
<div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px"><span style="font-size: 14px; font-weight: 700">毎年の新人プロ</span><div style="display: flex; gap: 18px; align-items: baseline; flex-wrap: wrap"><span><span style="display: block; font-size: 11px; color: #9aa7bc">ゲーム</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px; color: #8ab8f0">177</b></span><span><span style="display: block; font-size: 11px; color: #9aa7bc">実績</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px">180</b></span></div><span style="font-size: 12px; color: #9aa7bc">人／1学年</span></div>
<div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px"><span style="font-size: 14px; font-weight: 700">大卒でプロ</span><div style="display: flex; gap: 18px; align-items: baseline; flex-wrap: wrap"><span><span style="display: block; font-size: 11px; color: #9aa7bc">ゲーム</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px; color: #8ab8f0">55%</b></span><span><span style="display: block; font-size: 11px; color: #9aa7bc">実績</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px">52%</b></span></div><span style="font-size: 12px; color: #9aa7bc">新人プロに占める割合</span></div>
<div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px"><span style="font-size: 14px; font-weight: 700">4〜6月生まれ</span><div style="display: flex; gap: 18px; align-items: baseline; flex-wrap: wrap"><span><span style="display: block; font-size: 11px; color: #9aa7bc">ゲーム</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px; color: #8ab8f0">35%</b></span><span><span style="display: block; font-size: 11px; color: #9aa7bc">実績</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px">32.8%</b></span></div><span style="font-size: 12px; color: #9aa7bc">プロに占める割合</span></div>
<div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px"><span style="font-size: 14px; font-weight: 700">1〜3月生まれ</span><div style="display: flex; gap: 18px; align-items: baseline; flex-wrap: wrap"><span><span style="display: block; font-size: 11px; color: #9aa7bc">ゲーム</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px; color: #8ab8f0">15%</b></span><span><span style="display: block; font-size: 11px; color: #9aa7bc">実績</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px">14.6%</b></span></div><span style="font-size: 12px; color: #9aa7bc">プロに占める割合</span></div>
<div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px"><span style="font-size: 14px; font-weight: 700">平均引退年齢</span><div style="display: flex; gap: 18px; align-items: baseline; flex-wrap: wrap"><span><span style="display: block; font-size: 11px; color: #9aa7bc">ゲーム</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px; color: #8ab8f0">26.7</b></span><span><span style="display: block; font-size: 11px; color: #9aa7bc">実績</span><b style="font-family: 'JetBrains Mono', monospace; font-size: 30px">26.0</b></span></div><span style="font-size: 12px; color: #9aa7bc">歳</span></div>
</div>
<p style="margin: 0; font-size: 12px; color: #9aa7bc; max-width: 70em">出典：JFA サッカー選手登録数2025年度／Jリーグ新人研修参加者の出身内訳／2020年Jリーガー1,606人の生まれ月／日本プロサッカー選手会／文部科学省 学校保健統計調査 令和6年度／Jリーグ選手契約制度の改定</p>
</div>
</section>

<section style="max-width: 1240px; margin: 0 auto; padding: 100px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); gap: 64px; align-items: center">
<div style="position: relative; justify-self: center; width: min(100%, 380px); aspect-ratio: 4 / 5">
<div style="position: absolute; inset: 0; transform: rotate(-6deg) translate(-18px, 10px); background: #eef3fa; border: 1px solid #dde3ea; border-radius: 22px" aria-hidden="true"></div>
<div style="position: absolute; inset: 0; transform: rotate(2.5deg); background: #14213a; color: #eef2f8; border-radius: 22px; padding: 30px; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; overflow: hidden; box-shadow: 0 30px 60px -28px rgba(20,33,58,.7)">
<div style="position: absolute; inset: 14px; border: 2px solid rgba(255,255,255,.09); border-radius: 10px" aria-hidden="true"></div>
<span style="font-size: 12px; color: #9aa7bc; font-weight: 700">サッカー人生シミュレーター</span>
<span style="font-family: 'Dela Gothic One', sans-serif; font-size: 21px">4.5万分の1</span>
<span style="font-size: 12px; color: #9aa7bc">福岡県・5月生まれ・DF・178cm</span>
<span style="font-family: 'Dela Gothic One', sans-serif; font-size: 32px; color: #8ab8f0; line-height: 1.2; margin-top: 8px">J2でプロ6年</span>
<span style="font-size: 13px; font-weight: 700">同学年4.5万人のうち</span>
<span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 42px; line-height: 1">上位0.31%</span>
<span style="font-size: 12px; color: #9aa7bc">ここまで来たのは約140人</span>
<span style="font-size: 12px; color: #9aa7bc; margin-top: auto">親が払ったもの（18歳まで）</span>
<span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 24px">312.4万円</span>
<span style="font-size: 12px">当番 96回・送迎 2,880時間</span>
</div>
</div>
<div style="display: flex; flex-direction: column; gap: 20px; min-width: 0">
<div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: 0.14em; color: #1d5fa8; font-weight: 700">RESULT CARD</div>
<h2 style="margin: 0; font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(32px, 4.2vw, 52px); line-height: 1.2; color: #14213a; text-wrap: balance">その人生を、1枚で残す。</h2>
<p style="margin: 0; font-size: 17px; color: #3c475a; max-width: 30em">到達点と同学年での位置、親が払った費用と当番の回数を1枚にまとめます。画像を保存して、チームの保護者LINEやSNSにそのまま貼れます。</p>
<p style="margin: 0; font-size: 13px; color: #5a6576">左はカードの見本です。数字はプレイごとに変わります。</p>
</div>
</section>

<section id="faq" style="background: #eef3fa">
<div style="max-width: 900px; margin: 0 auto; padding: 96px 24px; display: flex; flex-direction: column; gap: 32px">
<h2 style="margin: 0; font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(30px, 4vw, 46px); line-height: 1.2; color: #14213a">よくある質問</h2>
<div style="display: flex; flex-direction: column; gap: 12px">
<div style="background: #ffffff; border-radius: 16px; padding: 22px 24px; display: grid; gap: 6px"><b style="font-size: 17px; color: #14213a">お金はかかりますか？</b><span style="color: #3c475a">無料です。会員登録もいりません。</span></div>
<div style="background: #ffffff; border-radius: 16px; padding: 22px 24px; display: grid; gap: 6px"><b style="font-size: 17px; color: #14213a">実在のチームや選手は出てきますか？</b><span style="color: #3c475a">出てきません。チームは「JクラブU-15」「強豪校」のような種類で表し、人物はすべて架空です。</span></div>
<div style="background: #ffffff; border-radius: 16px; padding: 22px 24px; display: grid; gap: 6px"><b style="font-size: 17px; color: #14213a">どこまで本当の数字ですか？</b><span style="color: #3c475a">登録者数、身長、生まれ月の偏り、プロ入りの人数と経路、引退年齢、年俸の上限と下限は公開統計です。親の負担額、ケガの起きやすさ、トレセンの選出率、年俸の中央値は想定値で、今後実データに置き換えます。</span></div>
<div style="background: #ffffff; border-radius: 16px; padding: 22px 24px; display: grid; gap: 6px"><b style="font-size: 17px; color: #14213a">女子のバージョンはありますか？</b><span style="color: #3c475a">いまは男子のみです。女子版は準備しています。</span></div>
<div style="background: #ffffff; border-radius: 16px; padding: 22px 24px; display: grid; gap: 6px"><b style="font-size: 17px; color: #14213a">子どもと一緒に遊べますか？</b><span style="color: #3c475a">小学生でも読める表現で作っています。進路を考え始めた親子で遊ぶのがおすすめです。</span></div>
</div>
</div>
</section>

<section style="max-width: 1240px; margin: 0 auto; padding: 110px 24px; display: flex; flex-direction: column; align-items: center; gap: 28px; text-align: center">
<span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(48px, 8vw, 96px); line-height: 1; letter-spacing: -0.04em; color: #dde3ea" aria-hidden="true">45,000</span>
<h2 style="margin: 0; font-family: 'Dela Gothic One', sans-serif; font-weight: 400; font-size: clamp(32px, 5vw, 58px); line-height: 1.25; color: #14213a; text-wrap: balance">あなたは、どこまで<br>行けるか。</h2>
<a href="/life/play" style="display: inline-flex; align-items: center; gap: 12px; min-height: 60px; padding: 0 30px 0 34px; border-radius: 999px; background: #1d5fa8; color: #ffffff; font-weight: 700; font-size: 18px; text-decoration: none; box-shadow: 0 10px 24px -10px rgba(29,95,168,.7)">年長の春から始める<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
<p style="margin: 0; font-size: 15px; color: #4b5668">本物のセレクション情報は <a href="/selection">サッカーセレクション</a> で地域・年代別にまとめています。</p>
</section>

<footer style="background: #14213a; color: #9aa7bc">
<div style="max-width: 1240px; margin: 0 auto; padding: 28px 24px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-size: 13px">
<span><b style="font-family: 'Dela Gothic One', sans-serif; font-weight: 400; color: #ffffff">4.5万分の1</b>　soccer-selection.jp</span>
<span>運営：AOKAE合同会社</span>
</div>
</footer>

</div>`;
