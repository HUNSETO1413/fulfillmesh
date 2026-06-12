import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Lock,
  Cloud,
  ClipboardCheck,
  Activity,
  Users,
  ShieldCheck,
} from "lucide-react";

const certifications = [
  {
    badge: "ISO 27001",
    badgeColor: "bg-teal text-white",
    name: "ISO 27001:2022",
    desc: "Information Security Management System",
  },
  {
    badge: "GDPR",
    badgeColor: "bg-action-blue text-white",
    name: "GDPR",
    desc: "General Data Protection Regulation",
  },
  {
    badge: "HIPAA",
    badgeColor: "bg-blue-teal text-white",
    name: "HIPAA",
    desc: "Health Insurance Portability and Accountability Act",
  },
  {
    badge: "PCI DSS",
    badgeColor: "bg-navy text-white",
    name: "PCI DSS",
    desc: "Payment Card Industry Data Security Standard",
  },
  {
    badge: "SOC 2",
    badgeColor: "bg-teal text-white",
    name: "SOC 2 Type II",
    desc: "Service Organization Control 2",
  },
  {
    badge: "CCPA",
    badgeColor: "bg-action-blue text-white",
    name: "CCPA",
    desc: "California Consumer Privacy Act",
  },
];

const practices = [
  {
    icon: Lock,
    title: "Data Encryption",
    desc: "End-to-end encryption for all data in transit and at rest",
  },
  {
    icon: ShieldCheck,
    title: "Access Control",
    desc: "Role-based access to limit data exposure",
  },
  {
    icon: Activity,
    title: "24/7 Monitoring",
    desc: "Real-time threat detection and response",
  },
  {
    icon: Cloud,
    title: "Secure Infrastructure",
    desc: "Encrypted servers and regular security audits",
  },
  {
    icon: ClipboardCheck,
    title: "Regular Audits",
    desc: "Third-party penetration testing and compliance reviews",
  },
  {
    icon: Users,
    title: "Security Training",
    desc: "Ongoing employee training on security best practices",
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
              <h1 className="text-[36px] lg:text-[44px] font-bold text-deep-navy leading-tight">
                Compliance / Security
              </h1>
              <p className="mt-5 text-[18px] text-text-body leading-relaxed max-w-[480px]">
                We adhere to the highest standards of security and compliance to protect your data.
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
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-all duration-200"
              >
                <span
                  className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-[12px] font-bold ${cert.badgeColor}`}
                >
                  {cert.badge}
                </span>
                <h3 className="mt-3 text-[14px] font-bold text-deep-navy">
                  {cert.name}
                </h3>
                <p className="mt-1.5 text-[12px] text-text-muted leading-relaxed">
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
            Protecting your data with industry-leading security measures
          </p>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {practices.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-action-blue/10 text-action-blue">
                  <p.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-deep-navy">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[14px] text-text-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 pb-20">
          <div className="bg-deep-navy rounded-2xl px-10 py-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-navy via-navy to-[#1E3A8A] opacity-80" />
            <div className="relative z-10">
              <h2 className="text-[32px] font-bold text-white leading-tight">
                Security &amp; Compliance is Our Priority
              </h2>
              <p className="mt-4 text-[17px] text-text-on-dark-muted max-w-[520px] mx-auto">
                We continuously evaluate and improve our security and compliance programs to align with evolving industry standards.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
                >
                  Contact Compliance Team <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/book-a-demo"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg border-2 border-white hover:bg-white/10 transition-all"
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
