import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SESSION_COOKIE = "engineerOSSession";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in the environment");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export type SessionUser = {
  id: number;
  name: string;
  email: string;
};

export async function createSession(user: SessionUser) {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}
