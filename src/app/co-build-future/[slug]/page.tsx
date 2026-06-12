import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CheckCircle2, Target, Eye, Heart, Globe2,
  Rocket, Users, TrendingUp, Laptop, Wallet, HeartPulse, CalendarClock, GraduationCap, Plane,
  ClipboardList, UsersRound, FileCheck2, Handshake,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

// Humanize a URL slug into a readable title for metadata.
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: `${titleFromSlug(slug)} | Careers at FulfillMesh`,
    description:
      "Join FulfillMesh and help build the future of global fulfillment. Explore our mission, culture, benefits, open roles, and hiring process across a remote-first team.",
    path: `/co-build-future/${slug}`,
    keywords: ["FulfillMesh careers", "fulfillment jobs", "remote-first team", "supply chain careers"],
  });
}

const heroBadges = [
  { label: "Global Impact", style: "bg-[#E0F7FA] text-[#00695C]" },
  { label: "Ownership & Growth", style: "bg-[#E3F2FD] text-navy" },
  { label: "Diverse & Inclusive", style: "bg-[#F0F0F0] text-[#424242]" },
];

/* face crops used for the hero avatar network */
const FACE = (id: string) => `/images/${id}.jpg`;

/* HERO_W × HERO_H coordinate space for the world-map illustration */
const HERO_W = 960;
const HERO_H = 380;

/* avatar nodes distributed across the world map (coords in the HERO_W×HERO_H space) */
const AVATARS: { pt: [number, number]; size: number; src: string }[] = [
  { pt: [150, 150], size: 58, src: FACE("photo-1500648767791-00dcc994a43e") },  // N. America
  { pt: [330, 95], size: 46, src: FACE("photo-1544005313-94ddf0286df2") },      // Europe (top)
  { pt: [445, 205], size: 50, src: FACE("photo-1507003211169-0a1dd7228f2d") },  // Africa
  { pt: [675, 130], size: 64, src: FACE("photo-1438761681033-6461ffad8d80") },  // Asia (center)
  { pt: [840, 270], size: 46, src: FACE("photo-1494790108377-be9c29b29330") },  // Oceania
  { pt: [225, 300], size: 48, src: FACE("photo-1519345182560-3f2917c472ef") },  // S. America
  { pt: [575, 300], size: 42, src: FACE("photo-1454165804606-c3d57bc86b40") },  // S. region
];

/* links between avatar indices forming the global network */
const AVATAR_LINKS: [number, number][] = [
  [0, 1], [1, 3], [3, 4], [0, 5], [5, 2], [2, 3], [3, 6], [1, 2], [6, 4],
];

