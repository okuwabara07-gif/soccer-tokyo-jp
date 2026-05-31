import data from "@/data/selections.json";

export type Selection = {
  id: string;
  club: string;        // クラブ名（例: ◯◯FC ジュニアユース）
  category: string;    // J1/J2/J3/JFL下部 など
  area: string;        // 開催エリア
  date: string;        // 開催日
  deadline: string;    // 締切
  target: string;      // 対象学年
  venue: string;       // 会場
  applyUrl: string;    // 公式申込URL（出典）
  source: string;      // 出典名（公式サイト等）
  premium?: boolean;   // trueなら有料限定
};

export function getSelections(): Selection[] {
  return (data.items as Selection[]) ?? [];
}
