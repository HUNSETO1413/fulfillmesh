/**
 * Re-screenshot key pages at design mockup's native width for fair comparison.
 * Also capture full-page for dashboard pages (they were viewport-only before).
 */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

const BASE = 'http://localhost:3000';
const OUT_DIR = 'd:/web/fulfillmesh/screenshots-matched';
const DESIGN_DIR = 'd:/web/fulfillmesh/设计稿';
const DIFF_DIR = 'd:/web/fulfillmesh/diffs';
const CHROME_PATH = path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe');

// Pages to compare with design mockup widths
const pages = [
  // Dashboard pages — use design width, capture full page
  { url: '/dashboard', name: '后台-overview页', design: '后台-overview页.png' },
  { url: '/dashboard/settings', name: '后台-settins页', design: '后台-settins页.png' },
  { url: '/dashboard/settings/security', name: '后台-settins页-security', design: '后台-settins页-security.png' },
  { url: '/dashboard/settings/carriers', name: '后台-settins页-carriers', design: '后台-settins页-carriers.png' },
  { url: '/dashboard/inventory', name: '后台-inventory页', design: '后台-inventory页.png' },
  { url: '/dashboard/orders', name: '后台-order页', design: '后台-order页.png' },
  { url: '/dashboard/customers', name: '后台-customers页', design: '后台-customers页.png' },
  { url: '/dashboard/reports', name: '后台-reports页', design: '后台-reports页.png' },
  { url: '/dashboard/shipments', name: '后台-shipments页', design: '后台-shipments页.png' },
  { url: '/dashboard/returns', name: '后台-returns页', design: '后台-returns页.png' },
  { url: '/dashboard/analytics', name: '后台-analytics页', design: '后台-analytics页.png' },
  { url: '/dashboard/products', name: '后台-Product页', design: '后台-Product页.png' },
  { url: '/dashboard/quotes', name: '后台-Quote页', design: '后台-Quote页.png' },
  { url: '/dashboard/suppliers', name: '后台-Suppliers页', design: '后台-Suppliers页.png' },
  { url: '/dashboard/qc-inspections', name: '后台-QC Inspections页', design: '后台-QC Inspections页.png' },
  // Key marketing pages
  { url: '/', name: '首页', design: '首页.png' },
  { url: '/solutions', name: 'solutions列表页', design: 'solutions列表页.png' },
  { url: '/pricing', name: 'Pricing 页', design: 'Pricing 页.png' },
  { url: '/how-it-works', name: 'How It Works 页', design: 'How It Works 页.png' },
  { url: '/blog', name: 'blog页', design: 'blog页.png' },
  { url: '/contact', name: 'Contact Us', design: 'Contact Us.png' },
  { url: '/book-a-demo', name: 'Book a Demo', design: 'Book a Demo.png' },
];

await Promise.all([fs.mkdir(OUT_DIR, { recursive: true }), fs.mkdir(DIFF_DIR, { recursive: true })]);

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: CHROME_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});

const results = [];

for (const p of pages) {
  // Get design mockup dimensions
  const designPath = path.join(DESIGN_DIR, p.design);
  let designWidth = 1440;
  try {
    const meta = await sharp(designPath).metadata();
    designWidth = meta.width;
    p.designHeight = meta.height;
  } catch {}

  // Set viewport to match design width
  const page = await browser.newPage();
  await page.setViewport({ width: designWidth, height: 900 });

  try {
    await page.goto(`${BASE}${p.url}`, { waitUntil: 'networkidle0', timeout: 15000 });

    // For dashboard pages, scroll the content area to make it full-height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = Math.max(bodyHeight, p.designHeight || 900);

    // Resize viewport to show full content
    await page.setViewport({ width: designWidth, height: viewportHeight });

    // Take screenshot at design width
    const outPath = path.join(OUT_DIR, `${p.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });

    // Now do pixel comparison at native resolution
    const ssMeta = await sharp(outPath).metadata();

    // Resize both to same dimensions for comparison
    const compareW = Math.min(ssMeta.width, designWidth);
    const compareH = Math.min(ssMeta.height, p.designHeight || ssMeta.height);

    const [ssRaw, dgRaw] = await Promise.all([
      sharp(outPath)
        .resize(compareW, compareH, { fit: 'fill' })
        .removeAlpha().raw().toBuffer(),
      sharp(designPath)
        .resize(compareW, compareH, { fit: 'fill' })
        .removeAlpha().raw().toBuffer(),
    ]);

    const totalPixels = compareW * compareH;
    let diffPixels = 0;
    const threshold = 35;

    for (let i = 0; i < ssRaw.length; i += 3) {
      const maxCh = Math.max(
        Math.abs(ssRaw[i] - dgRaw[i]),
        Math.abs(ssRaw[i+1] - dgRaw[i+1]),
        Math.abs(ssRaw[i+2] - dgRaw[i+2]),
      );
      if (maxCh > threshold) diffPixels++;
    }

    const diffPct = (diffPixels / totalPixels * 100).toFixed(2);

    results.push({
      page: p.name,
      viewport: `${designWidth}x${viewportHeight}`,
      designSize: `${designWidth}x${p.designHeight}`,
      compareSize: `${compareW}x${compareH}`,
      diffPercent: parseFloat(diffPct),
    });

    const icon = diffPct <= 5 ? '✅' : diffPct <= 15 ? '⚠️' : '❌';
    console.log(`${icon} ${diffPct}%  ${p.name} (viewport=${designWidth}px, compare ${compareW}x${compareH})`);
  } catch (err) {
    results.push({ page: p.name, error: err.message });
    console.log(`🚫 ${p.name}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

console.log(`\n=== MATCHED-VIEWPORT COMPARISON ===`);
const ok = results.filter(r => r.diffPercent !== undefined && r.diffPercent <= 5).length;
const warn = results.filter(r => r.diffPercent !== undefined && r.diffPercent > 5 && r.diffPercent <= 15).length;
const bad = results.filter(r => r.diffPercent !== undefined && r.diffPercent > 15).length;
console.log(`✅ Good (≤5%): ${ok}`);
console.log(`⚠️ Warning (5-15%): ${warn}`);
console.log(`❌ Significant (>15%): ${bad}`);
console.log(`Total: ${results.length}`);

console.log(`\nSorted by match quality:`);
results.filter(r => r.diffPercent !== undefined)
  .sort((a, b) => a.diffPercent - b.diffPercent)
  .forEach(r => {
    const icon = r.diffPercent <= 5 ? '✅' : r.diffPercent <= 15 ? '⚠️' : '❌';
    console.log(`  ${icon} ${r.diffPercent}% - ${r.page}`);
  });
