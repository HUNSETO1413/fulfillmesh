import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SITE_URL, organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FulfillMesh | China-Powered Fulfillment Matching for Global E-Commerce Brands",
    template: "%s | FulfillMesh",
  },
  description:
    "FulfillMesh helps global e-commerce brands find and manage the right China-powered fulfillment resources — from suppliers and quality control to packaging, shipping routes, and overseas warehouse options.",
  keywords: [
    "dropshipping fulfillment",
    "china sourcing agent",
    "private label dropshipping",
    "fulfillment partner",
    "china suppliers",
    "quality control",
    "custom packaging",
    "overseas warehousing",
  ],
  openGraph: {
    title: "Find the right China-powered fulfillment partner for your brand.",
    description:
      "Connect with verified suppliers, QC services, packaging partners, shipping routes, and overseas warehouse options through FulfillMesh.",
    type: "website",
    url: "https://fulfillmesh.com",
    siteName: "FulfillMesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
