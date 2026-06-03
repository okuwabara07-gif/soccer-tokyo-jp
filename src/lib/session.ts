import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "kf_sess";
const MAX_AGE = 60 * 60 * 24 * 30; // 30日

function secret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "dev-insecure-secret-change-me"
  );
}

export type Session = { uid: string; name?: string };

// Route Handler / Server Action からのみ呼ぶ（Cookieを書く）
export async function createSession(s: Session) {
  const token = await new SignJWT({ uid: s.uid, name: s.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

// Server Component / Route Handler どちらからでも読める
export async function getSession(): Promise<Session | null> {
  try {
    const jar = await cookies();
    const t = jar.get(COOKIE)?.value;
    if (!t) return null;
    const { payload } = await jwtVerify(t, secret());
    return { uid: String(payload.uid), name: payload.name as string | undefined };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
