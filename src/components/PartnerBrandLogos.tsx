/* Page-specific simplified monochrome brand wordmarks for the
   "Trusted by partners worldwide" strip on /co-build-future.
   Rendered in a muted tone so they read as a logo wall, not callouts. */
import type { SVGProps } from "react";

const c = "#66758C"; // text-muted

export function ShopifyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 22" fill="none" aria-label="Shopify" {...props}>
      <path
        d="M14.5 4.7c-.1 0-2.1.2-2.1.2s-1.4-1.4-1.6-1.5c-.2-.2-.5-.1-.6-.1l-.8 18 6.6-1.4L14.9 5c0-.2-.2-.3-.4-.3Zm-2.7.5-1.2.1c0-.6-.1-1.2-.3-1.7.7.1 1.1.9 1.5 1.6Zm-2.1-2c.2.4.4 1 .4 1.7l-2 .2c.4-1.4 1.1-2 1.6-1.9Z"
        fill="#95BF47"
      />
      <path
        d="m14.1 4.9-.7 13.5 5.2-1.1L16.2 5c0-.1-.1-.2-.3-.2l-1.8.1Z"
        fill="#5E8E3E"
      />
      <text x="24" y="16" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fill={c}>
        shopify
      </text>
    </svg>
  );
}

export function AmazonLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 22" fill="none" aria-label="amazon" {...props}>
      <text x="2" y="15" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" fill={c}>
        amazon
      </text>
      <path
        d="M14 18.5c4 2.6 9 2 12.6.1.4-.2.7.2.3.5-1.5 1.2-3.8 1.8-5.9 1.8-2.9 0-5.5-1.1-7.4-2.8-.2-.2 0-.5.4-.3Z"
        fill="#FF9900"
      />
    </svg>
  );
}

export function TikTokShopLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 22" fill="none" aria-label="TikTok Shop" {...props}>
      <path
        d="M11.5 2.5c.4 1.9 1.6 3.3 3.4 3.6v2.5c-1.2 0-2.4-.4-3.4-1v5.2c0 2.9-2.2 5.2-5 5.2s-5-2.3-5-5.2 2.2-5.2 5-5.2c.2 0 .5 0 .7.1v2.6c-.2-.1-.5-.1-.7-.1-1.4 0-2.5 1.2-2.5 2.6s1.1 2.6 2.5 2.6 2.5-1.2 2.5-2.6V2.5h2.5Z"
        fill={c}
      />
      <text x="20" y="15" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill={c}>
        TikTok Shop
      </text>
    </svg>
  );
}

export function BigCommerceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 22" fill="none" aria-label="BigCommerce" {...props}>
      <path d="M4 3h7c2.2 0 3.8 1.3 3.8 3.4 0 1.4-.8 2.4-1.9 2.8 1.3.3 2.3 1.4 2.3 3 0 2.3-1.7 3.8-4.2 3.8H4V3Zm2.6 5.1h3.7c.9 0 1.5-.5 1.5-1.4 0-.8-.6-1.3-1.5-1.3H6.6v2.7Zm0 5.5h3.9c1 0 1.6-.5 1.6-1.5 0-.8-.6-1.4-1.6-1.4H6.6v2.9Z" fill={c} />
      <text x="20" y="15" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill={c}>
        igcommerce
      </text>
    </svg>
  );
}
