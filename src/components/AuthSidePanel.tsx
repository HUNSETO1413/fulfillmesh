import { ShieldCheck, Eye, Layers, Truck, ShieldHalf, ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

type Feature = { icon: LucideIcon; title: string; desc: string };

const defaultFeatures: Feature[] = [
  { icon: ShieldCheck, title: "Vetted Partners", desc: "Work with verified factories and logistics partners." },
  { icon: Eye, title: "Quality You Can Count On", desc: "On-site inspections and quality checks to secure your standards." },
  { icon: Layers, title: "Optimized Delivery", desc: "Competitive shipping rates and reliable on-time delivery." },
  { icon: Truck, title: "Real-time Visibility", desc: "Track orders, shipments, and inventory from one powerful dashboard." },
];

export const forgotFeatures: Feature[] = [
  { icon: ShieldCheck, title: "Vetted Partners", desc: "Work with verified factories and 3PLs across China." },
  { icon: Eye, title: "Real-time Visibility", desc: "Track orders, shipments, and inventory from a single dashboard." },
  { icon: ShieldHalf, title: "End-to-End Control", desc: "From quality checks to delivery, we've got you covered." },
];

export default function AuthSidePanel({
  heading,
  highlight,
  trailing,
  badge,
  subtext = "FulfillMesh helps brands ship smarter with reliable partners across China and around the world.",
  features = defaultFeatures,
}: {
  heading: string;
  highlight: string;
  trailing?: string;
  badge?: string;
  subtext?: string;
  features?: Feature[];
}) {
  return (
    <div>
      {badge && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 text-xs font-medium text-teal">
          <span className="w-1.5 h-1.5 rounded-full bg-teal" />
          {badge}
        </span>
      )}
      <h2 className={`${badge ? "mt-4 " : ""}text-3xl font-bold leading-tight text-deep-navy`}>
        {heading} <span className="text-teal">{highlight}</span>{trailing ? ` ${trailing}` : ""}
      </h2>
      <p className="mt-4 text-base text-text-body leading-relaxed max-w-md">{subtext}</p>

      {/* World map illustration */}
      <div className="relative mt-8 h-40 rounded-2xl border border-border-soft bg-soft-bg overflow-hidden">
        <svg viewBox="0 0 600 240" className="w-full h-full opacity-80">
          {[
            [100, 60], [130, 75], [160, 65], [190, 85], [250, 80], [290, 70], [330, 65],
            [370, 75], [410, 70], [450, 100], [490, 85], [530, 75], [570, 95],
            [110, 115], [170, 125], [230, 135], [290, 120], [350, 130], [410, 125],
            [470, 115], [530, 125], [120, 165], [180, 155], [240, 160],
            [300, 150], [360, 160], [420, 155], [480, 165], [540, 160],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="#B8C7DA" />
          ))}
          <circle cx="430" cy="90" r="20" fill="#00B894" opacity="0.18" />
          <circle cx="430" cy="90" r="5" fill="#00B894" />
          <line x1="430" y1="90" x2="160" y2="65" stroke="#00B894" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" />
          <line x1="430" y1="90" x2="290" y2="120" stroke="#0057D8" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.35" />
        </svg>
      </div>

      {/* Feature list */}
      <div className="mt-8 space-y-5">
        {features.map((f) => (
          <div key={f.title} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
              <f.icon className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-deep-navy">{f.title}</p>
              <p className="mt-0.5 text-sm text-text-body leading-relaxed max-w-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA card */}
      <div className="mt-8 rounded-2xl gradient-dark-hero p-6 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white max-w-xs">
          Join thousands of brands shipping smarter from China.
        </p>
        <Link
          href="/get-started"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
