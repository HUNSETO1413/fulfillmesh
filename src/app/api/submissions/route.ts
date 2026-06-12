import { NextResponse } from "next/server";
import { submissions } from "@/lib/repositories";

export async function GET() {
  const data = submissions.list();
  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const created = submissions.create(body);
  return NextResponse.json(created, { status: 201 });
}
