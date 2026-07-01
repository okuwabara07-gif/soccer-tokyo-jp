#!/usr/bin/env python3
# Phase 3a: 有料データのサーバー保護。
#  - /api/selection : 会員/トライアルをサーバー判定し、非会員には先頭3件だけ返す（隠し行は送らない）
#  - /api/team      : team詳細の有料フィールド(apply_url/website/SNS/日程)を非会員にはnullで返す
#  - selection/page.tsx, teams/[id]/page.tsx を上記API経由に置換
# 使い方: リポジトリ直下で  python3 phase3a_setup.py  → npm run build
import pathlib
ROOT = pathlib.Path.cwd()
FILES = {}

FILES["src/app/api/selection/route.ts"] = r'''import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { getMembership } from "@/lib/membership";

const FREE_LIMIT = 3;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const pref = sp.get("pref") || "すべて";
  const jleague = sp.get("jleague") === "1";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const sb = createClient(url, key, { auth: { persistSession: false } });

  let q = sb
    .from("teams")
    .select("id,name,category,prefecture,area,selection_start,selection_end,apply_url,is_jleague")
    .not("selection_start", "is", null)
    .order("selection_start");
  if (pref !== "すべて") q = q.eq("prefecture", pref);
  if (jleague) q = q.eq("is_jleague", true);

  const { data } = await q;
  const rows = (data as any[]) ?? [];

  const s = await getSession();
  const mem = await getMembership(s?.uid);

  // 非会員には先頭FREE_LIMIT件だけ。隠し行はクライアントに渡さない。
  const visible = mem.active ? rows : rows.slice(0, FREE_LIMIT);
  return NextResponse.json({
    visible,
    locked: rows.length - visible.length,
    total: rows.length,
    active: mem.active,
  });
}
'''

FILES["src/app/api/team/route.ts"] = r'''import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { getMembership } from "@/lib/membership";

// 非会員に渡さない有料フィールド
const PREMIUM = ["apply_url", "website", "instagram", "twitter", "facebook", "selection_start", "selection_end"];

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ team: null, has_selection: false, active: false });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const { data } = await sb.from("teams").select("*").eq("id", id).single();
  if (!data) return NextResponse.json({ team: null, has_selection: false, active: false });

  const s = await getSession();
  const mem = await getMembership(s?.uid);

  const has_selection = !!(data as any).selection_start; // 存在の有無だけは非会員にも見せる
  const team: any = { ...data };
  if (!mem.active) {
    for (const f of PREMIUM) team[f] = null; // 有料情報は物理的に渡さない
  }
  return NextResponse.json({ team, has_selection, active: mem.active });
}
'''

FILES["src/app/selection/page.tsx"] = r'''"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Sel = {
  id: string; name: string; category: string; prefecture: string; area: string;
  selection_start: string; selection_end: string; apply_url: string | null; is_jleague: boolean;
};

const PREFS = ["すべて", "東京都", "神奈川県", "埼玉県", "千葉県"];

function fmt(d: string) {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${m}/${day}`;
}

export default function SelectionPage() {
  const [visible, setVisible] = useState<Sel[]>([]);
  const [locked, setLocked] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pref, setPref] = useState("すべて");
  const [jleagueOnly, setJleagueOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ pref, jleague: jleagueOnly ? "1" : "0" });
    fetch(`/api/selection?${q.toString()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { setVisible(d.visible ?? []); setLocked(d.locked ?? 0); setTotal(d.total ?? 0); })
      .catch(() => { setVisible([]); setLocked(0); setTotal(0); })
      .finally(() => setLoading(false));
  }, [pref, jleagueOnly]);

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px", maxWidth: 820 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>セレクション情報センター</h1>
        <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "0 0 16px", lineHeight: 1.7 }}>
          関東のジュニアユース・ジュニアのセレクション開催情報。日程・会場・申込先をまとめています。合否の傾向や合格率は扱いません。
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {PREFS.map((p) => (
            <button key={p} onClick={() => setPref(p)}
              style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid var(--kf-border)", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: pref === p ? "var(--kf-primary)" : "var(--kf-surface)", color: pref === p ? "#fff" : "var(--kf-text)" }}>
              {p === "すべて" ? "全エリア" : p.replace(/[都県]/, "")}
            </button>
          ))}
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 18, cursor: "pointer" }}>
          <input type="checkbox" checked={jleagueOnly} onChange={(e) => setJleagueOnly(e.target.checked)} />
          Jリーグ下部組織のみ表示
        </label>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--kf-muted)" }}>読み込み中…</div>
        ) : total === 0 ? (
          <div className="kf-empty"><div className="kf-empty__title">該当する情報がありません</div><div className="kf-empty__hint">条件を変えてお試しください。</div></div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {visible.map((s) => (
              <div key={s.id} className="kf-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>
                    {s.name}
                    {s.is_jleague && <span className="kf-badge" style={{ marginLeft: 8, background: "var(--kf-accent)", color: "#3a2e0a" }}>Jリーグ系</span>}
                  </div>
                  <span className="kf-badge kf-badge--deadline">〜{fmt(s.selection_end)}締切</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--kf-muted)", marginTop: 8, lineHeight: 1.8 }}>
                  開催: {fmt(s.selection_start)}〜{fmt(s.selection_end)}／対象: {s.category}／{s.prefecture} {s.area}
                </div>
                <div style={{ marginTop: 10 }}>
                  {s.apply_url
                    ? <a href={s.apply_url} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--primary" style={{ padding: "8px 16px", fontSize: 13 }}>公式サイトで確認</a>
                    : <Link href={`/teams/${s.id}`} className="kf-btn kf-btn--ghost" style={{ padding: "8px 16px", fontSize: 13 }}>チーム詳細を見る</Link>}
                </div>
              </div>
            ))}

            {locked > 0 && (
              <div className="kf-card" style={{ padding: 28, textAlign: "center", background: "var(--kf-primary-soft)", border: "none" }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>続き{locked}件はプレミアム会員限定</div>
                <p style={{ fontSize: 13, color: "var(--kf-muted)", margin: "8px 0 14px" }}>関東全エリアのセレクション情報をすべて閲覧＋締切リマインドが使えます。</p>
                <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "12px 24px" }}>プレミアムを見る</Link>
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--kf-muted)", marginTop: 20, lineHeight: 1.7 }}>
          ※掲載情報は変更される場合があります。応募前に必ず各クラブ公式サイトで最新の募集要項をご確認ください。
        </p>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
'''

