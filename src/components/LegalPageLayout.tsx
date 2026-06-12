import type { ReactNode } from "react";

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
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-12 flex items-center justify-between gap-10">
          <div className="max-w-[560px]">
            <h1 className="text-[40px] leading-[1.15] font-bold text-deep-navy tracking-[-0.02em]">
              {title}
              {titleSuffix && (
                <span className="text-text-light font-bold"> {titleSuffix}</span>
              )}
            </h1>
            <p className="mt-3 text-[14px] text-text-muted leading-[1.4]">
              Last updated: {lastUpdated}
            </p>
            <p className="mt-4 text-[17px] text-text-body leading-[1.6]">{intro}</p>
          </div>
          <div className="shrink-0 hidden md:flex items-center justify-center">
            {heroIllustration}
          </div>
        </div>
      </section>

      {/* ===== Body: sidebar + sections ===== */}
      <section>
        <div className="max-w-[1200px] mx-auto px-6 py-12 flex gap-12">
          {/* Sidebar */}
          <aside className="w-[260px] shrink-0 hidden lg:block">
            <div className="sticky top-28">
              <nav className="space-y-0.5">
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`block rounded-lg px-4 py-2.5 text-[14px] leading-[1.4] transition-colors ${
                      i === 0
                        ? "bg-[#EAF1FB] text-action-blue font-semibold"
                        : "text-text-body hover:bg-soft-bg hover:text-deep-navy"
                    }`}
                  >
                    {i + 1}. {s.navLabel}
                  </a>
                ))}
              </nav>

              {/* Contact card */}
              <div className="mt-8 rounded-xl border border-border-soft bg-white p-5 shadow-card">
                <div className="flex items-start gap-2.5">
                  <span className="text-action-blue mt-0.5" aria-hidden>
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
                  <span className="text-[15px] font-semibold text-deep-navy leading-[1.35]">
                    {contactTitle}
                  </span>
                </div>
                <p className="mt-2.5 text-[13px] text-text-body leading-[1.55]">
                  {contactText}
                </p>
                <a
                  href="/contact"
                  className="mt-4 inline-flex items-center justify-center w-full rounded-md border border-border-blue bg-white px-4 py-2.5 text-[14px] font-semibold text-action-blue transition-colors hover:bg-soft-bg"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </aside>

          {/* Sections */}
          <div className="flex-1 min-w-0 space-y-10">
            {sections.map((s, i) => (
              <div key={s.id} id={s.id} className="scroll-mt-28">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FB] text-action-blue">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[22px] font-bold text-deep-navy leading-[1.25]">
                      {i + 1}. {s.title}
                    </h2>
                    <div className="mt-2.5 text-[15px] text-text-body leading-[1.7] space-y-3">
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
  );
}
