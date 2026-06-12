import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';

const BASE = 'http://localhost:3000';
const OUT_DIR = 'd:/web/fulfillmesh/screenshots';
const CHROME_PATH = path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe');

const pages = [
  // 前台营销页
  { url: '/', name: '首页' },
  { url: '/solutions', name: 'solutions列表页' },
  { url: '/solutions/supplier-matching', name: 'solutions列表页-Supplier Matching' },
  { url: '/solutions/overseas-warehousing', name: 'solutions列表页-Overseas Warehousing' },
  { url: '/solutions/quality-control', name: 'solutions列表页-Quality Control' },
  { url: '/solutions/inventory-visibility', name: 'solutions列表页-Inventory Visibility' },
  { url: '/solutions/packaging-labeling', name: 'solutions列表页-Packaging & Labeling' },
  { url: '/solutions/returns-management', name: 'solutions列表页-Returns Management' },
  { url: '/solutions/shipping-logistics', name: 'solutions列表页-Shipping & Logistics' },
  { url: '/solutions/analytics-reporting', name: 'solutions列表页-Analytics & Reporting' },
  { url: '/pricing', name: 'Pricing 页' },
  { url: '/how-it-works', name: 'How It Works 页' },
  { url: '/resources', name: 'Resources 页' },
  { url: '/resources/guides', name: 'Resources 页-Guides列表页' },
  { url: '/resources/guides/sample-guide', name: 'Resources 页-Guides列表页-详情页' },
  { url: '/resources/case-studies', name: 'Resources 页-Case Studies列表页' },
  { url: '/resources/case-studies/sample-case', name: 'Resources 页-Case Studies列表页-详情页' },
  { url: '/resources/help-center', name: 'Resources 页-Help Center列表页' },
  { url: '/resources/help-center/sample-help', name: 'Resources 页-Help Center列表页-详情页' },
  { url: '/resources/api-documentation', name: 'Resources 页-API Documentation页' },
  { url: '/resources/shipping-insights', name: 'Resources 页-Shipping Insights页' },
  { url: '/resources/supplier-playbooks', name: 'Resources 页-Supplier Playbooks页' },
  { url: '/blog', name: 'blog页' },
  { url: '/blog/sample-post', name: 'blog页-文章详情' },
  { url: '/contact', name: 'Contact Us' },
  { url: '/book-a-demo', name: 'Book a Demo' },
  { url: '/onboarding', name: 'Onboarding' },

  // 认证页
  { url: '/login', name: '登录注册页-login' },
  { url: '/register', name: '登录注册页-register' },
  { url: '/forgot-password', name: '忘记密码页' },
  { url: '/reset-password', name: '创建新密码页' },
  { url: '/verify-email', name: 'Email Verification' },

  // 后台核心页
  { url: '/dashboard', name: '后台-overview页' },
  { url: '/dashboard/orders', name: '后台-order页' },
  { url: '/dashboard/orders/sample', name: '后台-order页-详情页' },
  { url: '/dashboard/shipments', name: '后台-shipments页' },
  { url: '/dashboard/shipments/sample', name: '后台-shipments页-详情页' },
  { url: '/dashboard/inventory', name: '后台-inventory页' },
  { url: '/dashboard/inventory/sample', name: '后台-inventory页-详情页' },
  { url: '/dashboard/returns', name: '后台-returns页' },
  { url: '/dashboard/returns/sample', name: '后台-returns页-详情页' },
  { url: '/dashboard/customers', name: '后台-customers页' },
  { url: '/dashboard/customers/sample', name: '后台-customers页-详情页' },
  { url: '/dashboard/analytics', name: '后台-analytics页' },
  { url: '/dashboard/reports', name: '后台-reports页' },
  { url: '/dashboard/products', name: '后台-Product页' },
  { url: '/dashboard/products/sample', name: '后台-Product页-Product Detail' },
  { url: '/dashboard/quotes', name: '后台-Quote页' },
  { url: '/dashboard/quotes/sample', name: '后台-Quote页-Quote Detail' },
  { url: '/dashboard/suppliers', name: '后台-Suppliers页' },
  { url: '/dashboard/suppliers/sample', name: '后台-Suppliers页-详情页' },
  { url: '/dashboard/qc-inspections', name: '后台-QC Inspections页' },
  { url: '/dashboard/qc-inspections/sample', name: '后台-QC Inspections页-详情页' },

  // 后台设置页
  { url: '/dashboard/settings', name: '后台-settins页' },
  { url: '/dashboard/settings/security', name: '后台-settins页-security' },
  { url: '/dashboard/settings/integrations', name: '后台-settins页-integrations' },
  { url: '/dashboard/settings/billing', name: '后台-settins页-billing' },
  { url: '/dashboard/settings/notifications', name: '后台-settins页-notifications' },
  { url: '/dashboard/settings/carriers', name: '后台-settins页-carriers' },
  { url: '/dashboard/settings/users', name: '后台-settins页-users' },
  { url: '/dashboard/settings/warehouses', name: '后台-settins页-warehouses' },

  // 仓储管理页
  { url: '/dashboard/warehouse/operations', name: 'Warehouse Operations Storage' },
  { url: '/dashboard/warehouse/inventory', name: 'Warehouse Inventory' },
  { url: '/dashboard/warehouse/outbound', name: 'Warehouse Outbound Shipments' },
  { url: '/dashboard/warehouse/transfers', name: 'Warehouse Transfers' },
  { url: '/dashboard/warehouse/cycle-count', name: 'Warehouse Cycle Count' },
  { url: '/dashboard/warehouse/locations', name: 'Warehouse Locations' },
  { url: '/dashboard/warehouse/storage-types', name: 'Warehouse Storage Types' },

  // 后台运营页
  { url: '/dashboard/tasks', name: 'Tasks Operations' },
  { url: '/dashboard/messages', name: 'Messages Inbox' },
  { url: '/dashboard/documents', name: 'Documents' },
  { url: '/dashboard/notifications', name: 'Notifications' },
  { url: '/dashboard/invoices', name: 'Invoices Payments' },
  { url: '/dashboard/operational-reports', name: 'Operational Reports' },
  { url: '/dashboard/productivity', name: 'Productivity' },
  { url: '/dashboard/order-performance', name: 'Order Performance Report' },
  { url: '/dashboard/exception-reports', name: 'Exception Reports' },
  { url: '/dashboard/users-roles', name: 'Users & Roles' },
  { url: '/dashboard/system-settings', name: 'System Settings' },
  { url: '/dashboard/integrations', name: 'Integrations' },
  { url: '/dashboard/audit-logs', name: 'Audit Logs' },
  { url: '/dashboard/api-keys', name: 'API Keys' },

  // 法律合规页
  { url: '/legal/terms', name: 'Terms of Service' },
  { url: '/legal/privacy', name: 'Privacy Policy' },
  { url: '/legal/cookies', name: 'Cookie Policy' },
  { url: '/legal/data-processing', name: 'Data Processing Agreement' },
  { url: '/compliance', name: 'Compliance Security' },
  { url: '/glossary', name: 'Glossary' },
  { url: '/compare', name: 'Comparison Alternatives' },
  { url: '/status', name: 'Status Page' },
  { url: '/packaging-requests', name: 'Packaging Requests' },
  { url: '/integrations', name: 'Integration Marketplace' },
  { url: '/co-build-future', name: '共建未来列表页' },
  { url: '/co-build-future/sample', name: '共建未来详情页' },
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: CHROME_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  defaultViewport: { width: 1440, height: 900 },
});

const results = [];

for (const p of pages) {
  const page = await browser.newPage();
  try {
    const response = await page.goto(`${BASE}${p.url}`, { waitUntil: 'networkidle0', timeout: 15000 });
    const status = response?.status() ?? 0;

    // Full page screenshot
    await page.screenshot({
      path: `${OUT_DIR}/${p.name}.png`,
      fullPage: true,
    });

    results.push({ name: p.name, url: p.url, status, ok: status === 200 });
    console.log(`✅ ${status} ${p.name}`);
  } catch (err) {
    results.push({ name: p.name, url: p.url, status: 0, ok: false, error: err.message });
    console.log(`❌ FAIL ${p.name}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

// Summary
const ok = results.filter(r => r.ok).length;
const fail = results.filter(r => !r.ok).length;
console.log(`\n=== SUMMARY: ${ok} OK, ${fail} FAILED, ${results.length} TOTAL ===`);
if (fail > 0) {
  console.log('\nFailed pages:');
  results.filter(r => !r.ok).forEach(r => console.log(`  - ${r.name} (${r.url}): ${r.error || r.status}`));
}
