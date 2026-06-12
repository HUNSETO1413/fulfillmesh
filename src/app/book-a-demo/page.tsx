"use client";

import Image from "next/image";
import {
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import FinalCTA from "@/components/FinalCTA";

const testimonials = [
  { quote: "FulfillMesh transformed our logistics. Their team is incredible!", name: "Sarah Chen", role: "CEO, TechStart", avatar: "/images/photo-1494790108377-be9c29b29330.jpg" },
  { quote: "Saved us 30% on shipping costs. Highly recommend!", name: "Mike Rodriguez", role: "COO, RetailHub", avatar: "/images/photo-1507003211169-0a1dd7228f2d.jpg" },
  { quote: "Sustainable and efficient. Perfect for our brand.", name: "Emily Watson", role: "Founder, EcoGoods", avatar: "/images/photo-1544005313-94ddf0286df2.jpg" },
];

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-3 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue transition-colors";

export default function BookDemoPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/10 text-navy text-xs font-semibold uppercase tracking-wider mb-5">
            <Calendar className="w-3.5 h-3.5" /> Book a Demo
          </span>
          <h1 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-text-primary">
            Book your fulfillment strategy demo
          </h1>
          <p className="mt-5 text-[17px] text-text-muted leading-relaxed max-w-[560px] mx-auto">
            Schedule a personalized demo to see how we can optimize your fulfillment operations
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Form Card */}
            <div className="rounded-2xl border border-border-soft p-8 shadow-soft">
              <h2 className="text-xl font-bold text-navy mb-6">Schedule your demo</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">First Name</label>
                  <input type="text" placeholder="Enter your first name" className={inputBase} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Last Name</label>
                  <input type="text" placeholder="Enter your last name" className={inputBase} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
                <input type="email" placeholder="Enter your email address" className={inputBase} />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-1.5">Company Name</label>
                <input type="text" placeholder="Enter your company name" className={inputBase} />
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" className={inputBase} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Company Size</label>
                  <select className={`${inputBase} text-text-muted`}>
                    <option>Select company size</option>
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>200+ employees</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-1.5">Industry</label>
                <select className={`${inputBase} text-text-muted`}>
                  <option>Select industry</option>
                  <option>E-commerce</option>
                  <option>Retail</option>
                  <option>Manufacturing</option>
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Other</option>
                </select>
              </div>
              <button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                Schedule demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="rounded-2xl border border-border-soft p-6 shadow-soft">
                <h3 className="text-[20px] font-bold text-text-primary mb-2">Get in touch</h3>
                <p className="text-[14px] text-text-muted mb-6">We&apos;d love to hear from you.</p>
                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-action-blue" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-text-primary">Phone</p>
                      <p className="text-[14px] text-text-body">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-action-blue" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-text-primary">Email</p>
                      <p className="text-[14px] text-text-body">demo@fulfillmesh.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-action-blue" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-text-primary">Location</p>
                      <p className="text-[14px] text-text-body">123 Business St, Suite 400<br />New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why book a demo card */}
              <div className="rounded-2xl border border-border-soft p-6 bg-teal/5">
                <h3 className="text-[18px] font-bold text-text-primary mb-3">Why book a demo?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-[14px] text-text-body">Personalized walkthrough of the platform</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-[14px] text-text-body">Custom pricing for your volume</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-[14px] text-text-body">Free supply chain assessment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-[14px] text-text-body">No commitment required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[32px] font-bold text-text-primary text-center mb-12">What our clients say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-border-soft p-6 shadow-soft">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[15px] text-text-body leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 pt-4 border-t border-border-soft flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border-2 border-border-blue"
                  />
                  <div>
                    <p className="text-[15px] font-semibold text-text-primary">{t.name}</p>
                    <p className="text-[13px] text-text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <FinalCTA
        headline="Ready to transform your fulfillment?"
        subtitle="Start your free demo today and see the difference"
        primaryText="Get Started"
        primaryHref="/book-a-demo"
      />
    </main>
  );
}
