import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// ★ service_role で作成(RLS有効・sw_diagnoses書込に必須)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const AGE_TO_CATEGORIES: Record<string, string[]> = {
  "未就学": ["U6", "U7", "U8"],
  "低学年": ["U9", "U10"],
  "高学年": ["U11", "U12"],
  "中学生": ["U13", "U14", "U15"],
  "女子": ["女子U12", "女子U15"],
  "高校": ["U18"],
};

const ENV_TO_TYPES: Record<string, string[]> = {
  "本格志向": ["Jリーグ系", "J下部", "クラブチーム"],
  "楽しく": ["街クラブ", "少年団"],
  "技術特化": ["スクール"],
  "フットサル": ["フットサル"],
};

async function genReason(ageGroup: string, environment: string, teams: any[]): Promise<string> {
  if (teams.length === 0) return "";
  try {
    const prompt = `関東ジュニアサッカーのチーム診断結果の紹介文を1-2文で書いてください。
条件: 年代=${ageGroup} / 環境志向=${environment}。
ルール: 「${environment}を重視するご家庭に合う」という趣旨。具体チーム名は出さない。事実に無いことを書かない。費用や「無料」に触れない。禁止語(絶対/No.1/日本一/治る/最高/保証/効果/確実/無料)を使わない。本文のみ。`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return "";
    const data = (await res.json()) as { content: Array<{ type: string; text: string }> };
    return (data.content?.find((b) => b.type === "text")?.text ?? "").trim();
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prefecture, area, ageGroup, environment, frequency } = await req.json();

    let query = supabase
      .from("teams")
      .select("id, name, prefecture, area, category, type, is_premium, is_jleague, practice_days")
      .eq("is_published", true);

    if (prefecture) query = query.eq("prefecture", prefecture); // areaは実値不一致のため使わない
    const cats = AGE_TO_CATEGORIES[ageGroup];
    if (cats) query = query.in("category", cats);
    const types = ENV_TO_TYPES[environment];
    if (types) query = query.in("type", types);

    query = query
      .order("is_premium", { ascending: false })
      .order("is_jleague", { ascending: false })
      .limit(30);

    const { data: rows, error } = await query;
    if (error) {
      console.error("teams query error:", error.message);
      return NextResponse.json({ error: "query failed" }, { status: 500 });
    }

    // 頻度は緩く(部分一致で優先度付け・0件回避のため除外はしない)
    let ranked = rows ?? [];
    if (frequency === "週3以上") {
      ranked = [...ranked].sort((a, b) => (b.practice_days?.length ?? 0) - (a.practice_days?.length ?? 0));
    }
    const teams = ranked.slice(0, 6).map((t) => ({
      id: t.id, name: t.name, prefecture: t.prefecture, area: t.area,
    }));

    const reason = await genReason(ageGroup, environment, teams);
    const share_code = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

    await supabase.from("sw_diagnoses").insert({
      share_code,
      answers: { prefecture, area, ageGroup, environment, frequency },
      result: { matched_team_ids: teams.map((t) => t.id), reason },
    });

    return NextResponse.json({ result: { teams, reason, share_code } });
  } catch (e) {
    console.error("diagnose error:", e);
    return NextResponse.json({ error: "diagnose failed" }, { status: 500 });
  }
}
