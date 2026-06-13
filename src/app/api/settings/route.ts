import { NextResponse } from "next/server";
import { settings } from "@/lib/repositories";

// Settings are a key/value store rather than an entity collection.
// GET returns the full settings object; PUT upserts a partial object.
export async function GET() {
  const data = await settings.getAll();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  let body: Record<string, unknown> | null = null;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const data = await settings.setMany(body);
  return NextResponse.json(data);
}
