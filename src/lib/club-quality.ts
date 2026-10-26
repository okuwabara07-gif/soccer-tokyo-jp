// クラブページを検索対象（index）にするかの判定。
// clubs/[slug] の robots と sitemap の掲載条件は、必ずこの関数で揃える。
//
// 方針（AdSense「有用性の低いコンテンツ」対策）：
// - 今後の募集（開催予定 or 随時受付）がある → index
// - 公式サイトで確認したクラブ情報（月謝・練習日・練習場所・最寄駅・費用/所属の補足）が2項目以上ある → index
// - それ以外（名前と公式リンクだけ、過去の募集だけ）→ noindex（ページ自体は残す）

export type ClubProfile = {
  monthly_fee?: number | null;
  practice_days?: string | null;
  practice_ground?: string | null;
  nearest_station?: string | null;
  notes?: string | null;
};

export type SelectionDates = {
  event_date: string | null;
  event_date_end: string | null;
};

export function todayJst(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export function isActiveSelection(s: SelectionDates, today = todayJst()): boolean {
  if (!s.event_date) return true; // 随時受付
  const end = s.event_date_end || s.event_date;
  return end >= today;
}

export function profileScore(c: ClubProfile): number {
  return [
    c.monthly_fee != null && c.monthly_fee > 0,
    !!c.practice_days?.trim(),
    !!c.practice_ground?.trim(),
    !!c.nearest_station?.trim(),
    !!c.notes?.trim(),
  ].filter(Boolean).length;
}

export function isClubIndexable(c: ClubProfile, selections: SelectionDates[], today = todayJst()): boolean {
  if (selections.some((s) => isActiveSelection(s, today))) return true;
  return profileScore(c) >= 2;
}