FILES["src/app/teams/[id]/page.tsx"] = r'''"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";

type Team = {
  id: string; name: string; category: string; area: string; prefecture: string;
  block?: string; website?: string; instagram?: string; twitter?: string; facebook?: string;
  description?: string; name_kana?: string; access?: string; practice_days?: string;
  coach_info?: string; is_jleague?: boolean; selection_start?: string; selection_end?: string;
  apply_url?: string; fee?: number; is_free?: boolean; members?: number; founded?: number;
};

export default function TeamDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/team?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { setTeam((d.team as Team) ?? null); setHasSelection(!!d.has_selection); setIsPremium(!!d.active); })
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (<div style={{ background: "var(--kf-bg)", minHeight: "100vh" }}><Header /><main className="kf-container" style={{ padding: 40 }}>読み込み中…</main></div>);
  if (!team) return (<div style={{ background: "var(--kf-bg)", minHeight: "100vh" }}><Header /><main className="kf-container" style={{ padding: 40 }}><p>チームが見つかりませんでした。</p><Link href="/teams" className="kf-btn kf-btn--ghost" style={{ padding: "10px 18px" }}>一覧に戻る</Link></main></div>);

  const Row = ({ label, value }: { label: string; value?: string | number }) =>
    value ? (<div style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid var(--kf-border)" }}><div style={{ width: 110, color: "var(--kf-muted)", fontSize: 13, flexShrink: 0 }}>{label}</div><div style={{ fontSize: 14 }}>{value}</div></div>) : null;

  return (
    <div style={{ background: "var(--kf-bg)", minHeight: "100vh", color: "var(--kf-text)" }}>
      <Header />
      <main className="kf-container" style={{ padding: "24px 16px 56px" }}>
        <Link href="/teams" style={{ fontSize: 13, color: "var(--kf-primary)", textDecoration: "none" }}>← チーム一覧</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 4px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{team.name}</h1>
          {team.is_jleague && <span className="kf-badge" style={{ background: "var(--kf-accent)", color: "#3a2e0a" }}>Jリーグ系</span>}
        </div>
        {team.name_kana && <div style={{ fontSize: 13, color: "var(--kf-muted)" }}>{team.name_kana}</div>}

        <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
          <Row label="カテゴリ" value={team.category} />
          <Row label="エリア" value={[team.prefecture, team.area, team.block].filter(Boolean).join(" ")} />
          <Row label="練習日" value={team.practice_days} />
          <Row label="アクセス" value={team.access} />
          <Row label="会費" value={team.is_free ? "無料" : team.fee ? `¥${team.fee.toLocaleString()}` : undefined} />
          <Row label="部員数" value={team.members ? `${team.members}名` : undefined} />
          <Row label="設立" value={team.founded ? `${team.founded}年` : undefined} />
          <Row label="コーチ" value={team.coach_info} />
        </div>

        {team.description && (
          <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>チーム紹介</h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>{team.description}</p>
          </div>
        )}

        {hasSelection && (
          <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>セレクション情報</h2>
            {isPremium ? (
              <>
                <Row label="開催期間" value={[team.selection_start, team.selection_end].filter(Boolean).join(" 〜 ")} />
                {team.apply_url && <a href={team.apply_url} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--primary" style={{ padding: "10px 18px", marginTop: 10, display: "inline-block" }}>公式申込ページ</a>}
              </>
            ) : (
              <div style={{ background: "var(--kf-primary-soft)", borderRadius: 10, padding: 16, textAlign: "center" }}>
                <div style={{ fontWeight: 700 }}>セレクション詳細・申込先はプレミアム会員限定</div>
                <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "10px 20px", marginTop: 10, display: "inline-block" }}>プレミアムを見る</Link>
              </div>
            )}
          </div>
        )}

        <div className="kf-card" style={{ padding: 20, marginTop: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>公式・SNS</h2>
          {isPremium ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {team.website && <a href={team.website} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>公式サイト</a>}
              {team.instagram && <a href={team.instagram} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>Instagram</a>}
              {team.twitter && <a href={team.twitter} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>X</a>}
              {team.facebook && <a href={team.facebook} target="_blank" rel="noopener noreferrer" className="kf-btn kf-btn--ghost" style={{ padding: "8px 14px", fontSize: 13 }}>Facebook</a>}
              {!team.website && !team.instagram && !team.twitter && !team.facebook && <span style={{ fontSize: 13, color: "var(--kf-muted)" }}>公式リンクは登録されていません。</span>}
            </div>
          ) : (
            <div style={{ background: "var(--kf-primary-soft)", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>公式サイト・SNSリンクはプレミアム会員限定</div>
              <Link href="/member" className="kf-btn kf-btn--pay" style={{ padding: "10px 20px", marginTop: 10, display: "inline-block" }}>プレミアムを見る</Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
'''

written = []
for rel, content in FILES.items():
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    written.append(rel)
for w in written:
    print("OK:", w)
print("OK: Phase3a files written (", len(written), "files )")
