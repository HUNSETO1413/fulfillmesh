import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: { text: string; href: string };
}

export default function AuthLayout({ title, subtitle, children, footerText, footerLink }: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center bg-soft-bg px-6 py-12">
        <div className="w-full max-w-[440px]">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg gradient-logo flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-deep-navy">Fulfill</span>
                <span className="text-teal">Mesh</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-card border border-border-soft">
            <h1 className="text-2xl font-bold text-deep-navy">{title}</h1>
            <p className="mt-2 text-sm text-text-body">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-text-muted">
            {footerText}{" "}
            <Link href={footerLink.href} className="font-medium text-teal hover:text-teal/80">
              {footerLink.text}
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Decorative Panel */}
      <div className="hidden lg:flex w-[480px] xl:w-[520px] relative gradient-dark-hero items-center justify-center overflow-hidden">
        {/* Background world map dots */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.07]">
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]" viewBox="0 0 600 300">
            {[
              [100,75],[130,90],[160,80],[190,100],[250,95],[290,85],[330,80],
              [370,90],[410,85],[450,115],[490,100],[530,90],[570,110],
              [110,130],[170,140],[230,150],[290,135],[350,145],[410,140],
              [470,130],[530,140],[590,135],[120,180],[180,170],[240,175],
              [300,165],[360,175],[420,170],[480,180],[540,175],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.5" fill="white" />
            ))}
            <circle cx="420" cy="100" r="4" fill="#00B894" opacity="0.8" />
            <line x1="420" y1="100" x2="150" y2="90" stroke="#00B894" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <line x1="420" y1="100" x2="250" y2="70" stroke="#00B894" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <line x1="420" y1="100" x2="480" y2="140" stroke="#0057D8" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-12">
          <h2 className="text-[28px] font-bold text-white leading-tight">
            Find the right{" "}
            <span className="gradient-text-teal">China-powered</span>{" "}
            fulfillment partner
          </h2>
          <p className="mt-4 text-[15px] text-text-on-dark-muted leading-relaxed">
            Streamline your logistics with end-to-end fulfillment solutions. Connect with vetted suppliers, QC teams, and shipping partners.
          </p>

          {/* Floating feature cards */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              { icon: "🔍", title: "Supplier Matching", desc: "Find the right factory" },
              { icon: "✅", title: "Quality Control", desc: "On-site inspections" },
              { icon: "📦", title: "Smart Packaging", desc: "Branded solutions" },
              { icon: "🚚", title: "Global Shipping", desc: "150+ countries" },
            ].map((f, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-4 text-left">
                <span className="text-lg">{f.icon}</span>
                <p className="mt-2 text-[13px] font-semibold text-white">{f.title}</p>
                <p className="text-[11px] text-text-on-dark-muted mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust stats */}
          <div className="mt-8 flex items-center justify-center gap-6">
            {[
              { num: "1,200+", label: "Clients" },
              { num: "98%", label: "On Time" },
              { num: "4.8/5", label: "Rating" },
            ].map((t, i) => (
              <div key={i} className="text-center">
                <p className="text-[18px] font-bold text-white">{t.num}</p>
                <p className="text-[10px] text-text-on-dark-muted mt-0.5">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
