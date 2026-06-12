import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface LegalSection {
  /** Anchor id, e.g. "acceptance" */
  id: string;
  /** Short label shown in the sidebar table of contents */
  navLabel: string;
  /** Full section heading shown next to the icon */
  title: string;
  /** Section body — string or rich JSX */
  body: ReactNode;
  /** Icon glyph rendered inside the rounded square */
  icon: ReactNode;
}

interface LegalPageProps {
  title: string;
  /** Optional muted suffix appended after the title, e.g. "(DPA)" */
  titleSuffix?: string;
  lastUpdated: string;
  intro: ReactNode;
  /** Decorative hero illustration shown on the right of the header */
  heroIllustration: ReactNode;
  /** Sidebar contact-card heading, e.g. "Questions about these terms?" */
  contactTitle: string;
  /** Sidebar contact-card supporting line */
  contactText: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  title,
  titleSuffix,
  lastUpdated,
  intro,
  heroIllustration,
  contactTitle,
  contactText,
  sections,
}: LegalPageProps) {
  return (
    <>
      <Header />
      <div className="bg-white">
        {/* ===== Hero ===== */}
        <section className="border-b border-[#E2E8F0]">
        <div className="max-w-[1120px] mx-auto px-10 py-10 flex items-center justify-between gap-10">
          <div className="max-w-[560px]">
            <h1 className="text-[40px] leading-[1.2] font-bold text-[#2D3748] tracking-[-0.02em]">
              {title}
              {titleSuffix && (
                <span className="text-[#9AA8B8] font-bold"> {titleSuffix}</span>
              )}
            </h1>
            <div className="mt-3 inline-flex items-center rounded-full bg-[#F3F4F6] px-3 py-1">
              <span className="text-xs text-[#6B7280] leading-[1.4]">
                Last updated: {lastUpdated}
              </span>
            </div>
            <p className="mt-4 text-[18px] text-[#4A5568] leading-[1.6]">{intro}</p>
          </div>
          <div
            className="shrink-0 flex items-center justify-center rounded-2xl bg-[#EDF3FE]/60 px-6 py-4"
            style={{ display: "flex" }}
          >
            {heroIllustration}
          </div>
        </div>
      </section>

      {/* ===== Body: sidebar + sections ===== */}
      <section>
        <div className="max-w-[1120px] mx-auto px-10 py-14 flex gap-12">
          {/* Sidebar */}
          <aside className="w-[240px] shrink-0" style={{ display: "block" }}>
            <div className="sticky top-28">
              <nav className="space-y-1">
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      i === 0
                        ? "bg-[#EDF2F7] text-[#2D3748] font-semibold"
                        : "text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#2D3748]"
                    }`}
                  >
                    <span className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      i === 0
                        ? "bg-[#3182CE] text-white"
                        : "bg-[#E2E8F0] text-[#4A5568]"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="leading-[1.4]">{s.navLabel}</span>
                  </a>
                ))}
              </nav>

              {/* Contact card */}
              <div className="mt-8 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-5">
                <div className="flex items-center gap-2">
                  <span className="text-[#3182CE]" aria-hidden>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-[#2D3748] leading-[1.4]">
                    {contactTitle}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#4A5568] leading-relaxed">
                  {contactText}
                </p>
                <a
                  href="/contact"
                  className="mt-4 inline-flex items-center justify-center w-full rounded-md bg-[#3182CE] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2C5282]"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </aside>

          {/* Sections */}
          <div className="flex-1 min-w-0 space-y-6">
            {sections.map((s, i) => (
              <div
                key={s.id}
                id={s.id}
                className="scroll-mt-28 rounded-lg border border-[#E2E8F0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDF2F7] text-[#3182CE]">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-[#2D3748] leading-[1.2]">
                      {i + 1}. {s.title}
                    </h2>
                    <div className="mt-3 text-base text-[#4A5568] leading-[1.6] space-y-3">
                      {s.body}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}
