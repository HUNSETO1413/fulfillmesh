import { NextResponse } from "next/server";
import { getOrderPerformanceReport } from "@/lib/analytics";

// GET /api/analytics/order-performance → real order performance aggregates.
export async function GET() {
  return NextResponse.json(await getOrderPerformanceReport());
}
