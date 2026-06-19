import { NextResponse } from "next/server";
import { users, authTokens } from "@/lib/repositories";
import { hashPassword } from "@/lib/password";

// Complete a password reset using a token issued by /api/auth/forgot-password.
export async function POST(request: Request) {
  let body: { token?: string; password?: string };
  try {
    body = (await request.json()) as { token?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const token = (body.token ?? "").trim();
  const password = body.password ?? "";
  if (!token) {
    return NextResponse.json({ error: "Reset token is required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const valid = await authTokens.findValid(token, "reset");
  if (!valid) {
    return NextResponse.json({ error: "This reset link is invalid or has expired" }, { status: 400 });
  }

  const ok = await users.setPassword(valid.userId, hashPassword(password));
  if (!ok) {
    return NextResponse.json({ error: "Account no longer exists" }, { status: 400 });
  }
  await authTokens.markUsed(token);

  return NextResponse.json({ ok: true });
}
