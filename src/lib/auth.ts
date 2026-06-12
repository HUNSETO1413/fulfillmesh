import { cookies } from "next/headers";
import { SESSION_COOKIE, createSessionToken, verifySessionToken, type SessionPayload } from "./session";
import { users } from "./repositories";
import type { User } from "@/types";

// Server-side auth helpers (Node runtime: route handlers & server components).
// Edge middleware uses `./session` directly instead.

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return users.get(session.uid);
}

export async function startSession(user: User): Promise<void> {
  const token = await createSessionToken({ uid: user.id, email: user.email, role: user.role });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
