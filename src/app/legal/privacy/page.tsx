import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how FulfillMesh collects, uses, shares, and protects your personal data. Read our Privacy Policy covering information collection, data security, your rights, cookies, and more.",
  path: "/legal/privacy",
  keywords: [
    "FulfillMesh privacy policy",
    "data protection",
    "personal data",
    "privacy practices",
    "GDPR",
  ],
});

const icon = (path: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const HeroIllustration = () => (
  <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 320, height: 200, flexShrink: 0 }}>
    {/* document */}
    <rect x="60" y="34" width="120" height="140" rx="10" fill="#EAF1FB" />
    <circle cx="90" cy="62" r="12" fill="#C9DBF3" />
    <rect x="78" y="92" width="84" height="8" rx="4" fill="#C9DBF3" />
    <rect x="78" y="112" width="84" height="8" rx="4" fill="#DCE8F8" />
    <rect x="78" y="132" width="56" height="8" rx="4" fill="#DCE8F8" />
    {/* shield with checkmark */}
    <path d="M200 50c0 0 28-13 40-19 12 6 40 19 40 19v30c0 32-23 53-40 61-17-8-40-29-40-61z" fill="#3182CE" />
    <path d="M222 86l10 10 20-22" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* teal check badge */}
    <circle cx="108" cy="160" r="16" fill="#38A169" />
    <path d="M101 160l5 5 9-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const sections: LegalSection[] = [
  {
    id: "introduction",
    navLabel: "Introduction",
    title: "Introduction",
    icon: icon(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
    body: (
      <p>
        FulfillMesh Co. (&ldquo;FulfillMesh,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.
      </p>
    ),
  },
  {
    id: "info-we-collect",
    navLabel: "Information We Collect",
    title: "Information We Collect",
    icon: icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>),
    body: (
      <p>
        We collect information you provide directly to us, such as your name, email address, company information, and any other details you submit. We also collect data automatically when you use our platform, including device information, usage data, and cookies.
      </p>
    ),
  },
  {
    id: "how-we-use",
    navLabel: "How We Use Information",
    title: "How We Use Information",
    icon: icon(<><path d="M4 19V10M9 19V5M14 19v-6M19 19V8" /></>),
    body: (
      <p>
        We use your information to provide and improve our services, process transactions, communicate with you, personalize your experience, and ensure the security of our platform.
      </p>
    ),
  },
  {
    id: "info-sharing",
    navLabel: "Information Sharing",
    title: "Information Sharing",
    icon: icon(<><circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M8.6 10.6l6.8-3.2M8.6 13.4l6.8 3.2" /></>),
    body: (
      <p>
        We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our business, complying with legal obligations, or protecting our rights.
      </p>
    ),
  },
  {
    id: "data-security",
    navLabel: "Data Security",
    title: "Data Security",
    icon: icon(<><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></>),
    body: (
      <p>
        We implement industry-standard technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
      </p>
    ),
  },
  {
    id: "your-rights",
    navLabel: "Your Rights",
    title: "Your Rights",
    icon: icon(<><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1" /><path d="M17 11l2 2 4-4" /></>),
    body: (
      <p>
        You have the right to access, update, correct, or delete your personal information. You may also object to or restrict certain processing of your data. Contact us to exercise your rights.
      </p>
    ),
  },
  {
    id: "cookies",
    navLabel: "Cookies",
    title: "Cookies",
    icon: icon(<><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="1" /><circle cx="14" cy="9" r="1" /><circle cx="15" cy="14" r="1" /><circle cx="10" cy="15" r="1" /></>),
    body: (
      <p>
        We use cookies and similar technologies to enhance your experience, analyze site traffic, and understand user behavior. You can manage your cookie preferences in your browser settings.
      </p>
    ),
  },
  {
    id: "third-party-links",
    navLabel: "Third-Party Links",
    title: "Third-Party Links",
    icon: icon(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
    body: (
      <p>
        Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    navLabel: "Children's Privacy",
    title: "Children's Privacy",
    icon: icon(<><circle cx="12" cy="7" r="4" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></>),
    body: (
      <p>
        Our services are not directed to children under the age of 16. We do not knowingly collect personal information from children. If we have collected such data, we will delete it promptly.
      </p>
    ),
  },
  {
    id: "changes",
    navLabel: "Changes to Policy",
    title: "Changes to Policy",
    icon: icon(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>),
    body: (
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
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
        If you have any questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:privacy@fulfillmesh.com" className="text-[#3182CE] hover:underline">privacy@fulfillmesh.com</a>{" "}
        or through our <a href="/resources" className="text-[#3182CE] hover:underline">Help Center</a>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="May 12, 2025"
      intro={
        <>Your privacy is important to us. This Privacy Policy explains how FulfillMesh collects, uses, shares, and protects your personal information.</>
      }
      heroIllustration={<HeroIllustration />}
      contactTitle="Questions?"
      contactText="Have questions about our privacy practices? Contact our Data Protection Officer."
      sections={sections}
    />
  );
}
