import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Lock,
  Cloud,
  ClipboardCheck,
  Monitor,
  Users,
  ShieldCheck,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Compliance & Security",
  description:
    "FulfillMesh adheres to the highest standards of security and compliance. We comply with ISO 27001, SOC 2, GDPR, HIPAA, PCI DSS, and CCPA, with data encryption, access control, and 24/7 monitoring.",
  path: "/compliance",
  keywords: [
    "FulfillMesh compliance",
    "data security",
    "ISO 27001",
    "SOC 2",
    "GDPR compliance",
    "PCI DSS",
  ],
});

const certifications = [
  {
    badge: "ISO\n27001",
    badgeColor: "border-action-blue text-action-blue",
    name: "ISO/IEC 27001",
    desc: "Information security management system certified.",
  },
  {
    badge: "SOC\n2",
    badgeColor: "border-action-blue text-action-blue",
    name: "SOC 2 Type II",
    desc: "Independent audit for security, availability, and confidentiality.",
  },
  {
    badge: "GDPR",
    badgeColor: "border-[#F2B705] text-[#F2B705]",
    name: "GDPR",
    desc: "Compliant with the EU General Data Protection Regulation.",
  },
  {
    badge: "HIPAA",
    badgeColor: "border-action-blue text-action-blue",
    name: "HIPAA Compliant",
    desc: "Safeguarding protected health information in compliance with HIPAA.",
  },
  {
    badge: "PCI",
    badgeColor: "border-teal text-teal",
    name: "PCI DSS",
    desc: "Compliant with payment card industry data security standards.",
  },
];

const practices = [
  {
    icon: Lock,
    title: "Data Encryption",
    desc: "All data is encrypted in transit and at rest using industry-standard protocols.",
  },
  {
    icon: ShieldCheck,
    title: "Access Control",
    desc: "Role-based access control (RBAC) ensures that only authorized users can access data.",
  },
  {
    icon: Monitor,
    title: "24/7 Monitoring",
    desc: "Our systems are monitored around the clock to detect and respond to potential threats.",
  },
  {
    icon: Cloud,
    title: "Secure Infrastructure",
    desc: "Hosted on secure cloud platforms with firewalls, intrusion detection, and DDoS protection.",
  },
  {
    icon: ClipboardCheck,
    title: "Regular Audits",
    desc: "We conduct regular security assessments and penetration testing.",
  },
  {
    icon: Users,
    title: "Security Training",
    desc: "Our team undergoes regular security training and follows best practices.",
  },
];

