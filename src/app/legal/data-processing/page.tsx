import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Data Processing Agreement",
  description:
    "Review the FulfillMesh Data Processing Agreement (DPA) covering the processing of personal data, data security, sub-processors, data subject rights, breach notification, and international transfers.",
  path: "/legal/data-processing",
  keywords: [
    "FulfillMesh DPA",
    "data processing agreement",
    "data processor",
    "sub-processors",
    "data subject rights",
  ],
});

const icon = (path: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const HeroIllustration = () => (
  <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 320, height: 200, flexShrink: 0 }}>
    {/* document with folded corner */}
    <path d="M50 30h78l32 32v108a8 8 0 0 1-8 8H50a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z" fill="#EAF1FB" />
    <path d="M128 30l32 32h-32z" fill="#C9DBF3" />
    <rect x="62" y="74" width="84" height="8" rx="4" fill="#C9DBF3" />
    <rect x="62" y="94" width="84" height="8" rx="4" fill="#DCE8F8" />
    <rect x="62" y="114" width="60" height="8" rx="4" fill="#DCE8F8" />
    {/* standalone green check badge (between document and shield) */}
    <circle cx="160" cy="148" r="18" fill="#00B894" />
    <path d="M152 148l5 5 11-12" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* blue shield with lock */}
    <path d="M210 52c0 0 28-13 40-19 12 6 40 19 40 19v30c0 32-23 53-40 61-17-8-40-29-40-61z" fill="#0057D8" />
    <rect x="236" y="88" width="28" height="22" rx="4" fill="#fff" />
    <path d="M242 88v-5a8 8 0 0 1 16 0v5" stroke="#fff" strokeWidth="4" fill="none" />
    <circle cx="250" cy="98" r="3" fill="#0057D8" />
    {/* green confirmation mark on the shield */}
    <circle cx="282" cy="60" r="13" fill="#00B894" stroke="#fff" strokeWidth="3" />
    <path d="M276 60l4 4 8-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const sections: LegalSection[] = [
  {
    id: "definitions",
    navLabel: "Definitions",
    title: "Definitions",
    icon: icon(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
    body: (
      <p>
        &ldquo;Personal Data&rdquo; means any information relating to an identified or identifiable natural person. &ldquo;Processing&rdquo; means any operation performed on Personal Data, including collection, recording, organization, storage, adaptation, retrieval, use, disclosure, or deletion.
      </p>
    ),
  },
  {
    id: "processing",
    navLabel: "Processing of Personal Data",
    title: "Processing of Personal Data",
    icon: icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>),
    body: (
      <p>
        Processor shall process Personal Data only on documented instructions from Customer and for the purposes of providing the services set out in the agreement between the parties.
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
        Processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including protection against unauthorized or unlawful processing and accidental loss, destruction, or damage.
      </p>
    ),
  },
  {
    id: "sub-processors",
    navLabel: "Sub-Processors",
    title: "Sub-Processors",
    icon: icon(<><circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M8.6 10.6l6.8-3.2M8.6 13.4l6.8 3.2" /></>),
    body: (
      <p>
        Processor may engage sub-processors only with prior written authorization from Customer. Processor shall ensure that sub-processors are bound by data protection obligations no less protective than those in this DPA.
      </p>
    ),
  },
  {
    id: "data-subject-rights",
    navLabel: "Data Subject Rights",
    title: "Data Subject Rights",
    icon: icon(<><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1" /><path d="M17 11l2 2 4-4" /></>),
    body: (
      <p>
        Processor shall assist Customer in responding to data subject requests to access, rectify, erase, restrict, or object to the processing of Personal Data.
      </p>
    ),
  },
  {
    id: "data-breach",
    navLabel: "Data Breach Notification",
    title: "Data Breach Notification",
    icon: icon(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>),
    body: (
      <p>
        Processor shall notify Customer without undue delay after becoming aware of a Personal Data breach and provide all reasonable information to assist in addressing the breach.
      </p>
    ),
  },
  {
    id: "data-retention",
    navLabel: "Data Retention",
    title: "Data Retention",
    icon: icon(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>),
    body: (
      <p>
        Processor shall retain Personal Data only for as long as necessary to provide the services and as required by law, unless a longer retention period is agreed in writing.
      </p>
    ),
  },
  {
    id: "international-transfers",
    navLabel: "International Transfers",
    title: "International Transfers",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>),
    body: (
      <p>
        If Personal Data is transferred outside the country of origin, Processor shall ensure appropriate safeguards are in place in accordance with applicable data protection laws.
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
        This DPA shall be governed by and construed in accordance with the laws of the People&apos;s Republic of China, without regard to its conflict of law principles.
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
        If you have any questions about this DPA, please contact us at{" "}
        <a href="mailto:dpo@fulfillmesh.com" className="text-[#3182CE] hover:underline">dpo@fulfillmesh.com</a>{" "}
        or through our <a href="/resources" className="text-[#3182CE] hover:underline">Help Center</a>.
      </p>
    ),
  },
];

export default function DataProcessingPage() {
  return (
    <LegalPageLayout
      title="Data Processing Agreement"
      titleSuffix="(DPA)"
      lastUpdated="May 12, 2025"
      intro={
        <>This Data Processing Agreement (&ldquo;DPA&rdquo;) is entered into between you (&ldquo;Customer&rdquo;) and FulfillMesh Co. (&ldquo;Processor&rdquo;).</>
      }
      heroIllustration={<HeroIllustration />}
      contactTitle="Questions about this DPA?"
      contactText="Our compliance team is here to help."
      sections={sections}
    />
  );
}
