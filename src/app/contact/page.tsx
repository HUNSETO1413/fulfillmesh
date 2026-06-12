import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Mail, MapPin, ArrowRight, Clock, Calendar,
  CheckCircle, MessageCircle, Globe, Search, ShieldCheck,
  Package, Truck, Warehouse,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "./ContactForm";
import ContactFaq from "./ContactFaq";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Talk to the FulfillMesh team. Get answers about China-powered fulfillment — supplier vetting, quality control, packaging, shipping, and overseas warehousing for your brand.",
  path: "/contact",
  keywords: [
    "contact fulfillmesh",
    "china fulfillment contact",
    "ecommerce fulfillment support",
  ],
});

const ways = [
  { icon: Search, title: "Supplier Vetting", desc: "We vet and list the best factories for your needs" },
  { icon: ShieldCheck, title: "Quality Control", desc: "On-site inspections and production monitoring" },
  { icon: Package, title: "Packaging & Labeling", desc: "Custom packaging, labeling, and kitting" },
  { icon: Truck, title: "Shipping & Logistics", desc: "Optimized shipping rates and reliable carriers" },
  { icon: Warehouse, title: "Overseas Warehousing", desc: "Store, pick, pack, and ship from our global warehouses" },
];

const contactItems = [
  { icon: Mail, label: "Email", value: "hello@fulfillmesh.com", sub: "We typically reply within 2 hours" },
  { icon: MessageCircle, label: "WhatsApp", value: "+86 173 6456 7890", sub: "Chat with our team instantly" },
  { icon: Clock, label: "Response Time", value: "Within 2 business hours", sub: "Monday - Friday" },
  { icon: Calendar, label: "Office Hours", value: "9:00 AM - 6:00 PM CST", sub: "Monday - Friday" },
];

const strategyBullets = [
  "30-minute one-on-one session",
  "Tailored recommendations",
  "No obligation, completely free",
];

