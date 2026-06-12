import type { Metadata } from "next";
import { returns } from "@/lib/repositories";
import ReturnsView from "./ReturnsView";

export const metadata: Metadata = { title: "Returns" };

// Server Component: loads return records from the SQLite-backed repository and
// hands them to the client view for interactive filtering, search and pagination.
export default function ReturnsPage() {
  return <ReturnsView items={returns.list()} />;
}
