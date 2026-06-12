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
  "Find a time that works for you",
  "Choose a convenient time and connect with an expert",
];

export default function ContactPage() {
  return (
    <main>
      {/* Hero Heading */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-bg text-text-primary text-xs font-semibold tracking-wide mb-4">
            <MapPin className="w-3.5 h-3.5" /> Contact Us
          </span>
          <h1 className="text-[36px] lg:text-[44px] font-bold leading-[1.15] tracking-tight text-text-primary">
            Talk to the FulfillMesh team
          </h1>
          <p className="mt-3 text-[16px] text-text-muted leading-[1.6] max-w-[540px] mx-auto">
            Have questions or ready to scale your fulfillment? We&apos;re here to help you find the right China-powered solution for your brand.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-12">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Form Card */}
            <ContactForm />

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
                <div className="h-[100px] rounded-lg bg-soft-bg overflow-hidden relative">
                  <Image
                    src="/images/worldmap.png"
                    alt="Global network map"
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
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
          <div className="rounded-xl border border-border-soft p-8 shadow-soft">
            <div className="max-w-[600px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-action-blue/10 text-action-blue text-[12px] font-semibold mb-4">
                Schedule a Call
              </span>
              <h2 className="text-[24px] font-bold leading-tight text-text-primary">Book a free strategy call</h2>
              <p className="mt-2 text-[15px] text-text-muted leading-relaxed">
                Speak with a fulfillment expert to discuss your needs and get a customized solution for your business.
              </p>
              <ul className="mt-4 space-y-2">
                {strategyBullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{bullet}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/book-a-demo"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-navy rounded-lg hover:bg-deep-navy transition-all"
              >
                Book a Call <ArrowRight className="w-4 h-4" />
              </Link>
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
            Start your journey with FulfillMesh today.
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
