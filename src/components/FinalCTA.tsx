import Link from "next/link";

interface FinalCTAProps {
  headline: string;
  subtitle: string;
  primaryText: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

export default function FinalCTA({
  headline,
  subtitle,
  primaryText,
  primaryHref = "/get-started",
  secondaryText,
  secondaryHref = "/book-a-demo",
}: FinalCTAProps) {
  return (
    <section className="bg-deep-navy">
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <h2 className="text-[36px] font-bold leading-tight text-white">
          {headline}
        </h2>
        <p className="mt-4 text-[17px] text-text-on-dark-muted">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
          >
            {primaryText}
          </Link>
          {secondaryText && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold bg-white text-navy rounded-[10px] hover:shadow-soft transition-all"
            >
              {secondaryText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
