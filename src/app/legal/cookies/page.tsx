import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";

const icon = (path: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const HeroIllustration = () => (
  <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 320, height: 200, flexShrink: 0 }}>
    {/* browser window card */}
    <rect x="30" y="34" width="170" height="130" rx="12" fill="#EAF1FB" />
    <rect x="30" y="34" width="170" height="22" rx="12" fill="#A9C7F2" />
    <circle cx="44" cy="45" r="3" fill="#fff" />
    <circle cx="56" cy="45" r="3" fill="#fff" />
    <circle cx="68" cy="45" r="3" fill="#fff" />
    {/* cookie */}
    <circle cx="125" cy="108" r="36" fill="#E0A95C" />
    <circle cx="112" cy="98" r="5" fill="#7A4E1E" />
    <circle cx="136" cy="93" r="4" fill="#7A4E1E" />
    <circle cx="140" cy="116" r="5" fill="#7A4E1E" />
    <circle cx="116" cy="120" r="4" fill="#7A4E1E" />
    <circle cx="127" cy="106" r="3" fill="#7A4E1E" />
    {/* teal check badge on cookie */}
    <circle cx="98" cy="136" r="16" fill="#00B894" />
    <path d="M91 136l5 5 9-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* green shield to the right */}
    <path
      d="M240 56l28 11v32c0 25-19 39-28 43-9-4-28-18-28-43V67z"
      fill="#00B894"
    />
    <path
      d="M228 100l9 9 17-19"
      stroke="#fff"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/* Cookie-type badge colors */
const cookieTypes = [
  {
    label: "Essential",
    color: "#4CAF50",
    bg: "#E8F5E9",
    description: "Necessary for the website to function and cannot be disabled.",
  },
  {
    label: "Performance",
    color: "#2196F3",
    bg: "#E3F2FD",
    description: "Help us understand how visitors interact with our site.",
  },
  {
    label: "Functional",
    color: "#FF9800",
    bg: "#FFF3E0",
    description: "Remember your preferences and provide enhanced features.",
  },
  {
    label: "Marketing",
    color: "#F44336",
    bg: "#FFEBEE",
    description: "Used to deliver relevant ads and track the effectiveness of our campaigns.",
  },
];

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    navLabel: "What Are Cookies",
    title: "What Are Cookies",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></>),
    body: (
      <p>
        Cookies are small text files that are placed on your device when you visit a website. They help the website remember your actions and preferences (such as login, language, and other display preferences) over a period of time.
      </p>
    ),
  },
  {
    id: "how-we-use",
    navLabel: "How We Use Cookies",
    title: "How We Use Cookies",
    icon: icon(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.46.6.99 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>),
    body: (
      <p>
        We use cookies to make our website work properly, improve your experience, analyze site traffic, personalize content, and support our marketing activities.
      </p>
    ),
  },
  {
    id: "types",
    navLabel: "Types of Cookies",
    title: "Types of Cookies",
    icon: icon(<><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></>),
    body: (
      <>
        <p>We use the following types of cookies:</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {cookieTypes.map((ct) => (
            <div
              key={ct.label}
              className="rounded-lg border border-[#E0E0E0] bg-white p-5 flex flex-col gap-3"
            >
              <span
                className="inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: ct.color }}
              >
                {ct.label}
              </span>
              <p className="text-sm text-[#4A5568] leading-[1.6]">{ct.description}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "managing",
    navLabel: "Managing Consent",
    title: "Managing Cookies",
    icon: icon(<><path d="M4 7h12M16 7h4M4 17h4M12 17h8" /><circle cx="14" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>),
    body: (
      <>
        <p>
          You can control and/or delete cookies as you wish. Most browsers allow you to block or delete cookies. However, blocking certain cookies may impact your experience on our website.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#3182CE] px-4 py-2.5 text-sm font-semibold text-[#3182CE] transition-colors hover:bg-[#3182CE] hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h12M16 7h4M4 17h8M16 17h4" /><circle cx="14" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
          Manage Cookie Preferences
        </a>
      </>
    ),
  },
  {
    id: "third-party",
    navLabel: "Third-Party Cookies",
    title: "Third-Party Cookies",
    icon: icon(<><circle cx="7" cy="7" r="3" /><circle cx="17" cy="17" r="3" /><path d="M10 7h4a3 3 0 0 1 3 3v4M14 17h-4a3 3 0 0 1-3-3v-4" /></>),
    body: (
      <p>
        We may allow third-party service providers to place cookies on your device to help us analyze traffic, deliver content, and provide social media features. These parties may collect information about your online activities over time and across different websites.
      </p>
    ),
  },
  {
    id: "changes",
    navLabel: "Changes to This Policy",
    title: "Changes to This Policy",
    icon: icon(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>),
    body: (
      <p>
        We may update this Cookie Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
      </p>
    ),
  },
  {
    id: "contact",
    navLabel: "Contact Us",
    title: "Contact Us",
    icon: icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
    body: (
      <p>
        If you have any questions about this Cookie Policy, please contact us at{" "}
        <a href="mailto:privacy@fulfillmesh.com" className="text-[#3182CE] hover:underline">privacy@fulfillmesh.com</a>{" "}
        or through our <a href="/resources" className="text-[#3182CE] hover:underline">Help Center</a>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated="May 12, 2025"
      intro={
        <>This Cookie Policy explains how FulfillMesh uses cookies and similar technologies on our website and platform.</>
      }
      heroIllustration={<HeroIllustration />}
      contactTitle="Questions about cookies?"
      contactText="We're here to help you manage your preferences."
      sections={sections}
    />
  );
}
