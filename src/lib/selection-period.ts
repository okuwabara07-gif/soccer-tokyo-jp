// セレクション・練習会の開催時期の表示。
// 情報元が「6月〜7月」のように月単位でしか示していない募集は、DB上は
// 月初〜月末の日付で持っている。そのまま 06/01〜07/31 と出すと実際の開催日に
// 見えてしまうので、月単位・通年のものは月や「通年」で表示する。

function parts(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return { y, m, day };
}

function lastDay(y: number, m: number) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function isMonthRange(start: string, end: string): boolean {
  if (!start || !end) return false;
  const s = parts(start);
  const e = parts(end);
  return s.day === 1 && e.day === lastDay(e.y, e.m);
}

/** 開催時期の表示。withYear=true で年を付ける（過去の実施例用）。 */
export function formatPeriod(start: string, end: string, withYear = false): string {
  if (!start) return "随時";
  const s = parts(start);
  const y = withYear ? `${s.y}年` : "";
  if (end && isMonthRange(start, end)) {
    const e = parts(end);
    const months = (e.y - s.y) * 12 + (e.m - s.m) + 1;
    if (months >= 12) return withYear ? `${s.y}年度 通年` : "通年（随時受付）";
    if (months === 1) return `${y}${s.m}月`;
    const ey = withYear && e.y !== s.y ? `${e.y}年` : "";
    return `${y}${s.m}月〜${ey}${e.m}月`;
  }
  const md = (p: { m: number; day: number }) => `${p.m}/${p.day}`;
  if (end && end !== start) {
    const e = parts(end);
    const ey = withYear && e.y !== s.y ? `${e.y}年` : "";
    return `${y}${md(s)}〜${ey}${md(e)}`;
  }
  return `${y}${md(s)}`;
}

/** 情報元リンクとして出してよいURLか（http/https のみ）。 */
export function safeSourceUrl(u: string | null | undefined): string | null {
  if (!u) return null;
  return /^https?:\/\//i.test(u.trim()) ? u.trim() : null;
}
