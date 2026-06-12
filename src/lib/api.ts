import { NextResponse } from "next/server";

// Generic CRUD route-handler factories so each entity's route.ts stays a
// one-liner. Repositories expose a subset of list/get/create/update/remove.

interface ReadRepo<T> {
  list(): T[];
  get(id: string): T | null;
}
interface WriteRepo<T> extends ReadRepo<T> {
  create(input: Partial<T>): T;
  update?(id: string, input: Partial<T>): T | null;
  remove?(id: string): boolean;
}

type RouteCtx = { params: Promise<{ id: string }> };

async function parseBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function collection<T>(repo: WriteRepo<T>) {
  return {
    async GET() {
      const data = repo.list();
      return NextResponse.json({ data, total: data.length });
    },
    async POST(request: Request) {
      const body = await parseBody(request);
      if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
      const created = repo.create(body as Partial<T>);
      return NextResponse.json(created, { status: 201 });
    },
  };
}

export function readOnlyCollection<T>(repo: ReadRepo<T>) {
  return {
    async GET() {
      const data = repo.list();
      return NextResponse.json({ data, total: data.length });
    },
  };
}

export function item<T>(repo: WriteRepo<T>) {
  return {
    async GET(_request: Request, ctx: RouteCtx) {
      const { id } = await ctx.params;
      const found = repo.get(id);
      if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(found);
    },
    async PUT(request: Request, ctx: RouteCtx) {
      const { id } = await ctx.params;
      if (!repo.update) return NextResponse.json({ error: "Not supported" }, { status: 405 });
      const body = await parseBody(request);
      if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
      const updated = repo.update(id, body as Partial<T>);
      if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(updated);
    },
    async DELETE(_request: Request, ctx: RouteCtx) {
      const { id } = await ctx.params;
      if (!repo.remove) return NextResponse.json({ error: "Not supported" }, { status: 405 });
      const ok = repo.remove(id);
      if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    },
  };
}
