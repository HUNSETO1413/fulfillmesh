import type { Metadata } from "next";
import SolutionDetailLayout from "@/components/SolutionDetailLayout";
import {
  MapPin, Truck, FileCheck, MonitorCheck, BarChart3, AlertTriangle,
  CheckCircle2, Globe, Warehouse, Ship, Package,
  DollarSign, Zap,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Logistics for Global E-commerce",
  description:
    "Global shipping and logistics from China with vetted carriers, smart route optimization, customs clearance, and real-time tracking for fast, reliable on-time delivery.",
  path: "/solutions/shipping-logistics",
  keywords: [
    "china shipping logistics",
    "freight forwarding",
    "ecommerce shipping",
    "customs clearance",
    "international shipping carriers",
  ],
});

export default function ShippingLogisticsPage() {
  return (
    <SolutionDetailLayout
      title="Shipping & Logistics"
      headline={<>that moves your business <span className="gradient-text-teal">forward</span></>}
      heroDesc="FulfillMesh optimizes global shipping and logistics with the best carriers, smarter routes, and real-time visibility — so your products arrive on time, every time."
      mapNodes={[
        { label: "Global Carrier Network", icon: Truck, top: "30%", left: "28%" },
        { label: "Smart Route Optimization", icon: MapPin, top: "25%", left: "80%" },
        { label: "Real-Time Tracking", icon: MonitorCheck, top: "80%", left: "22%" },
        { label: "On-Time Delivery", icon: CheckCircle2, top: "80%", left: "78%" },
      ]}
      worksTitle="How shipping & logistics works"
      worksSubtitle="Our proven process gets your shipments delivered on time, every time."
      steps={[
        { num: "1", icon: Package, title: "Pickup", desc: "We pick up your goods from your location or supplier." },
        { num: "2", icon: Warehouse, title: "Consolidation", desc: "Shipments are consolidated for optimal space, cost, and efficiency." },
        { num: "3", icon: FileCheck, title: "Customs Clearance", desc: "We handle documentation and clearance to keep your shipments moving." },
        { num: "4", icon: Truck, title: "Final-Mile Delivery", desc: "Delivered to your destination on time, every time." },
      ]}
      featuresTitle="Comprehensive shipping & logistics solutions"
      featuresSubtitle="Every shipment. Every mile. Fully optimized."
      features={[
        { icon: MapPin, title: "Smart Route Planning", desc: "AI-powered route optimization that reduces transit time and shipping costs across global lanes." },
        { icon: Truck, title: "Carrier Coordination", desc: "Access to a vetted network of global carriers with negotiated rates and reliable capacity." },
        { icon: FileCheck, title: "Customs & Compliance", desc: "End-to-end customs clearance support with accurate documentation and regulatory expertise." },
        { icon: MonitorCheck, title: "Real-Time Shipment Tracking", desc: "Live visibility into every shipment with proactive alerts and milestone updates." },
        { icon: BarChart3, title: "Delivery Optimization", desc: "Optimize delivery windows, reduce delays, and improve on-time performance." },
        { icon: AlertTriangle, title: "Exception Management", desc: "Proactive issue detection and resolution to keep your supply chain moving." },
      ]}
      timelineTitle="Our shipping & logistics process"
      timelineSubtitle="A streamlined process built for speed, reliability, and scale."
      timeline={[
        { icon: Package, title: "Pickup", desc: "We pick up your goods from your location or supplier." },
        { icon: Warehouse, title: "Consolidation", desc: "Shipments are consolidated for optimal space, cost, and efficiency." },
        { icon: FileCheck, title: "Customs Clearance", desc: "We handle documentation and clearance to keep your shipments moving." },
        { icon: Ship, title: "Transit", desc: "Goods are shipped via the best route and carrier for your needs." },
        { icon: Truck, title: "Final-Mile Delivery", desc: "Delivered to your destination on time, every time." },
      ]}
      sourcingEyebrow="BUILT FOR GROWING BRANDS"
      sourcingTitle={<>Real-time visibility <br /> you can <span className="gradient-text-teal">act on</span></>}
      sourcingDesc="Track shipments, monitor performance, and manage exceptions from a single, intuitive dashboard."
      sourcingBullets={[
        "Live tracking & milestone updates",
        "Proactive delay & exception alerts",
        "Centralized documents & compliance",
        "Actionable analytics & reports",
      ]}
      dashTitle="Shipment Tracking"
      dashColumns={["Tracking #", "Route", "Mode", "Status", "ETA", "Carrier", "Weight", "Action"]}
      dashRows={[
        { cols: ["FMU123456789", "Shanghai → Los Angeles", "Ocean", "In Transit", "Jun 18", "Maersk", "2.4t", "View"] },
        { cols: ["FMU987654321", "Hamburg → Chicago", "Air", "In Transit", "Jun 15", "DHL", "180kg", "View"] },
        { cols: ["FMU456789123", "Shenzhen → Dallas", "Road", "Out for Delivery", "Jun 13", "FedEx", "95kg", "View"] },
        { cols: ["FMU789123456", "Bangkok → Sydney", "Ocean", "Customs Clearance", "Jun 20", "COSCO", "1.8t", "View"] },
        { cols: ["FMU321654987", "Istanbul → New York", "Air", "Delivered", "Jun 10", "UPS", "220kg", "View"] },
      ]}
      dashCta="View All Shipments"
      connectedEyebrow="ONE CONNECTED PLATFORM"
      connectedTitle={<>Shipping & Logistics, connected to your fulfillment operations</>}
      connectedDesc="Seamlessly manage shipments, carriers, and tracking alongside orders, inventory, and warehouse operations — all in one platform."
      stats={[
        { icon: Globe, value: "97.4%", label: "On-Time Delivery" },
        { icon: DollarSign, value: "1.26M", label: "Shipments in Transit" },
        { icon: Zap, value: "3.8", label: "Avg. Transit Days" },
        { icon: BarChart3, value: "$2.1M", label: "Freight Saved" },
      ]}
      faqs={[
        { q: "What carriers do you work with?" },
        { q: "How do you handle customs clearance?" },
        { q: "Can I track multiple shipments at once?" },
        { q: "What happens if a shipment is delayed?" },
      ]}
      ctaTitle="Ready to streamline your shipping & logistics?"
      ctaDesc="Let's build a smarter, more reliable supply chain together."
    />
  );
}
