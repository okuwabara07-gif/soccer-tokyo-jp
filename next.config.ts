import type { NextConfig } from "next";

// 2026-10 コラム統合：薄い重複記事を柱記事へ集約（旧URL → 統合先）
const mergedColumns: Record<string, string> = {
  "selection-1month-junbi": "selection-junbi-kiso",
  "selection-mochimono-fukuso": "selection-junbi-kiso",
  "selection-mikata-point": "selection-junbi-kiso",
  "selection-anxiety-parent-support": "selection-after-care",
  "selection-trial-nervousness-parents-supp": "selection-after-care",
  "serekushon-rakka-shita-ko-sasaeru-oyano-": "selection-after-care",
  "selection-sibling-support-strategy": "selection-after-care",
  "position-fw": "position-erabikata",
  "position-mf": "position-erabikata",
  "position-df": "position-erabikata",
  "attacker-parent-support": "position-erabikata",
  "defender-parent-support-tips": "position-erabikata",
  "midfielder-positioning-practice-at-home": "position-erabikata",
  "goalkeeper-development-home-support": "position-gk",
  "mental-jishin": "mental-kinchou",
  "mental-tachinaori": "mental-kinchou",
  "practice-to-match-performance-gap": "mental-kinchou",
  "practice-quit-child-parent-support": "mental-motivation",
  "soccer-practice-plateau-parent-support": "mental-motivation",
  "child-loses-starting-position-parent-sup": "mental-motivation",
  "shougai-kara-kaifuku-made-shien": "parent-kega-ishiki",
  "practice-after-match-recovery-parent-rol": "parent-kega-ishiki",
  "junior-soccer-parent-communication-with-": "parent-support-kihon",
  "trial-match-before-parent-support": "parent-support-kihon",
  "club-vs-bukatsu": "shinro-junior-youth",
  "junior-high-club-selection-parent-suppor": "shinro-junior-youth",
  "middle-school-soccer-transition-support": "shinro-junior-youth",
  "team-erabi-shiten": "shinro-junior-youth",
  "parent-shinro-nayami": "shinro-junior-youth",
  "junior-soccer-high-school-selection-prep": "high-school-soccer-transition-parent-sup",
  "lifting-jyoutatsu": "self-training-home",
  "dribble-kihon": "self-training-home",
  "trap-seido": "self-training-home",
  "kick-kihon": "self-training-home",
  "body-tsukaikata-junior": "handan-ryoku",
  "agility-kiso": "handan-ryoku",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(mergedColumns).map(([from, to]) => ({
      source: `/column/${from}`,
      destination: `/column/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
