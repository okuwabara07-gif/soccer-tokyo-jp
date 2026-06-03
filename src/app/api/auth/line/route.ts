import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, idToken } = await req.json();
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    if (!channelId) {
      return NextResponse.json({ ok: false, error: "LINE_LOGIN_CHANNEL_ID unset" }, { status: 500 });
    }

    // 優先: access token を LINE に照合（profileスコープで必ず取得可・openid不要）
    if (accessToken) {
      const v = await fetch(`https://api.line.me/oauth2/v2.1/verify?access_token=${encodeURIComponent(accessToken)}`);
      const vd = await v.json();
      if (!v.ok || String(vd.client_id) !== String(channelId)) {
        return NextResponse.json({ ok: false, error: "access token verify failed", detail: vd }, { status: 401 });
      }
      const p = await fetch("https://api.line.me/v2/profile", { headers: { Authorization: `Bearer ${accessToken}` } });
      const pd = await p.json();
      if (!p.ok || !pd.userId) {
        return NextResponse.json({ ok: false, error: "profile fetch failed", detail: pd }, { status: 401 });
      }
      await createSession({ uid: pd.userId, name: pd.displayName });
      return NextResponse.json({ ok: true, name: pd.displayName ?? null });
    }

    // フォールバック: id token 検証
    if (idToken) {
      const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
      });
      const data = await res.json();
      if (!res.ok || !data.sub) {
        return NextResponse.json({ ok: false, error: "id token verify failed", detail: data }, { status: 401 });
      }
      await createSession({ uid: data.sub, name: data.name });
      return NextResponse.json({ ok: true, name: data.name ?? null });
    }

    return NextResponse.json({ ok: false, error: "no token" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
