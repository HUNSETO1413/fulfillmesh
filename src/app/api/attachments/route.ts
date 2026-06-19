import { NextResponse } from "next/server";
import { attachments } from "@/lib/repositories";

const MAX_BYTES = 3_000_000; // ~3MB cap for inline data-URL storage

// GET /api/attachments?entityType=return&entityId=RET-001
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const entityType = sp.get("entityType");
  const entityId = sp.get("entityId");
  if (!entityType || !entityId) {
    return NextResponse.json({ error: "entityType and entityId are required" }, { status: 400 });
  }
  const data = await attachments.listByEntity(entityType, entityId);
  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const size = Number(body.size ?? 0);
  if (size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 3MB)" }, { status: 413 });
  }
  if (!body.dataUrl || !body.entityType || !body.entityId) {
    return NextResponse.json({ error: "entityType, entityId and dataUrl are required" }, { status: 400 });
  }
  const created = await attachments.create(body);
  return NextResponse.json(created, { status: 201 });
}
