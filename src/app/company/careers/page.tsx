import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Clock, Users, Globe, Rocket, Heart } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Help us build the future of China-powered fulfillment for global e-commerce brands. Explore open roles across engineering, design, operations, customer success, sales, and marketing at FulfillMesh.",
  path: "/company/careers",
  keywords: [
    "FulfillMesh careers",
    "fulfillment jobs",
    "remote logistics jobs",
    "supply chain careers",
    "e-commerce startup jobs",
  ],
});

const perks = [
  { icon: Globe, title: "Remote-First", desc: "Work from anywhere. Our team spans multiple time zones and countries." },
  { icon: Rocket, title: "Growth Opportunities", desc: "Join a fast-growing company where your impact is visible from day one." },
  { icon: Heart, title: "People-First Culture", desc: "We believe great work comes from supported, empowered, and valued people." },
  { icon: Users, title: "Global Team", desc: "Collaborate with teammates across China, the US, Europe, and beyond." },
];

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US / EU / APAC)",
    type: "Full-time",
    desc: "Build and scale our fulfillment platform. React, Node.js, TypeScript, and cloud infrastructure.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote (US / EU)",
    type: "Full-time",
    desc: "Design intuitive experiences for our fulfillment management platform. Strong systems thinking and craft.",
  },
  {
    title: "Supply Chain Operations Manager",
    department: "Operations",
    location: "Shenzhen, China (Hybrid)",
    type: "Full-time",
    desc: "Manage supplier relationships, coordinate fulfillment operations, and drive process improvements.",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote (US / UK)",
    type: "Full-time",
    desc: "Help e-commerce brands get the most out of FulfillMesh. Onboarding, training, and ongoing support.",
  },
  {
    title: "Business Development Representative",
    department: "Sales",
    location: "Remote (US)",
    type: "Full-time",
    desc: "Identify and engage potential brand partners. Outbound prospecting and pipeline management.",
  },
  {
    title: "Content Marketing Specialist",
    department: "Marketing",
    location: "Remote (Global)",
    type: "Full-time",
    desc: "Create guides, case studies, and educational content about China fulfillment and e-commerce logistics.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/company/about" className="hover:text-navy">Company</Link>
            <span>/</span>
            <span className="text-text-primary">Careers</span>
          </div>
          <h1 className="text-4xl lg:text-[48px] font-bold text-navy leading-tight">Careers at FulfillMesh</h1>
          <p className="mt-4 text-lg text-text-body leading-relaxed max-w-[640px]">
            Help us build the future of China-powered fulfillment for global e-commerce brands. We&apos;re looking for talented people who want to make a real impact.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <h2 className="text-2xl font-bold text-navy mb-2">Why Join FulfillMesh?</h2>
          <p className="text-text-body mb-10">We&apos;re building something meaningful — and we want you to be part of it.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card transition-all text-center">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mx-auto mb-4">
                  <perk.icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-semibold text-text-primary">{perk.title}</h3>
                <p className="mt-2 text-sm text-text-body leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <h2 className="text-2xl font-bold text-navy mb-2">Open Positions</h2>
          <p className="text-text-body mb-10">Find the role that fits your skills and passion.</p>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <div key={i} className="group bg-white rounded-xl p-6 border border-border-soft hover:shadow-card transition-all grid md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-text-primary group-hover:text-navy">{job.title}</h3>
                  <p className="mt-1 text-sm text-text-body leading-relaxed">{job.desc}</p>
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-text-muted">
                    <Briefcase className="w-3.5 h-3.5" /> {job.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-text-muted">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="text-xs text-text-muted inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.type}
                  </span>
                  <span className="text-sm font-medium text-teal inline-flex items-center gap-1 cursor-pointer">
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[800px] mx-auto px-6 py-20 lg:py-24 text-center">
          <h2 className="text-3xl font-bold">Don&apos;t see your role?</h2>
          <p className="mt-3 text-text-on-dark-muted">We&apos;re always looking for talented people. Send us your resume and tell us how you can contribute.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
