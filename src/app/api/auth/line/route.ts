import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

// クライアントから受け取った LINE idToken を LINE 側で検証し、
// 検証OKなら署名付きセッションCookieを発行する。
export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ ok: false, error: "no idToken" }, { status: 400 });
    }
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    if (!channelId) {
      return NextResponse.json({ ok: false, error: "LINE_LOGIN_CHANNEL_ID unset" }, { status: 500 });
    }
    const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
    });
    const data = await res.json();
    if (!res.ok || !data.sub) {
      return NextResponse.json(
        { ok: false, error: data.error_description || "verify failed" },
        { status: 401 }
      );
    }
    await createSession({ uid: data.sub, name: data.name });
    return NextResponse.json({ ok: true, name: data.name ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
