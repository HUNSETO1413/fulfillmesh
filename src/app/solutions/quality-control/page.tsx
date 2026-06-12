import type { Metadata } from "next";
import SolutionDetailLayout from "@/components/SolutionDetailLayout";
import {
  ShieldCheck, Microscope, FileSearch, ClipboardCheck, Camera, AlertTriangle,
  Search, FileText, Wrench, Truck, ScanLine,
  BarChart3, Eye, Layers,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Quality Control & Product Inspection Services",
  description:
    "China-based quality control with PPI, in-line (DUPRO), and final random inspections using AQL sampling. Catch defects early, cut returns, and ship with confidence.",
  path: "/solutions/quality-control",
  keywords: [
    "china quality control",
    "product inspection services",
    "pre-shipment inspection",
    "AQL inspection",
    "factory quality control",
  ],
});

export default function QualityControlPage() {
  return (
    <SolutionDetailLayout
      title="Quality Control"
      headline={<>that protects your brand and <span className="gradient-text-teal">delivers consistent quality.</span></>}
      heroDesc="FulfillMesh provides rigorous inspections at every stage of production to reduce defects, prevent costly returns, and ensure your customers receive only the best."
      mapNodes={[
        { label: "Pre-Production", icon: ClipboardCheck, top: "26%", left: "30%" },
        { label: "In-Line Inspection", icon: ScanLine, top: "16%", left: "78%" },
        { label: "Final Random", icon: FileSearch, top: "76%", left: "22%" },
        { label: "Ship With Confidence", icon: Truck, top: "78%", left: "76%" },
      ]}
      worksTitle="How quality control works"
      worksSubtitle="Our proven inspection process ensures issues are caught early and resolved fast."
      steps={[
        { num: "1", icon: ClipboardCheck, title: "Pre-Production", desc: "Review specs, materials, and factory readiness before production starts." },
        { num: "2", icon: ScanLine, title: "In-Line Inspection", desc: "Inspect during production to identify and correct issues early." },
        { num: "3", icon: FileSearch, title: "Pre-Shipment (FRI)", desc: "Randomly inspect finished goods using AQL sampling methods." },
        { num: "4", icon: Truck, title: "Ship With Confidence", desc: "Approve shipment only when quality meets your standards." },
      ]}
      featuresTitle="Comprehensive quality control services"
      featuresSubtitle="Tailored inspections and quality checks across your entire supply chain."
      features={[
        { icon: ClipboardCheck, title: "Pre-Production Inspection (PPI)", desc: "Evaluate raw materials, components, workmanship, and factory readiness before production begins." },
        { icon: ScanLine, title: "In-Line Inspection (DUPRO)", desc: "Monitor production and catch quality issues while there's still time to correct them." },
        { icon: FileSearch, title: "Final Random Inspection (FRI)", desc: "Randomly inspect finished products against AQL standards to ensure overall quality compliance." },
        { icon: Microscope, title: "Sample Verification", desc: "Verify samples against your approved specifications, materials, and workmanship." },
        { icon: Camera, title: "Photo & Video Reports", desc: "Receive clear, timestamped photo and video evidence with detailed inspection findings." },
        { icon: AlertTriangle, title: "Issue Escalation", desc: "Critical issues are escalated in real-time with actionable recommendations and follow-up." },
      ]}
      timelineTitle="Quality control at every stage of production"
      timelineSubtitle="A transparent end-to-end process designed to catch issues early and ensure consistency."
      timeline={[
        { icon: ClipboardCheck, title: "Pre-Production", desc: "Review specs, materials, and factory readiness before production starts." },
        { icon: ScanLine, title: "In-Line Inspection", desc: "Inspect during production to identify and correct issues early." },
        { icon: Search, title: "Pre-Shipment (FRI)", desc: "Randomly inspect finished goods using AQL sampling methods." },
        { icon: FileText, title: "Report & Review", desc: "Detailed reports with photos, scores, and recommendations." },
        { icon: Wrench, title: "Corrective Action", desc: "Work with the factory to resolve issues and re-inspect if needed." },
      ]}
      sourcingEyebrow="BUILT FOR GROWING BRANDS"
      sourcingTitle={<>Transparent reporting <br /> you can <span className="gradient-text-teal">trust</span></>}
      sourcingDesc="Clear, detailed inspection reports delivered quickly with actionable insights."
      sourcingBullets={[
        "Customizable checklists & AQL standards",
        "High-resolution photos & videos",
        "Defect classification & root cause",
        "Downloadable PDF reports",
      ]}
      dashTitle="QC Inspection Results"
      dashColumns={["Supplier", "Inspection Type", "Date", "Status", "Quality Score", "Defects", "AQL Level", "Action"]}
      dashRows={[
        { cols: ["Shenzhen Precision Co.", "FRI", "Jun 10, 2025", "Pass", "98.6%", "2", "AQL 2.5", "View"] },
        { cols: ["Ningbo Bright Mfg.", "DUPRO", "Jun 8, 2025", "Pass", "96.3%", "4", "AQL 2.5", "View"] },
        { cols: ["Dongguan Textiles Ltd.", "PPI", "Jun 6, 2025", "Review", "91.2%", "7", "AQL 4.0", "View"] },
        { cols: ["Suzhou Advanced Co.", "FRI", "Jun 4, 2025", "Pass", "97.8%", "3", "AQL 2.5", "View"] },
        { cols: ["Qingdao Excellent Plastics", "DUPRO", "Jun 2, 2025", "Pass", "95.1%", "5", "AQL 4.0", "View"] },
      ]}
      dashCta="View All Reports"
      connectedEyebrow="ONE CONNECTED PLATFORM"
      connectedTitle={<>Quality Control, connected to your fulfillment operations</>}
      connectedDesc="Seamlessly manage inspections, track scores, and resolve issues alongside orders, shipments, and warehouse operations — all in one platform."
      stats={[
        { icon: ShieldCheck, value: "78%", label: "Reduction in Returns" },
        { icon: Eye, value: "98.6%", label: "Avg Quality Score" },
        { icon: BarChart3, value: "2.6x", label: "Fewer Quality Issues" },
        { icon: Layers, value: "100+", label: "Brands Worldwide" },
      ]}
      faqs={[
        { q: "What inspection types do you offer?" },
        { q: "How quickly are reports delivered?" },
        { q: "Can I customize inspection checklists?" },
        { q: "What happens if a product fails inspection?" },
      ]}
      ctaTitle="Ensure quality. Protect your brand. Delight your customers."
      ctaDesc="Schedule an inspection today and ship with confidence."
    />
  );
}
