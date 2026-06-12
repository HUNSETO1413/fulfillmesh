import { NextResponse } from "next/server";
import { submissions } from "@/lib/repositories";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  const created = submissions.create({
    type: "contact",
    name,
    email,
    company: body.company ? String(body.company) : undefined,
    message: body.message ? String(body.message) : undefined,
    payload: JSON.stringify(body),
  });
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
