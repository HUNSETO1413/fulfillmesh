import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { users, authTokens } from "@/lib/repositories";

// Two modes:
//  - POST { email }  → (re)send a verification token. Generic success; dev mode
//    returns the token/URL since there is no SMTP service.
//  - POST { token }  → confirm a verification token (marks it used).
export async function POST(request: Request) {
  let body: { email?: string; token?: string };
  try {
    body = (await request.json()) as { email?: string; token?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Confirm mode.
  if (body.token) {
    const token = body.token.trim();
    const valid = await authTokens.findValid(token, "verify");
    if (!valid) {
      return NextResponse.json({ error: "This verification link is invalid or has expired" }, { status: 400 });
    }
    await authTokens.markUsed(token);
    return NextResponse.json({ ok: true, verified: true });
  }

  // Resend mode.
  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  const user = await users.findByEmail(email);
  const payload: { ok: true; devToken?: string; devVerifyUrl?: string } = { ok: true };
  if (user) {
    const token = randomBytes(32).toString("hex");
    await authTokens.create({ userId: user.id, kind: "verify", token, ttlMinutes: 60 * 24 });
    if (process.env.NODE_ENV !== "production") {
      payload.devToken = token;
      payload.devVerifyUrl = `/verify-email?token=${token}`;
    }
  }
  return NextResponse.json(payload);
}
