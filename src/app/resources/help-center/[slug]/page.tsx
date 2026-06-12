import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Clock3,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";

const toc = [
  { label: "Overview", n: null },
  { label: "Log in to FulfillMesh", n: "1" },
  { label: "Open the Integrations page", n: "2" },
  { label: "Connect Shopify", n: "3" },
  { label: "Authorize FulfillMesh", n: "4" },
  { label: "Complete connection", n: "5" },
  { label: "Troubleshooting", n: null },
];

const relatedTopics = [
  "How FulfillMesh syncs inventory with Shopify",
  "Managing orders imported from Shopify",
  "Shopify integration FAQ",
  "How to disconnect Shopify from FulfillMesh",
  "Bulk import products from Shopify",
];

const troubleshooting = [
  "I don't see my Shopify store after connecting",
  "I'm getting an authentication error",
];

const relatedArticles = [
  "How FulfillMesh syncs inventory with Shopify",
  "Managing orders imported from Shopify",
  "How to disconnect Shopify from FulfillMesh",
  "Shopify integration FAQ",
];

export default function HelpArticlePage() {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources" className="hover:text-navy transition-colors">Resources</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources/help-center" className="hover:text-navy transition-colors">Help Center</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <span className="text-text-primary font-medium truncate">How to connect your Shopify store to FulfillMesh</span>
        </div>
      </section>

      {/* Header */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <p className="inline-block text-xs font-semibold text-teal bg-teal/8 px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
            Shopify Integration
          </p>
          <h1 className="text-4xl lg:text-[44px] font-bold text-deep-navy leading-[1.12] max-w-[720px]">
            How to connect your Shopify store to FulfillMesh
          </h1>
          <p className="mt-4 text-lg text-text-body leading-relaxed max-w-[640px]">
            Connect your Shopify store in just a few minutes to sync orders, inventory, and products with FulfillMesh.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted"><Calendar className="w-4 h-4" /> Updated May 6, 2025</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted"><Clock3 className="w-4 h-4" /> 7 min read</span>
            <span className="text-xs font-semibold text-white bg-action-blue px-2.5 py-1 rounded-full">Beginner</span>
          </div>
        </div>
      </section>

      {/* Body + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
          {/* Main */}
          <article className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Overview</h2>
              <p className="text-text-body leading-relaxed">
                Connecting Shopify to FulfillMesh allows you to automate order import, sync inventory in real time, and keep your operations running smoothly. Follow the steps below to get set up.
              </p>
            </div>

            {/* Step 1 */}
            <Step n="1" title="Log in to FulfillMesh">
              <p className="text-text-body leading-relaxed">
                Go to <span className="text-action-blue font-medium">app.fulfillmesh.com</span> and sign in to your account. If you don&apos;t have an account yet, start your free trial.
              </p>
              <TipBox>You&apos;ll need Admin access in FulfillMesh to add integrations.</TipBox>
              <Mockup>
                <p className="text-sm font-semibold text-deep-navy mb-3">Sign in to FulfillMesh</p>
                <div className="space-y-2">
                  <div className="h-9 rounded-md border border-border-soft bg-white px-3 flex items-center text-xs text-text-light">Email</div>
                  <div className="h-9 rounded-md border border-border-soft bg-white px-3 flex items-center text-xs text-text-light">Password</div>
                  <div className="h-9 rounded-md bg-navy flex items-center justify-center text-xs font-semibold text-white">Log in</div>
                  <p className="text-xs text-action-blue">Forgot password?</p>
                </div>
              </Mockup>
            </Step>

            {/* Step 2 */}
            <Step n="2" title="Open the Integrations page">
              <p className="text-text-body leading-relaxed">
                From your FulfillMesh dashboard, go to Settings in the left sidebar and click Integrations.
              </p>
              <Mockup>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <ul className="space-y-1.5 text-xs text-text-muted">
                    {["Dashboard", "Orders", "Inventory", "Shipments", "Analytics", "Settings"].map((s) => (
                      <li key={s} className={s === "Settings" ? "text-action-blue font-semibold" : ""}>{s}</li>
                    ))}
                  </ul>
                  <div>
                    <p className="text-xs font-semibold text-deep-navy mb-2">Integrations</p>
                    <div className="flex gap-2 text-[10px] text-text-muted mb-2">
                      <span className="text-action-blue font-medium">All Integrations</span>
                      <span>Connected</span>
                      <span>Available</span>
                    </div>
                    <div className="rounded-md border border-border-soft p-2 text-xs">Shopify <span className="text-text-muted">— E-commerce Platform</span></div>
                  </div>
                </div>
              </Mockup>
            </Step>

            {/* Step 3 */}
            <Step n="3" title="Connect Shopify">
              <p className="text-text-body leading-relaxed">
                Click the Shopify card under Available integrations, then click Connect.
              </p>
              <Mockup>
                <p className="text-sm font-semibold text-deep-navy">Shopify</p>
                <p className="text-xs text-text-muted mt-1">Connect your Shopify store to import orders, sync inventory, and manage fulfillment.</p>
                <div className="mt-3 h-9 w-28 rounded-md bg-navy flex items-center justify-center text-xs font-semibold text-white">Connect</div>
              </Mockup>
            </Step>

            {/* Step 4 */}
            <Step n="4" title="Authorize FulfillMesh">
              <p className="text-text-body leading-relaxed">
                You&apos;ll be redirected to Shopify to review the permissions FulfillMesh needs.
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-text-body"><CheckCircle2 className="w-4 h-4 text-teal" /> Click Install app</li>
                <li className="flex items-center gap-2 text-sm text-text-body"><CheckCircle2 className="w-4 h-4 text-teal" /> Choose the store you want to connect.</li>
              </ul>
              <Mockup>
                <p className="text-xs font-semibold text-deep-navy mb-2">FulfillMesh is requesting access to</p>
                <ul className="space-y-1.5 text-xs text-text-muted">
                  <li>View orders</li>
                  <li>View products</li>
                  <li>Edit products</li>
                  <li>Edit inventory</li>
                </ul>
                <div className="mt-3 h-9 w-28 rounded-md bg-navy flex items-center justify-center text-xs font-semibold text-white">Install app</div>
              </Mockup>
            </Step>

            {/* Step 5 */}
            <Step n="5" title="Complete connection">
              <p className="text-text-body leading-relaxed">
                Once authorized, you&apos;ll be redirected back to FulfillMesh. Your Shopify store will appear in the Connected tab.
              </p>
              <TipBox>It may take a few minutes for your orders and products to sync.</TipBox>
              <Mockup>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-deep-navy">My Shopify Store</p>
                    <p className="text-xs text-text-muted">my-shopify-store.myshopify.com</p>
                    <p className="text-xs text-text-muted mt-1">Last synced May 6, 2025 at 10:15 AM</p>
                  </div>
                  <span className="text-[10px] font-semibold text-white bg-teal px-2.5 py-0.5 rounded-full">Connected</span>
                </div>
                <div className="mt-3 h-8 w-24 rounded-md border border-border-soft flex items-center justify-center text-xs font-medium text-deep-navy">Manage</div>
              </Mockup>
            </Step>

            {/* Troubleshooting */}
            <div>
              <h2 className="text-xl font-bold text-deep-navy mb-4">Troubleshooting</h2>
              <div className="space-y-3">
                {troubleshooting.map((q, i) => (
                  <details key={i} className="group rounded-xl border border-border-soft overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                      <span className="text-sm font-medium text-text-primary pr-4">{q}</span>
                      <ChevronDown className="w-4 h-4 text-text-muted shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 -mt-1">
                      <p className="text-sm text-text-body leading-relaxed">
                        Double-check that you completed the authorization step and that your store has finished syncing. If the issue persists, contact our support team.
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Was this helpful */}
            <div className="rounded-2xl bg-soft-bg border border-border-soft p-7 text-center">
              <h3 className="text-lg font-bold text-deep-navy">Was this article helpful?</h3>
              <p className="mt-2 text-sm text-text-body">Your feedback helps us improve our Help Center.</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-teal text-teal text-sm font-semibold hover:bg-teal/5 transition-colors">
                  <ThumbsUp className="w-4 h-4" /> Yes
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-soft text-text-body text-sm font-semibold hover:bg-white transition-colors">
                  <ThumbsDown className="w-4 h-4" /> No
                </button>
              </div>
            </div>

            {/* Related articles */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-deep-navy">Related articles</h2>
                <Link href="/resources/help-center" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
                  View all Shopify articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedArticles.map((a, i) => (
                  <Link key={i} href="/resources/help-center/getting-started" className="flex items-start gap-3 p-4 rounded-xl border border-border-soft hover:shadow-soft transition-all group">
                    <ExternalLink className="w-4 h-4 text-action-blue shrink-0 mt-0.5" />
                    <span className="text-sm text-text-body group-hover:text-action-blue">{a}</span>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* On this page */}
            <div className="rounded-2xl border border-border-soft p-6 sticky top-6">
              <p className="text-sm font-bold text-deep-navy mb-4">On this page</p>
              <ol className="space-y-2">
                {toc.map((item, i) => (
                  <li key={i}>
                    <a
                      href={`#${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                      className={`flex gap-3 text-sm py-1 border-l-2 pl-3 transition-colors ${
                        i === 0
                          ? "text-action-blue font-medium border-action-blue"
                          : "text-text-body border-transparent hover:text-action-blue hover:border-action-blue"
                      }`}
                    >
                      {item.n ? <span className="text-action-blue font-semibold">{item.n}</span> : null}
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Related help topics */}
            <div className="rounded-2xl border border-border-soft p-6">
              <p className="text-sm font-bold text-deep-navy mb-4">Related help topics</p>
              <div className="space-y-3">
                {relatedTopics.map((t, i) => (
                  <Link key={i} href="/resources/help-center/getting-started" className="flex items-start gap-2 group text-sm text-text-body hover:text-action-blue">
                    <ExternalLink className="w-3.5 h-3.5 text-action-blue shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Still need help */}
            <div className="rounded-2xl gradient-dark-hero text-white p-6">
              <p className="text-xs font-semibold text-teal uppercase tracking-wide mb-2">Need more help?</p>
              <h3 className="text-lg font-bold">Still need help?</h3>
              <p className="mt-2 text-sm text-text-on-dark-muted">Our support team is here to help you succeed.</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Live chat</p>
                    <p className="text-xs text-text-on-dark-muted">Mon–Fri, 9am–6pm GMT+8</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Email support</p>
                    <p className="text-xs text-text-on-dark-muted">support@fulfillmesh.com</p>
                  </div>
                </div>
              </div>
              <Link href="/contact" className="mt-5 block text-center py-3 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all">
                Contact Support
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal text-sm font-bold">{n}</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-deep-navy mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function TipBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg bg-action-blue/5 border border-action-blue/15 p-3">
      <Lightbulb className="w-4 h-4 text-action-blue shrink-0 mt-0.5" />
      <p className="text-xs text-text-body leading-relaxed"><span className="font-semibold text-deep-navy">Tip:</span> {children}</p>
    </div>
  );
}

function Mockup({ children }: { children: ReactNode }) {
  return <div className="mt-4 rounded-xl border border-border-soft bg-soft-bg p-4">{children}</div>;
}
