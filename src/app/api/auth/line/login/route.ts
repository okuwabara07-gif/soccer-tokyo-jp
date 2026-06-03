import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) return NextResponse.json({ error: "LINE_LOGIN_CHANNEL_ID unset" }, { status: 500 });

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/line/callback`;
  const state = crypto.randomUUID();
  const dest = req.nextUrl.searchParams.get("redirect") || "/mypage";

  const authUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", channelId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", "profile openid");

  const res = NextResponse.redirect(authUrl.toString());
  const opt = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 600 };
  res.cookies.set("line_oauth_state", state, opt);
  res.cookies.set("line_oauth_dest", dest, opt);
  return res;
}
