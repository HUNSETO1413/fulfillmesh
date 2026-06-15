import { NextResponse } from "next/server";
import { getOperationalReport } from "@/lib/analytics";

// GET /api/analytics/operational → real operational throughput aggregates.
export async function GET() {
  return NextResponse.json(await getOperationalReport());
}
