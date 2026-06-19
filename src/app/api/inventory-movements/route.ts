import { NextResponse } from "next/server";
import { inventoryMovements } from "@/lib/repositories";

// GET /api/inventory-movements?sku=SKU-001  → movements (optionally filtered by sku)
export async function GET(request: Request) {
  const sku = new URL(request.url).searchParams.get("sku");
  const data = sku ? await inventoryMovements.listBySku(sku) : await inventoryMovements.list();
  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const created = await inventoryMovements.create(body);
  return NextResponse.json(created, { status: 201 });
}
