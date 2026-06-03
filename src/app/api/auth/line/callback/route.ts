import { NextRequest, NextResponse } from "next/server";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const origin = req.nextUrl.origin;
  const code = sp.get("code");
  const state = sp.get("state");
  const oauthError = sp.get("error");

  const cookieState = req.cookies.get("line_oauth_state")?.value;
  const destRaw = req.cookies.get("line_oauth_dest")?.value || "/mypage";
  const dest = destRaw.startsWith("/") ? destRaw : "/" + destRaw;

  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/auth-test?login=error&reason=${encodeURIComponent(reason)}`);

  if (oauthError) return fail(oauthError);
  if (!code || !state || !cookieState || state !== cookieState) return fail("state");

  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
  if (!channelId || !channelSecret) return fail("config");

  const redirectUri = `${origin}/api/auth/line/callback`;

  // code -> token
  const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });
  const token = await tokenRes.json();
  if (!tokenRes.ok || !token.access_token) return fail("token");

  // access_token -> profile (userId)
  const pRes = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const profile = await pRes.json();
  if (!pRes.ok || !profile.userId) return fail("profile");

  // セッションCookieをレスポンスに直接付与
  const jwt = await signSession({ uid: profile.userId, name: profile.displayName });
  const res = NextResponse.redirect(`${origin}${dest}`);
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE,
  });
  res.cookies.set("line_oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("line_oauth_dest", "", { path: "/", maxAge: 0 });
  return res;
}