export default function ContactPage() {
  return (
    <main>
      {/* Hero + Form + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-12">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* Left column: heading + form */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-action-blue/10 text-action-blue text-[11px] font-bold tracking-wider uppercase mb-5">
                <MapPin className="w-3.5 h-3.5" /> Contact Us
              </span>
              <h1 className="text-[38px] lg:text-[46px] font-bold leading-[1.12] tracking-tight text-text-primary">
                Talk to the FulfillMesh team
              </h1>
              <p className="mt-4 text-[16px] text-text-muted leading-[1.6] max-w-[560px]">
                Have questions or ready to scale your fulfillment? We&apos;re here to help you find the right China-powered solution for your brand.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Get In Touch Card */}
              <div className="rounded-xl border border-border-soft p-5 shadow-soft">
                <h3 className="text-[16px] font-bold text-text-primary mb-1">Get in touch</h3>
                <p className="text-[13px] text-text-muted mb-4">We&apos;d love to hear from you.</p>
                <div className="space-y-3.5">
                  {contactItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-action-blue" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-text-muted">{item.label}</p>
                        <p className="text-[13px] font-medium text-text-primary">{item.value}</p>
                        <p className="text-[11px] text-text-light mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Card */}
              <div className="rounded-xl border border-border-soft p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-1.5">
                  <Globe className="w-4 h-4 text-teal" />
                  <h3 className="text-[14px] font-bold text-text-primary">China-powered. Globally connected.</h3>
                </div>
                <p className="text-[13px] text-text-muted mb-3">Our fulfillment network reaches your customers worldwide.</p>
                <div className="h-[120px] rounded-lg bg-soft-bg overflow-hidden relative flex items-center justify-center">
                  <svg viewBox="0 0 320 140" className="w-full h-full" role="img" aria-label="Global fulfillment network map">
                    <defs>
                      <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="1.4" cy="1.4" r="1.1" fill="#C7D7EA" />
                      </pattern>
                    </defs>
                    {/* continents as dotted blobs */}
                    <g fill="url(#dots)">
                      <ellipse cx="70" cy="60" rx="42" ry="26" />
                      <ellipse cx="160" cy="55" rx="34" ry="22" />
                      <ellipse cx="235" cy="62" rx="46" ry="28" />
                      <ellipse cx="85" cy="100" rx="22" ry="16" />
                      <ellipse cx="175" cy="100" rx="20" ry="14" />
                    </g>
                    {/* China highlight */}
                    <ellipse cx="248" cy="56" rx="16" ry="11" fill="#00B894" opacity="0.85" />
                    {/* connection arcs */}
                    <g stroke="#0057D8" strokeWidth="1" fill="none" strokeDasharray="3 3" opacity="0.7">
                      <path d="M248 56 Q180 20 70 52" />
                      <path d="M248 56 Q210 30 160 48" />
                      <path d="M248 56 Q210 90 175 96" />
                      <path d="M248 56 Q170 110 85 96" />
                    </g>
                    {/* pins */}
                    {[[70,52],[160,48],[175,96],[85,96],[248,56]].map(([x,y],i)=>(
                      <circle key={i} cx={x} cy={y} r="3" fill={i===4 ? "#00B894" : "#0057D8"} stroke="#fff" strokeWidth="1" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ways We Can Help */}
      <section className="bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-text-primary">Ways we can help</h2>
            <p className="mt-2 text-[15px] text-text-muted max-w-[460px] mx-auto">
              From factory vetting to last-mile delivery, we handle it all.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {ways.map((w) => (
              <div key={w.title} className="bg-white rounded-xl border border-border-soft p-5 text-center shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5">
                <div className="w-10 h-10 mx-auto rounded-full bg-action-blue/10 flex items-center justify-center mb-3">
                  <w.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-[14px] font-bold text-text-primary">{w.title}</h3>
                <p className="mt-1.5 text-[13px] text-text-muted leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book a Strategy Call */}
      <section className="bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border-soft shadow-soft">
            {/* Background image */}
            <Image
              src="/images/photo-1521737604893-d14cc237f11d.jpg"
              alt="Team strategy meeting"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40" />
            <div className="relative grid lg:grid-cols-[1fr_320px] gap-8 items-center p-8 lg:p-10">
              <div className="max-w-[520px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-action-blue/10 text-action-blue text-[11px] font-bold tracking-wider uppercase mb-4">
                  Schedule a Call
                </span>
                <h2 className="text-[26px] font-bold leading-tight text-text-primary">Book a free strategy call</h2>
                <p className="mt-2 text-[15px] text-text-muted leading-relaxed">
                  Speak with a fulfillment expert to discuss your needs and get a customized solution for your business.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {strategyBullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-teal shrink-0" />
                      <span className="text-[14px] text-text-body">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right card */}
              <div className="rounded-xl bg-white border border-border-soft p-6 shadow-card">
                <Calendar className="w-7 h-7 text-action-blue" />
                <h3 className="mt-3 text-[17px] font-bold text-text-primary leading-tight">
                  Find a time that works for you
                </h3>
                <p className="mt-2 text-[13px] text-text-muted leading-relaxed">
                  Choose a convenient time and connect with our team.
                </p>
                <Link
                  href="/book-a-demo"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-navy rounded-lg hover:bg-deep-navy transition-all"
                >
                  Book a Call <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-10">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[28px] font-bold text-text-primary text-center mb-6">Frequently asked questions</h2>
          <ContactFaq />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep-navy">
        <div className="max-w-[700px] mx-auto px-6 py-14 text-center">
          <h2 className="text-[32px] font-bold leading-tight text-white">
            Ready to scale your fulfillment?
          </h2>
          <p className="mt-3 text-[16px] text-text-on-dark-muted">
            Let&apos;s build a smarter, faster, more reliable supply chain—together.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold bg-white text-navy rounded-[10px] hover:shadow-soft transition-all"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
