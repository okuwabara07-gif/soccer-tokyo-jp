import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "kf_sess";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30日

function secret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "dev-insecure-secret-change-me"
  );
}

export type Session = { uid: string; name?: string };

// JWT文字列を返す（Route Handlerでレスポンスに直接Cookieを付与する用途）
export async function signSession(s: Session) {
  return await new SignJWT({ uid: s.uid, name: s.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

// cookies() 経由でCookieを書く（Server Action等）
export async function createSession(s: Session) {
  const token = await signSession(s);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  try {
    const jar = await cookies();
    const t = jar.get(SESSION_COOKIE)?.value;
    if (!t) return null;
    const { payload } = await jwtVerify(t, secret());
    return { uid: String(payload.uid), name: payload.name as string | undefined };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