/* sparse dot grid shaped into a rough world-map silhouette */
const WORLD_DOTS: [number, number][] = (() => {
  const dots: [number, number][] = [];
  // crude continental band masks in the HERO_W×HERO_H space [x0,x1,y0,y1]
  const bands: [number, number, number, number][] = [
    [70, 290, 90, 220],    // N. America
    [165, 280, 220, 330],  // S. America
    [305, 380, 75, 150],   // Europe
    [375, 510, 150, 320],  // Africa
    [520, 800, 85, 240],   // Asia
    [770, 880, 245, 320],  // Oceania
  ];
  for (let x = 50; x <= 910; x += 22) {
    for (let y = 65; y <= 335; y += 22) {
      const jx = ((x * 7 + y * 3) % 9) - 4;
      const jy = ((x * 3 + y * 5) % 9) - 4;
      const inside = bands.some(([x0, x1, y0, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1);
      if (inside) dots.push([x + jx, y + jy]);
    }
  }
  return dots;
})();

const values = [
  { icon: Target, title: "Our Mission", items: ["Empower brands to scale globally through trusted fulfillment networks and technology."] },
  { icon: Eye, title: "Our Vision", items: ["A world where global fulfillment is transparent, efficient, and sustainable for everyone."] },
  { icon: Heart, title: "Our Values", items: ["Customer Obsession", "Integrity & Transparency", "Ownership & Accountability", "Continuous Improvement"] },
  { icon: Globe2, title: "Our Impact", stats: [{ value: "250+", label: "Employees" }, { value: "10+", label: "Years" }, { value: "50+", label: "Countries" }] },
];

const lifeCards = [
  { icon: Rocket, title: "Meaningful Work", desc: "Solve real problems for thousands of brands and help shape the future of global commerce." },
  { icon: Users, title: "Inclusive Culture", desc: "We celebrate diverse perspectives and create an environment where everyone belongs." },
  { icon: TrendingUp, title: "Grow Together", desc: "Learn, share, and grow with incredible teammates and mentors around the world." },
  { icon: Laptop, title: "Work Your Way", desc: "Enjoy flexible work arrangements that help you do your best work, where you work best." },
  { icon: Globe2, title: "Global Team", desc: "Collaborate across time zones and cultures to make a global impact every day." },
];

const perks = [
  { icon: Wallet, title: "Competitive Pay", desc: "Fair compensation and performance bonuses." },
  { icon: HeartPulse, title: "Health & Wellness", desc: "Comprehensive medical, dental, and vision coverage." },
  { icon: CalendarClock, title: "Flexible Work", desc: "Remote-first with flexible hours and time off." },
  { icon: GraduationCap, title: "Learning Budget", desc: "Annual budget for courses, certifications, and events." },
  { icon: Plane, title: "Global Offsites", desc: "Connect in person and celebrate our wins." },
];

const tagStyles: Record<string, string> = {
  Engineering: "bg-[#E3F2FD] text-navy",
  Product: "bg-[#E3F2FD] text-navy",
  "Customer Success": "bg-[#E3F2FD] text-navy",
  "Business Development": "bg-[#E3F2FD] text-navy",
  Data: "bg-[#E3F2FD] text-navy",
};

const positions = [
  { title: "Senior Backend Engineer", tag: "Engineering", location: "Shenzhen, China (Remote)", type: "Full-time" },
  { title: "Product Manager", tag: "Product", location: "Singapore (Remote)", type: "Full-time" },
  { title: "Customer Success Manager", tag: "Customer Success", location: "Shanghai, China (Hybrid)", type: "Full-time" },
  { title: "Partnerships Manager", tag: "Business Development", location: "Hong Kong (Remote)", type: "Full-time" },
  { title: "Data Analyst", tag: "Data", location: "Shenzhen, China (Remote)", type: "Full-time" },
];

const hiring = [
  { icon: ClipboardList, title: "Apply", desc: "Submit your application and tell us about your experience." },
  { icon: UsersRound, title: "Interview", desc: "Meet the team and learn more about the role and our mission." },
  { icon: FileCheck2, title: "Assess", desc: "Complete a practical assessment or case related to the role." },
  { icon: Handshake, title: "Offer", desc: "We'll make an offer and welcome you to the FulfillMesh team." },
];

export default function CoBuildFutureDetailPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-white border-b border-border-soft overflow-hidden">
        {/* full-width faint dotted world map with the global team network */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 max-w-[1280px] mx-auto">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${HERO_W} ${HERO_H}`}
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* dotted continents */}
              {WORLD_DOTS.map(([x, y], i) => (
                <circle key={`d${i}`} cx={x} cy={y} r="2.1" fill="#C9D8EA" />
              ))}
              {/* network lines connecting avatar nodes */}
              {AVATAR_LINKS.map(([a, b], i) => {
                const p1 = AVATARS[a].pt; const p2 = AVATARS[b].pt;
                return (
                  <line key={`l${i}`} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
                    stroke="#00B894" strokeWidth="1.6" strokeDasharray="5 6" opacity="0.45" />
                );
              })}
            </svg>
            {/* avatar photos placed across the map */}
            {AVATARS.map((a, i) => (
              <span
                key={`a${i}`}
                className="absolute rounded-full border-[3px] border-white shadow-card overflow-hidden -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(a.pt[0] / HERO_W) * 100}%`, top: `${(a.pt[1] / HERO_H) * 100}%`, width: a.size, height: a.size }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt="FulfillMesh team member" className="w-full h-full object-cover" />
              </span>
            ))}
          </div>
          {/* fade the map behind the headline so copy stays legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-10 py-20 lg:py-28">
          <div className="max-w-[560px]">
            <h1 className="text-[36px] lg:text-[48px] font-bold text-deep-navy leading-[1.1] tracking-tight">
              Build the future of global fulfillment <span className="gradient-text-teal">together.</span>
            </h1>
            <p className="mt-5 text-[18px] text-text-body leading-relaxed max-w-[480px]">
              At FulfillMesh, we connect brands with vetted fulfillment partners in China and around the world. Our mission is to make global commerce simpler, faster, and more transparent for businesses of all sizes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#open-positions" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-lg bg-navy hover:bg-deep-navy transition-colors">
                View Open Positions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/company/about" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-navy rounded-lg border border-[#E3F2FD] bg-white hover:shadow-soft transition-all">
                Learn More About Us
              </Link>
            </div>
            {/* Hero badges as colored pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              {heroBadges.map((b) => (
                <span key={b.label} className={`inline-flex items-center gap-1.5 text-[13px] font-medium rounded-full px-3.5 py-1.5 ${b.style}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values / Impact */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-10 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-soft transition-all">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-deep-navy mb-2">{v.title}</h3>
                {v.items && (
                  <ul className="space-y-1.5">
                    {v.items.map((it) => (
                      <li key={it} className="text-[14px] text-text-body leading-relaxed">{it}</li>
                    ))}
                  </ul>
                )}
                {v.stats && (
                  <div className={`grid gap-3 mt-1 ${v.stats.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                    {v.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-[24px] font-bold text-action-blue leading-none">{s.value}</p>
                        <p className="mt-1 text-[12px] text-text-muted leading-tight">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at FulfillMesh */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-10 py-20">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-deep-navy">Life at FulfillMesh</h2>
            <p className="mt-3 text-[16px] text-text-body max-w-[520px] mx-auto leading-relaxed">
              Join a team that values innovation, collaboration, and making a real impact on global commerce.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-5">
            {lifeCards.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-[#E2E8F0] p-6 text-center hover:shadow-soft transition-all">
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
                  <c.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-[16px] font-semibold text-deep-navy mb-2">{c.title}</h3>
                <p className="text-[14px] text-text-body leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="bg-[#F8F9FA]">
        <div className="max-w-[1200px] mx-auto px-10 py-20">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-deep-navy">Benefits &amp; Perks</h2>
            <p className="mt-3 text-[16px] text-text-body max-w-[520px] mx-auto leading-relaxed">
              We invest in our people with competitive benefits and a supportive work environment.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-5">
            {perks.map((p) => (
              <div key={p.title} className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-soft transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-4 h-4 text-teal" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-deep-navy">{p.title}</h3>
                </div>
                <p className="text-[14px] text-text-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="bg-white">
        <div className="max-w-[1200px] mx-auto px-10 py-20">
          <div className="mb-10">
            <h2 className="text-[28px] font-bold text-deep-navy">Open Positions</h2>
            <p className="mt-3 text-[16px] text-text-body">Find the role that fits your skills and passion.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-xl border border-[#E2E8F0] overflow-hidden bg-white">
              {/* Table header */}
              <div className="flex items-center gap-4 px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider min-w-[220px] flex-1">Role</span>
                <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider min-w-[180px]">Location</span>
                <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider min-w-[70px]">Type</span>
                <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider"></span>
              </div>
              {positions.map((p, i) => (
                <div
                  key={p.title}
                  className={`flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${i !== positions.length - 1 ? "border-b border-[#E2E8F0]" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-[220px] flex-1">
                    <span className="text-[14px] font-semibold text-deep-navy">{p.title}</span>
                    <span className={`text-[11px] font-semibold rounded-full px-2.5 py-0.5 ${tagStyles[p.tag] ?? "bg-[#E3F2FD] text-navy"}`}>
                      {p.tag}
                    </span>
                  </div>
                  <span className="text-[14px] text-text-muted min-w-[180px]">{p.location}</span>
                  <span className="text-[14px] text-text-muted min-w-[70px]">{p.type}</span>
                  <Link href="/contact" className="inline-flex items-center gap-1 text-[14px] font-semibold text-action-blue hover:gap-2 transition-all">
                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
            <aside className="rounded-xl bg-navy text-white p-7 flex flex-col justify-center">
              <h3 className="text-[18px] font-bold leading-snug">We&apos;re always looking for great people.</h3>
              <p className="mt-3 text-[14px] text-text-on-dark-soft leading-relaxed">
                Send us your resume and tell us how you can contribute.
              </p>
              <Link href="/contact" className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all w-fit">
                Submit Your Resume
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-10 py-20">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-deep-navy">Our Hiring Process</h2>
            <p className="mt-3 text-[16px] text-text-body max-w-[520px] mx-auto leading-relaxed">
              We keep our hiring process straightforward and transparent. Here&apos;s what to expect.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="grid grid-cols-2 gap-5">
              {hiring.map((h, i) => (
                <div key={h.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-action-blue text-white text-[13px] font-bold flex items-center justify-center">{i + 1}</div>
                    <h.icon className="w-5 h-5 text-action-blue" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-deep-navy">{h.title}</h3>
                  <p className="text-[14px] text-text-body leading-relaxed mt-1.5">{h.desc}</p>
                </div>
              ))}
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] shadow-card">
              <Image
                src="/images/photo-1521737604893-d14cc237f11d.jpg"
                alt="The FulfillMesh team collaborating"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8F9FA] pb-20">
        <div className="max-w-[1100px] mx-auto px-10">
          <div className="bg-navy rounded-2xl text-white text-center px-8 py-16">
            <h2 className="text-[28px] font-bold leading-tight">Ready to build the future with us?</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-soft">Join a global team that&apos;s making fulfillment smarter, faster, and more connected.</p>
            <div className="mt-8 flex justify-center">
              <Link href="#open-positions" className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-navy rounded-lg bg-white hover:bg-[#F0F4F8] transition-colors">
                View Open Positions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Remote-first", "Diverse team", "Global impact"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft">
                  <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
