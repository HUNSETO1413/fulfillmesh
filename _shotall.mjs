// Bulk single-browser renderer for design-fidelity audit.
// Renders every route sequentially through ONE reused Chrome tab to avoid the
// process-storm / dev-server thrash that killed the per-agent approach.
// Usage: node _shotall.mjs            (renders all)
//        node _shotall.mjs orders     (renders only entries whose outName includes "orders")
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";

const BASE = "http://localhost:3000";
const WIDTH = 1440;

// [urlPath, outName]  — dynamic routes use a concrete known-good sample id/slug.
const PAGES = [
  ["/", "aud_home"],
  ["/how-it-works", "aud_how-it-works"],
  ["/pricing", "aud_pricing"],
  ["/compare", "aud_compare"],
  ["/compliance", "aud_compliance"],
  ["/contact", "aud_contact"],
  ["/book-a-demo", "aud_book-a-demo"],
  ["/glossary", "aud_glossary"],
  ["/status", "aud_status"],
  ["/integrations", "aud_integrations"],
  ["/packaging-requests", "aud_packaging-requests"],
  ["/onboarding", "aud_onboarding"],
  ["/co-build-future", "aud_co-build-future"],
  ["/co-build-future/future-of-fulfillment", "aud_co-build-future-detail"],
  ["/legal/privacy", "aud_legal-privacy"],
  ["/legal/terms", "aud_legal-terms"],
  ["/legal/cookies", "aud_legal-cookies"],
  ["/legal/data-processing", "aud_legal-data-processing"],
  ["/login", "aud_login"],
  ["/register", "aud_register"],
  ["/forgot-password", "aud_forgot-password"],
  ["/reset-password", "aud_reset-password"],
  ["/verify-email", "aud_verify-email"],
  ["/solutions", "aud_solutions"],
  ["/solutions/supplier-matching", "aud_solutions-supplier-matching"],
  ["/solutions/quality-control", "aud_solutions-quality-control"],
  ["/solutions/packaging-labeling", "aud_solutions-packaging-labeling"],
  ["/solutions/shipping-logistics", "aud_solutions-shipping-logistics"],
  ["/solutions/overseas-warehousing", "aud_solutions-overseas-warehousing"],
  ["/solutions/returns-management", "aud_solutions-returns-management"],
  ["/solutions/inventory-visibility", "aud_solutions-inventory-visibility"],
  ["/solutions/analytics-reporting", "aud_solutions-analytics-reporting"],
  ["/resources", "aud_resources"],
  ["/resources/guides", "aud_resources-guides"],
  ["/resources/guides/supplier-vetting", "aud_resources-guides-detail"],
  ["/resources/case-studies", "aud_resources-case-studies"],
  ["/resources/case-studies/luxeglow", "aud_resources-case-studies-detail"],
  ["/resources/help-center", "aud_resources-help-center"],
  ["/resources/help-center/getting-started", "aud_resources-help-center-detail"],
  ["/resources/api-documentation", "aud_resources-api-documentation"],
  ["/resources/shipping-insights", "aud_resources-shipping-insights"],
  ["/resources/supplier-playbooks", "aud_resources-supplier-playbooks"],
  ["/blog", "aud_blog"],
  ["/blog/building-resilient-supply-chains", "aud_blog-detail"],
  ["/dashboard", "aud_dashboard"],
  ["/dashboard/orders", "aud_dashboard-orders"],
  ["/dashboard/orders/ORD-10458", "aud_dashboard-orders-detail"],
  ["/dashboard/shipments", "aud_dashboard-shipments"],
  ["/dashboard/shipments/SHP-89234", "aud_dashboard-shipments-detail"],
  ["/dashboard/inventory", "aud_dashboard-inventory"],
  ["/dashboard/inventory/SKU-1001", "aud_dashboard-inventory-detail"],
  ["/dashboard/returns", "aud_dashboard-returns"],
  ["/dashboard/returns/RET-10078", "aud_dashboard-returns-detail"],
  ["/dashboard/customers", "aud_dashboard-customers"],
  ["/dashboard/customers/CUST-1001", "aud_dashboard-customers-detail"],
  ["/dashboard/products", "aud_dashboard-products"],
  ["/dashboard/products/PRD-001", "aud_dashboard-products-detail"],
  ["/dashboard/quotes", "aud_dashboard-quotes"],
  ["/dashboard/quotes/RFQ-2025-0421", "aud_dashboard-quotes-detail"],
  ["/dashboard/suppliers", "aud_dashboard-suppliers"],
  ["/dashboard/suppliers/SUP-001", "aud_dashboard-suppliers-detail"],
  ["/dashboard/qc-inspections", "aud_dashboard-qc-inspections"],
  ["/dashboard/qc-inspections/QC-2025-0518-001", "aud_dashboard-qc-inspections-detail"],
  ["/dashboard/analytics", "aud_dashboard-analytics"],
  ["/dashboard/reports", "aud_dashboard-reports"],
  ["/dashboard/settings", "aud_dashboard-settings"],
  ["/dashboard/settings/billing", "aud_dashboard-settings-billing"],
  ["/dashboard/settings/carriers", "aud_dashboard-settings-carriers"],
  ["/dashboard/settings/integrations", "aud_dashboard-settings-integrations"],
  ["/dashboard/settings/notifications", "aud_dashboard-settings-notifications"],
  ["/dashboard/settings/security", "aud_dashboard-settings-security"],
  ["/dashboard/settings/users", "aud_dashboard-settings-users"],
  ["/dashboard/settings/warehouses", "aud_dashboard-settings-warehouses"],
  ["/dashboard/warehouse/inventory", "aud_dashboard-warehouse-inventory"],
  ["/dashboard/warehouse/operations", "aud_dashboard-warehouse-operations"],
  ["/dashboard/warehouse/outbound", "aud_dashboard-warehouse-outbound"],
  ["/dashboard/warehouse/transfers", "aud_dashboard-warehouse-transfers"],
  ["/dashboard/warehouse/cycle-count", "aud_dashboard-warehouse-cycle-count"],
  ["/dashboard/warehouse/storage-types", "aud_dashboard-warehouse-storage-types"],
  ["/dashboard/warehouse/locations", "aud_dashboard-warehouse-locations"],
  ["/dashboard/api-keys", "aud_dashboard-api-keys"],
  ["/dashboard/audit-logs", "aud_dashboard-audit-logs"],
  ["/dashboard/documents", "aud_dashboard-documents"],
  ["/dashboard/exception-reports", "aud_dashboard-exception-reports"],
  ["/dashboard/integrations", "aud_dashboard-integrations"],
  ["/dashboard/invoices", "aud_dashboard-invoices"],
  ["/dashboard/messages", "aud_dashboard-messages"],
  ["/dashboard/notifications", "aud_dashboard-notifications"],
  ["/dashboard/operational-reports", "aud_dashboard-operational-reports"],
  ["/dashboard/order-performance", "aud_dashboard-order-performance"],
  ["/dashboard/productivity", "aud_dashboard-productivity"],
  ["/dashboard/system-settings", "aud_dashboard-system-settings"],
  ["/dashboard/tasks", "aud_dashboard-tasks"],
  ["/dashboard/users-roles", "aud_dashboard-users-roles"],
];