function HeroShield() {
  return (
    <svg width="340" height="260" viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 340, height: 260, flexShrink: 0 }}>
      {/* faint world map backdrop */}
      <g opacity="0.5" fill="#E6EDF5">
        <circle cx="58" cy="74" r="3" /><circle cx="74" cy="70" r="3" /><circle cx="90" cy="76" r="3" /><circle cx="66" cy="86" r="3" /><circle cx="84" cy="90" r="3" /><circle cx="100" cy="84" r="3" />
        <circle cx="240" cy="72" r="3" /><circle cx="256" cy="68" r="3" /><circle cx="272" cy="74" r="3" /><circle cx="288" cy="70" r="3" /><circle cx="250" cy="84" r="3" /><circle cx="266" cy="88" r="3" /><circle cx="282" cy="82" r="3" /><circle cx="298" cy="86" r="3" />
        <circle cx="60" cy="150" r="3" /><circle cx="76" cy="156" r="3" /><circle cx="92" cy="150" r="3" /><circle cx="70" cy="166" r="3" />
        <circle cx="256" cy="150" r="3" /><circle cx="272" cy="156" r="3" /><circle cx="288" cy="150" r="3" /><circle cx="280" cy="166" r="3" /><circle cx="264" cy="166" r="3" />
      </g>
      {/* orbiting dashed ring */}
      <ellipse cx="180" cy="120" rx="150" ry="92" stroke="#CFE0F4" strokeWidth="1.5" strokeDasharray="3 6" />
      {/* base platform */}
      <ellipse cx="180" cy="208" rx="86" ry="20" fill="#DCE8F8" />
      <ellipse cx="180" cy="196" rx="70" ry="16" fill="#EAF1FB" />
      {/* shield */}
      <path d="M180 36c0 0 34-16 50-24 16 8 50 24 50 24v40c0 42-30 70-50 80-20-10-50-38-50-80z" transform="translate(-50,0)" fill="#10D6B0" />
      <path d="M130 36c0 0 34-16 50-24 16 8 50 24 50 24v40c0 42-30 70-50 80-20-10-50-38-50-80z" fill="#00B894" opacity="0.0" />
      <rect x="162" y="92" width="36" height="30" rx="6" fill="#fff" />
      <path d="M170 92v-7a10 10 0 0 1 20 0v7" stroke="#fff" strokeWidth="5" fill="none" />
      <circle cx="180" cy="106" r="4" fill="#00B894" />
      {/* floating mini icons */}
      <circle cx="120" cy="40" r="16" fill="#00B894" />
      <path d="M113 40l5 5 9-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="252" y="34" width="26" height="32" rx="4" fill="#EAF1FB" stroke="#9BC0F0" />
      <rect x="290" y="116" width="28" height="24" rx="4" fill="#EAF1FB" stroke="#9BC0F0" />
      <rect x="56" y="150" width="26" height="26" rx="4" fill="#EAF1FB" stroke="#9BC0F0" />
      <circle cx="296" cy="186" r="13" fill="#EAF1FB" stroke="#9BC0F0" />
      {/* extra decorative accent dots */}
      <circle cx="42" cy="110" r="4" fill="#00B894" opacity="0.6" />
      <circle cx="316" cy="78" r="4" fill="#00B894" opacity="0.6" />
      <circle cx="78" cy="200" r="5" fill="#CFE0F4" />
      <circle cx="300" cy="206" r="5" fill="#CFE0F4" />
      <circle cx="232" cy="44" r="3" fill="#9BC0F0" />
      <circle cx="98" cy="60" r="3" fill="#9BC0F0" />
      <rect x="38" y="60" width="14" height="14" rx="3" fill="#EAF1FB" stroke="#9BC0F0" />
      <path d="M308 150l4 4 7-8" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function CompliancePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-[44px] font-bold text-deep-navy leading-tight tracking-[-0.02em]">
                Compliance / Security
              </h1>
              <p className="mt-5 text-[18px] text-text-body leading-relaxed max-w-[480px]">
                At FulfillMesh, protecting your data and ensuring compliance with
                industry standards is at the core of everything we do.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-border-soft bg-soft-bg px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="text-[14px] text-text-body leading-relaxed">
                  We are committed to maintaining the highest standards of security, privacy, and compliance across our platform and services.
                </p>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <HeroShield />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Standards */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <h2 className="text-[32px] font-bold text-deep-navy text-center">
            Certifications &amp; Standards
          </h2>
          <p className="mt-3 text-[18px] text-text-body text-center">
            We comply with globally recognized standards and frameworks.
          </p>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-white rounded-xl border border-border-soft p-6 shadow-card hover:scale-[1.02] transition-all duration-200"
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white text-[12px] font-bold leading-[1.1] whitespace-pre-line ${cert.badgeColor}`}
                >
                  {cert.badge}
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-deep-navy">
                  {cert.name}
                </h3>
                <p className="mt-2 text-[12px] text-text-muted leading-relaxed">
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Security Practices */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <h2 className="text-[32px] font-bold text-deep-navy text-center">
            Our Security Practices
          </h2>
          <p className="mt-3 text-[18px] text-text-body text-center">
            We implement proactive measures to keep your data and operations secure.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {practices.map((p, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <p.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-deep-navy">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] text-text-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-5 rounded-2xl border border-border-soft bg-soft-bg px-8 py-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-bold text-deep-navy">
                Compliance is our priority.
              </h2>
              <p className="mt-1 text-[14px] text-text-body leading-relaxed max-w-[560px]">
                We continuously evaluate and improve our security and compliance
                programs to align with evolving industry standards and regulations.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-action-blue rounded-lg border border-border-blue bg-white hover:bg-soft-bg transition-all"
            >
              Contact Compliance Team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
