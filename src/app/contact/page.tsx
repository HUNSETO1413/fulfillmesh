"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail, MapPin, ChevronDown, ArrowRight, Clock, Calendar,
  CheckCircle, MessageCircle, Globe, Search, ShieldCheck,
  Package, Truck, Warehouse,
} from "lucide-react";

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

const faqs = [
  { q: "Do you work with businesses of all sizes?", a: "Yes, we work with businesses of all sizes — from startups just launching their first product to established brands shipping thousands of orders per month. Our solutions are designed to scale with your growth." },
  { q: "Where are your warehouses located?", a: "Our main fulfillment centers are located in Shenzhen and Guangzhou, China, with additional partner warehouses in the US, Europe, and Southeast Asia for global distribution." },
  { q: "How do you ensure product quality?", a: "We conduct rigorous on-site inspections at every stage — from pre-production checks to final random inspections before shipping, ensuring your products meet your specifications." },
  { q: "What if I need help after onboarding?", a: "Our dedicated support team is available to assist you at every step. You can reach us via email, WhatsApp, or schedule a call with your account manager anytime." },
];

const inputBase = "w-full rounded-lg border border-border-soft bg-white px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue transition-colors";

export default function ContactPage() {
  const [open, setOpen] = useState<number | null>(null);

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
            <div className="rounded-xl border border-border-soft p-6 shadow-soft">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter your full name" className={inputBase} />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Work Email <span className="text-red-500">*</span></label>
                  <input type="email" placeholder="name@company.com" className={inputBase} />
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Company <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Your company name" className={inputBase} />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Website</label>
                  <input type="url" placeholder="https://yourwebsite.com" className={inputBase} />
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Monthly Order Volume <span className="text-red-500">*</span></label>
                  <select className={inputBase + " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239AA8B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"}>
                    <option>Select volume</option>
                    <option>Under 100</option>
                    <option>100 - 500</option>
                    <option>500 - 2,000</option>
                    <option>2,000 - 10,000</option>
                    <option>10,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Target Markets <span className="text-red-500">*</span></label>
                  <select className={inputBase + " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239AA8B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"}>
                    <option>Select markets</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia Pacific</option>
                    <option>Global</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Services Needed <span className="text-red-500">*</span></label>
                <select className={inputBase + " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239AA8B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"}>
                  <option>Select services</option>
                  <option>Sourcing & Supplier Vetting</option>
                  <option>Quality Control</option>
                  <option>Warehousing & Fulfillment</option>
                  <option>Shipping & Logistics</option>
                  <option>Full-Service Solution</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Tell us more about your needs</label>
                <textarea rows={3} placeholder="Share details about your products, goals, timeline, or any challenges you're facing..." className={inputBase} />
              </div>
              <button className="mt-5 w-full inline-flex items-center justify-center gap-2 px-8 py-3 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                Submit <ArrowRight className="w-4 h-4" />
              </button>
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
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-border-soft overflow-hidden transition-all">
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-[14px] font-medium text-text-primary">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && (
                  <p className="px-5 pb-4 text-[13px] text-text-body leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
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