const filter = process.argv[2];
const work = filter ? PAGES.filter(([, n]) => n.includes(filter)) : PAGES;

mkdirSync("shots", { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: 900, deviceScaleFactor: 1 });

const failures = [];
let done = 0;
for (const [route, outName] of work) {
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    try {
      const resp = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle2", timeout: 60000 });
      if (resp && resp.status() >= 500) throw new Error(`HTTP ${resp.status()}`);
      ok = true;
    } catch (e) {
      if (attempt === 3) { failures.push([route, e.message]); }
      else await new Promise((r) => setTimeout(r, 2500));
    }
  }
  if (!ok) { console.log(`FAIL  ${route}  (${outName})`); continue; }
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise((r) => setTimeout(r, 900));
  // Dashboard pages use h-screen + inner overflow-y-auto, which clips fullPage
  // capture to one viewport. Neutralize those so the whole page flows into the shot.
  if (route.startsWith("/dashboard")) {
    await page.addStyleTag({
      content: '[class*="h-screen"]{height:auto!important;min-height:100vh!important}[class*="overflow-y-auto"]{overflow:visible!important}',
    });
    await new Promise((r) => setTimeout(r, 300));
  }
  try {
    await page.screenshot({ path: `shots/${outName}.png`, fullPage: true });
    done++;
    console.log(`ok    ${done}/${work.length}  ${outName}`);
  } catch (e) {
    failures.push([route, `screenshot: ${e.message}`]);
    console.log(`FAIL  ${route}  screenshot ${e.message}`);
  }
}

await browser.close();
console.log(`\nDONE  rendered=${done}  failed=${failures.length}`);
if (failures.length) { console.log("FAILURES:"); failures.forEach(([r, m]) => console.log(`  ${r}  ${m}`)); }
