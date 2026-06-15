// Shared blog article data. Both the blog hub (src/app/blog/page.tsx) and the
// blog detail template (src/app/blog/[slug]/page.tsx) read from this single
// source so slugs, titles, dates and bodies stay in sync. generateStaticParams
// uses `articleSlugs` to prerender every known post (which also feeds the
// sitemap's BLOG_SLUGS list).

export interface ArticleBodyBlock {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Article {
  slug: string;
  category: string;
  title: string;
  desc: string;
  date: string;
  read: string;
  image: string;
  /** Topic key used by the hub filter pills. */
  topic: string;
  /** Featured articles surface in the hero card on the hub. */
  featured?: boolean;
  body: ArticleBodyBlock[];
}

// Slugify an article title the same way everywhere so links derived from a
// title always resolve to the matching detail page.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const articles: Article[] = [
  {
    slug: "building-resilient-supply-chains-in-an-uncertain-world",
    category: "Supply Chain Strategy",
    topic: "Growth",
    title: "Building Resilient Supply Chains in an Uncertain World",
    desc: "From geopolitical shifts to demand volatility, learn how leading brands are building resilient, agile supply chains that can adapt and thrive in any environment.",
    date: "May 10, 2025",
    read: "8 min read",
    image: "/images/photo-1494412574643-ff11b0a5c1c3.jpg",
    featured: true,
    body: [
      {
        paragraphs: [
          "Resilience is no longer a nice-to-have in global supply chains—it is the difference between brands that grow through disruption and those that stall. Geopolitical shifts, demand volatility, and freight capacity swings have made agility a core competency.",
          "This article breaks down how leading brands design supply chains that absorb shocks without passing the cost on to customers.",
        ],
      },
      {
        heading: "Diversify before you have to",
        paragraphs: [
          "Single-source dependencies are the most common cause of catastrophic delays. Brands that qualify backup suppliers in a second region recover far faster when one node goes offline.",
        ],
        bullets: [
          "Qualify at least one backup supplier per critical SKU",
          "Spread inventory across more than one fulfillment region",
          "Negotiate flexible volume commitments, not rigid annual ones",
        ],
      },
      {
        heading: "Make visibility the default",
        paragraphs: [
          "You cannot react to what you cannot see. Real-time visibility into orders, inventory, and in-transit shipments turns surprises into manageable decisions.",
        ],
      },
    ],
  },
  {
    slug: "how-to-vet-suppliers-in-china-a-step-by-step-framework",
    category: "Supplier Vetting",
    topic: "Supplier Vetting",
    title: "How to Vet Suppliers in China: A Step-by-Step Framework",
    desc: "A practical checklist to help you evaluate, qualify, and build long-term relationships with reliable manufacturers.",
    date: "May 8, 2025",
    read: "6 min read",
    image: "/images/photo-1566576721346-d4a3b4eaeb55.jpg",
    body: [
      {
        paragraphs: [
          "Finding the right supplier in China can unlock better margins, unique products, and faster growth. Without a structured vetting process, it can just as easily lead to costly mistakes.",
        ],
      },
      {
        heading: "Define your requirements clearly",
        paragraphs: ["A clear brief sets the foundation for a successful partnership."],
        bullets: [
          "Product specifications & materials",
          "Quality standards & certifications",
          "Order volumes & packaging requirements",
          "Timeline, Incoterms, and compliance needs",
        ],
      },
      {
        heading: "Evaluate and verify",
        paragraphs: ["A thorough evaluation now prevents expensive problems later."],
        bullets: [
          "Request business licenses, certifications, and product samples",
          "Conduct factory audits (in-person or virtual)",
          "Check references and track record with global clients",
        ],
      },
    ],
  },
  {
    slug: "ocean-vs-air-freight-how-to-choose-the-right-option",
    category: "Shipping & Logistics",
    topic: "Shipping",
    title: "Ocean vs. Air Freight: How to Choose the Right Option",
    desc: "Compare costs, speed, and reliability to determine the best shipping strategy for your business.",
    date: "May 6, 2025",
    read: "5 min read",
    image: "/images/photo-1578575437130-527eed3abbec.jpg",
    body: [
      {
        paragraphs: [
          "Choosing between ocean and air freight is one of the highest-leverage logistics decisions you make. The right mix depends on margin, lead time, and how predictable your demand is.",
        ],
      },
      {
        heading: "When ocean wins",
        paragraphs: ["Ocean freight is dramatically cheaper per unit and ideal for planned, high-volume replenishment."],
        bullets: ["Large, heavy, or low-value goods", "Predictable demand with long lead times", "Cost-sensitive margins"],
      },
      {
        heading: "When air wins",
        paragraphs: ["Air freight buys speed and reliability when timing matters more than landed cost."],
        bullets: ["New launches and restocks of best-sellers", "High-value or seasonal goods", "Recovering from a stockout"],
      },
    ],
  },
  {
    slug: "the-ultimate-guide-to-3pl-warehousing-in-2025",
    category: "Warehousing",
    topic: "Warehousing",
    title: "The Ultimate Guide to 3PL Warehousing in 2025",
    desc: "Explore the benefits of 3PL warehousing and how the right partner can improve speed, accuracy, and scale.",
    date: "May 4, 2025",
    read: "7 min read",
    image: "/images/photo-1586528116311-ad8dd3c8310d.jpg",
    body: [
      {
        paragraphs: [
          "A third-party logistics (3PL) partner lets you scale fulfillment without building warehouses yourself. The right partner improves speed, accuracy, and customer experience at once.",
        ],
      },
      {
        heading: "What to look for",
        paragraphs: ["Not all 3PLs are created equal—evaluate them like a long-term operating partner."],
        bullets: [
          "Order accuracy and on-time ship rates",
          "Transparent, usage-based pricing",
          "Real-time inventory and order APIs",
          "Geographic footprint near your customers",
        ],
      },
    ],
  },
  {
    slug: "packaging-that-delivers-best-practices-for-e-commerce-brands",
    category: "Packaging & Labeling",
    topic: "Packaging",
    title: "Packaging That Delivers: Best Practices for E-commerce Brands",
    desc: "Design packaging that protects your products, delights customers, and strengthens your brand.",
    date: "May 2, 2025",
    read: "4 min read",
    image: "/images/photo-1607344645866-009c320b63e0.jpg",
    body: [
      {
        paragraphs: [
          "Packaging is the first physical touchpoint your customer has with your brand. Done well, it protects the product, reduces returns, and turns unboxing into marketing.",
        ],
      },
      {
        heading: "Balance protection and cost",
        paragraphs: ["Over-packing wastes money and frustrates customers; under-packing drives damages and returns."],
        bullets: ["Right-size boxes to the product", "Use sustainable, recyclable materials", "Standardize labeling for faster fulfillment"],
      },
    ],
  },
  {
    slug: "quality-control-checklist-for-importing-from-china",
    category: "Quality Control",
    topic: "QC",
    title: "Quality Control Checklist for Importing from China",
    desc: "Ensure product quality at every stage with this essential QC checklist used by top brands and importers.",
    date: "Apr 30, 2025",
    read: "6 min read",
    image: "/images/photo-1551288049-bebda4e38f71.jpg",
    body: [
      {
        paragraphs: [
          "Quality issues caught at the dock are expensive; quality issues caught by customers are far worse. A staged QC process protects both margin and reputation.",
        ],
      },
      {
        heading: "Inspect at every stage",
        paragraphs: ["Spread inspections across the production timeline rather than only at the end."],
        bullets: [
          "Pre-production: verify materials and specs",
          "During production: catch defects early",
          "Pre-shipment: random sampling against AQL standards",
        ],
      },
    ],
  },
  {
    slug: "scaling-your-e-commerce-brand-without-supply-chain-bottlenecks",
    category: "Growth & Scaling",
    topic: "Growth",
    title: "Scaling Your E-commerce Brand Without Supply Chain Bottlenecks",
    desc: "Key strategies to streamline operations, improve visibility, and scale profitably across new markets.",
    date: "Apr 28, 2025",
    read: "5 min read",
    image: "/images/photo-1602143407151-7111542de6e8.jpg",
    body: [
      {
        paragraphs: [
          "Growth exposes every weak link in your supply chain at once. Scaling profitably means fixing bottlenecks before demand finds them.",
        ],
      },
      {
        heading: "Streamline before you scale",
        paragraphs: ["Automation and visibility compound as volume grows."],
        bullets: [
          "Automate reordering with demand forecasts",
          "Centralize order and inventory data",
          "Pre-qualify partners in new target markets",
        ],
      },
    ],
  },
];

export const articleSlugs: string[] = articles.map((a) => a.slug);

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

// Topic filter pills shown on the hub. "All Topics" is handled specially.
export const topicFilters = [
  "All Topics",
  "Supplier Vetting",
  "Shipping",
  "Warehousing",
  "Packaging",
  "QC",
  "Growth",
];
