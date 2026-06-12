import type { Metadata } from "next";
import { qcInspections } from "@/lib/repositories";
import QcInspectionsView from "./QcInspectionsView";

export const metadata: Metadata = { title: "QC Inspections" };

// Server Component: loads QC inspections from the SQLite-backed repository and
// hands them to the client view for interactive filtering, search and pagination.
export default function QcInspectionsPage() {
  return <QcInspectionsView items={qcInspections.list()} />;
}
