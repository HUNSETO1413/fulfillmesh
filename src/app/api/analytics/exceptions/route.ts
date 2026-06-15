import { NextResponse } from "next/server";
import { getExceptionReport } from "@/lib/analytics";

// GET /api/analytics/exceptions → real exception counts + records.
export async function GET() {
  return NextResponse.json(await getExceptionReport());
}
