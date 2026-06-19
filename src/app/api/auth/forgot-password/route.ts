import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { users, authTokens } from "@/lib/repositories";

// Request a password reset. Always responds with a generic success so we never
// leak whether an email is registered. There is no SMTP service wired up, so in
// non-production we return the token + reset URL to make the flow testable.
export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const user = await users.findByEmail(email);
  const payload: { ok: true; devToken?: string; devResetUrl?: string } = { ok: true };

  if (user) {
    const token = randomBytes(32).toString("hex");
    await authTokens.create({ userId: user.id, kind: "reset", token, ttlMinutes: 60 });
    if (process.env.NODE_ENV !== "production") {
      payload.devToken = token;
      payload.devResetUrl = `/reset-password?token=${token}`;
    }
  }

  return NextResponse.json(payload);
}
