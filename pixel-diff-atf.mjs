/**
 * Fair comparison: screenshot ONLY the first viewport matching design mockup dimensions.
 * For marketing pages with 1024x1536 design, take a 1024-wide, 1536-tall screenshot.
 * For dashboard pages, keep full comparison as before.
 */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

const BASE = 'http://localhost:3000';
const OUT_DIR = 'd:/web/fulfillmesh/screenshots-atf';
const DESIGN_DIR = 'd:/web/fulfillmesh/设计稿';
const CHROME_PATH = path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe');

// Marketing pages: design is ~1024x1536 (one screen only)
const marketingPages = [
  { url: '/', name: '首页', design: '首页.png' },
  { url: '/solutions', name: 'solutions列表页', design: 'solutions列表页.png' },
  { url: '/pricing', name: 'Pricing 页', design: 'Pricing 页.png' },
  { url: '/how-it-works', name: 'How It Works 页', design: 'How It Works 页.png' },
  { url: '/blog', name: 'blog页', design: 'blog页.png' },
  { url: '/contact', name: 'Contact Us', design: 'Contact Us.png' },
  { url: '/book-a-demo', name: 'Book a Demo', design: 'Book a Demo.png' },
];

// Dashboard pages: compare full viewport
const dashboardPages = [
  { url: '/dashboard/settings', name: '后台-settins页', design: '后台-settins页.png' },
  { url: '/dashboard/orders', name: '后台-order页', design: '后台-order页.png' },
  { url: '/dashboard/inventory', name: '后台-inventory页', design: '后台-inventory页.png' },
  { url: '/dashboard/analytics', name: '后台-analytics页', design: '后台-analytics页.png' },
];

await fs.mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: CHROME_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});

const results = [];

for (const p of [...marketingPages, ...dashboardPages]) {
  const designPath = path.join(DESIGN_DIR, p.design);
  let designWidth, designHeight;
  try {
    const meta = await sharp(designPath).metadata();
    designWidth = meta.width;
    designHeight = meta.height;
  } catch {
    continue;
  }

  const page = await browser.newPage();

  // For marketing pages: set viewport to design width, screenshot ONLY design height
  const isMarketing = marketingPages.some(mp => mp.name === p.name);

  await page.setViewport({ width: designWidth, height: isMarketing ? designHeight : 900 });

  try {
    await page.goto(`${BASE}${p.url}`, { waitUntil: 'networkidle0', timeout: 15000 });

    const screenshotOpts = isMarketing
      ? { clip: { x: 0, y: 0, width: designWidth, height: designHeight } }
      : { fullPage: false };

    const outPath = path.join(OUT_DIR, `${p.name}.png`);
    await page.screenshot({ path: outPath, ...screenshotOpts });

    // Compare at exact same dimensions
    const [ssRaw, dgRaw] = await Promise.all([
      sharp(outPath).resize(designWidth, designHeight, { fit: 'fill' }).removeAlpha().raw().toBuffer(),
      sharp(designPath).resize(designWidth, designHeight, { fit: 'fill' }).removeAlpha().raw().toBuffer(),
    ]);

    const totalPixels = designWidth * designHeight;
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
    results.push({ page: p.name, diff: parseFloat(diffPct), size: `${designWidth}x${designHeight}` });
    const icon = diffPct <= 10 ? '✅' : diffPct <= 20 ? '⚠️' : '❌';
    console.log(`${icon} ${diffPct}%  ${p.name} (${designWidth}x${designHeight})`);
  } catch (err) {
    console.log(`🚫 ${p.name}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

console.log(`\n=== FIRST-SCREEN COMPARISON ===`);
const ok = results.filter(r => r.diff <= 10).length;
const warn = results.filter(r => r.diff > 10 && r.diff <= 20).length;
const bad = results.filter(r => r.diff > 20).length;
console.log(`✅ Good (≤10%): ${ok}`);
console.log(`⚠️ Warning (10-20%): ${warn}`);
console.log(`❌ Significant (>20%): ${bad}`);

// Compare with BEFORE values
const before = {
  '首页': 28.44, 'solutions列表页': 28.73, 'Pricing 页': 38.26,
  'How It Works 页': 31.98, 'blog页': 51.67, 'Contact Us': 42.59, 'Book a Demo': 33.18,
  '后台-settins页': 6.13, '后台-order页': 9.75, '后台-inventory页': 8.07,
  '后台-analytics页': 10.12,
};

console.log(`\n📊 BEFORE vs AFTER:`);
results.forEach(r => {
  const b = before[r.page] || 'N/A';
  const change = b !== 'N/A' ? (r.diff < b ? '↓' : r.diff > b ? '↑' : '=') : '';
  console.log(`  ${change} ${r.page}: ${b}% → ${r.diff}%`);
});
