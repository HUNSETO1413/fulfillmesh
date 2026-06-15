import { NextResponse } from "next/server";
import { users } from "@/lib/repositories";

// Users have a custom create signature (requires passwordHash), so this item
// route is hand-written rather than generated from the generic factory.
type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const found = await users.get(id);
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  let body: Record<string, unknown> | null = null;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  // Never accept a password hash through this endpoint.
  delete body.passwordHash;
  const updated = await users.update(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const ok = await users.remove(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
