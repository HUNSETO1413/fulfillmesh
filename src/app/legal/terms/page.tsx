import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Read the FulfillMesh Terms of Service governing your use of our platform, website, and fulfillment services, including user responsibilities, fees, intellectual property, and liability.",
  path: "/legal/terms",
  keywords: [
    "FulfillMesh terms of service",
    "terms and conditions",
    "user agreement",
    "service terms",
    "fulfillment platform terms",
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
    <rect x="70" y="30" width="120" height="150" rx="10" fill="#EAF1FB" />
    <rect x="88" y="54" width="84" height="8" rx="4" fill="#C9DBF3" />
    <rect x="88" y="74" width="84" height="8" rx="4" fill="#C9DBF3" />
    <rect x="88" y="94" width="60" height="8" rx="4" fill="#C9DBF3" />
    <rect x="88" y="114" width="84" height="8" rx="4" fill="#DCE8F8" />
    <rect x="88" y="134" width="50" height="8" rx="4" fill="#DCE8F8" />
    {/* shield */}
    <path d="M210 60c0 0 26-12 38-18 12 6 38 18 38 18v28c0 30-22 50-38 58-16-8-38-28-38-58z" fill="#0057D8" />
    <path d="M232 96l10 10 20-22" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* teal check badge */}
    <circle cx="116" cy="166" r="16" fill="#00B894" />
    <path d="M109 166l5 5 9-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const sections: LegalSection[] = [
  {
    id: "acceptance",
    navLabel: "Acceptance of Terms",
    title: "Acceptance of Terms",
    icon: icon(<><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>),
    body: (
      <p>
        By accessing or using the FulfillMesh platform, website, or services (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of Service and our Privacy Policy.
      </p>
    ),
  },
  {
    id: "services",
    navLabel: "Services",
    title: "Services",
    icon: icon(<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>),
    body: (
      <p>
        FulfillMesh provides end-to-end fulfillment solutions including supplier matching, quality control, packaging, shipping, and warehousing. The specific services available may vary by region.
      </p>
    ),
  },
  {
    id: "user-responsibilities",
    navLabel: "User Responsibilities",
    title: "User Responsibilities",
    icon: icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>),
    body: (
      <p>
        You agree to provide accurate information, maintain the security of your account, and use our services only for lawful purposes. You are responsible for all activities under your account.
      </p>
    ),
  },
  {
    id: "fees-payment",
    navLabel: "Fees and Payment",
    title: "Fees and Payment",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M14.5 9a2.5 2.5 0 0 0-2.5-1.5c-1.4 0-2.5.9-2.5 2s1.1 2 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2A2.5 2.5 0 0 1 9.5 15M12 6v1.5M12 16.5V18" /></>),
    body: (
      <p>
        All fees are listed in USD and are non-refundable unless otherwise stated. You agree to pay all applicable fees for the services you use.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    navLabel: "Intellectual Property",
    title: "Intellectual Property",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5a3 3 0 1 0 0 5" /></>),
    body: (
      <p>
        All content, trademarks, and materials on our platform are owned by FulfillMesh or our licensors and are protected by applicable laws.
      </p>
    ),
  },
  {
    id: "limitation-liability",
    navLabel: "Limitation of Liability",
    title: "Limitation of Liability",
    icon: icon(<><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /></>),
    body: (
      <p>
        FulfillMesh is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid by you in the past 12 months.
      </p>
    ),
  },
  {
    id: "termination",
    navLabel: "Termination",
    title: "Termination",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M8 8l8 8" /></>),
    body: (
      <p>
        We may suspend or terminate your account or access to our services at any time, with or without cause or notice, if we believe you have violated these Terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    navLabel: "Governing Law",
    title: "Governing Law",
    icon: icon(<><path d="M12 3v18M5 7l7-3 7 3M5 7l-2 6a4 4 0 0 0 8 0L9 7M19 7l-2 6a4 4 0 0 0 8 0l-2-6" /></>),
    body: (
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the People&apos;s Republic of China, without regard to its conflict of law principles.
      </p>
    ),
  },
  {
    id: "changes",
    navLabel: "Changes to Terms",
    title: "Changes to Terms",
    icon: icon(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>),
    body: (
      <p>
        We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on this page and updating the &ldquo;Last updated&rdquo; date.
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
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:legal@fulfillmesh.com" className="text-[#3182CE] hover:underline">legal@fulfillmesh.com</a>{" "}
        or through our <a href="/resources" className="text-[#3182CE] hover:underline">Help Center</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      lastUpdated="May 12, 2025"
      intro={
        <>Welcome to FulfillMesh. By accessing or using our website, platform, or services, you agree to be bound by these Terms of Service.</>
      }
      heroIllustration={<HeroIllustration />}
      contactTitle="Questions about these terms?"
      contactText="Our support team is here to help."
      sections={sections}
    />
  );
}
