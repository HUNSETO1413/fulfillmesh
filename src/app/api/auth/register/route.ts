import { NextResponse } from "next/server";
import { users } from "@/lib/repositories";
import { hashPassword } from "@/lib/password";
import { startSession } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, password } = body;
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (await users.findByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const user = await users.create({
    name,
    email,
    role: "Manager",
    status: "Active",
    passwordHash: hashPassword(password),
  });

  await startSession(user);
  return NextResponse.json(
    { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    { status: 201 },
  );
}
