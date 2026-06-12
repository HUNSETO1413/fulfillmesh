/**
 * Normalized pixel-diff: resize both to same width before comparing.
 * Also compares only the top "viewport" area for dashboard pages.
 */
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const SCREENSHOTS_DIR = 'd:/web/fulfillmesh/screenshots';
const DESIGN_DIR = 'd:/web/fulfillmesh/设计稿';
const DIFF_DIR = 'd:/web/fulfillmesh/diffs';
const REPORT_PATH = 'd:/web/fulfillmesh/diff-report-normalized.json';

// Only compare the dashboard pages that we couldn't fullpage-screenshot
// For these, we compare only the viewport portion
const DASHBOARD_PAGES = new Set([
  '后台-overview页.png', '后台-order页.png', '后台-order页-详情页.png',
  '后台-shipments页.png', '后台-shipments页-详情页.png',
  '后台-inventory页.png', '后台-inventory页-详情页.png',
  '后台-returns页.png', '后台-returns页-详情页.png',
  '后台-customers页.png', '后台-customers页-详情页.png',
  '后台-analytics页.png', '后台-reports页.png',
  '后台-Product页.png', '后台-Product页-Product Detail.png',
  '后台-Quote页.png', '后台-Quote页-Quote Detail.png',
  '后台-Suppliers页.png', '后台-Suppliers页-详情页.png',
  '后台-QC Inspections页.png', '后台-QC Inspections页-详情页.png',
  '后台-settins页.png', '后台-settins页-security.png',
  '后台-settins页-integrations.png', '后台-settins页-billing.png',
  '后台-settins页-notifications.png', '后台-settins页-carriers.png',
  '后台-settins页-users.png', '后台-settins页-warehouses.png',
  'Warehouse Operations Storage.png', 'Warehouse Inventory.png',
  'Warehouse Outbound Shipments.png', 'Warehouse Transfers.png',
  'Warehouse Cycle Count.png', 'Warehouse Locations.png', 'Warehouse Storage Types.png',
  'Tasks Operations.png', 'Messages Inbox.png', 'Documents.png',
  'Notifications.png', 'Invoices Payments.png', 'Operational Reports.png',
  'Productivity.png', 'Order Performance Report.png', 'Exception Reports.png',
  'Users & Roles.png', 'System Settings.png', 'Integrations.png',
  'Audit Logs.png', 'API Keys.png',
]);

const mappings = [
  // 后台页面 — 最重要的对比
  ['后台-settins页.png', '后台-settins页.png'],
  ['后台-settins页-security.png', '后台-settins页-security.png'],
  ['后台-settins页-carriers.png', '后台-settins页-carriers.png'],
  ['后台-inventory页.png', '后台-inventory页.png'],
  ['后台-overview页.png', '后台-overview页.png'],
  ['后台-order页.png', '后台-order页.png'],
  ['后台-customers页.png', '后台-customers页.png'],
  ['后台-reports页.png', '后台-reports页.png'],
  ['后台-shipments页.png', '后台-shipments页.png'],
  ['后台-returns页.png', '后台-returns页.png'],
  ['后台-analytics页.png', '后台-analytics页.png'],
  ['后台-Product页.png', '后台-Product页.png'],
  ['后台-Quote页.png', '后台-Quote页.png'],
  ['后台-Suppliers页.png', '后台-Suppliers页.png'],
  ['后台-QC Inspections页.png', '后台-QC Inspections页.png'],
  // 前台页面
  ['首页.png', '首页.png'],
  ['solutions列表页.png', 'solutions列表页.png'],
  ['Pricing 页.png', 'Pricing 页.png'],
  ['How It Works 页.png', 'How It Works 页.png'],
  ['blog页.png', 'blog页.png'],
  ['Contact Us.png', 'Contact Us.png'],
  ['Book a Demo.png', 'Book a Demo.png'],
];

await fs.mkdir(DIFF_DIR, { recursive: true });

const results = [];
const COMPARE_WIDTH = 1024; // normalize both to 1024px width

for (const [screenshotName, designName] of mappings) {
  const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
  const designPath = path.join(DESIGN_DIR, designName);

  try {
    await fs.access(screenshotPath);
    await fs.access(designPath);

    const [ssMeta, dgMeta] = await Promise.all([
      sharp(screenshotPath).metadata(),
      sharp(designPath).metadata(),
    ]);

    // Resize both to COMPARE_WIDTH, maintaining aspect ratio
    const ssScale = COMPARE_WIDTH / ssMeta.width;
    const dgScale = COMPARE_WIDTH / dgMeta.width;
    const ssH = Math.round(ssMeta.height * ssScale);
    const dgH = Math.round(dgMeta.height * dgScale);

    // Use the shorter height for comparison (crop the taller one)
    const compareH = Math.min(ssH, dgH);

    const [ssRaw, dgRaw] = await Promise.all([
      sharp(screenshotPath)
        .resize(COMPARE_WIDTH, ssH, { fit: 'fill' })
        .extract({ left: 0, top: 0, width: COMPARE_WIDTH, height: compareH })
        .removeAlpha()
        .raw()
        .toBuffer(),
      sharp(designPath)
        .resize(COMPARE_WIDTH, dgH, { fit: 'fill' })
        .extract({ left: 0, top: 0, width: COMPARE_WIDTH, height: compareH })
        .removeAlpha()
        .raw()
        .toBuffer(),
    ]);

    const totalPixels = COMPARE_WIDTH * compareH;
    let diffPixels = 0;
    let maxDiff = 0;

    const threshold = 40; // per-channel threshold

    for (let i = 0; i < ssRaw.length; i += 3) {
      const dr = Math.abs(ssRaw[i] - dgRaw[i]);
      const dg = Math.abs(ssRaw[i+1] - dgRaw[i+1]);
      const db = Math.abs(ssRaw[i+2] - dgRaw[i+2]);
      const pixelDiff = Math.max(dr, dg, db);
      if (pixelDiff > maxDiff) maxDiff = pixelDiff;
      if (pixelDiff > threshold) diffPixels++;
    }

    const diffPercent = (diffPixels / totalPixels * 100).toFixed(2);

    results.push({
      page: screenshotName.replace('.png', ''),
      originalSS: `${ssMeta.width}x${ssMeta.height}`,
      originalDG: `${dgMeta.width}x${dgMeta.height}`,
      normalizedSize: `${COMPARE_WIDTH}x${compareH}`,
      diffPercent: parseFloat(diffPercent),
      diffPixels,
      totalPixels,
      maxChannelDiff: maxDiff,
    });

    const icon = diffPercent <= 5 ? '✅' : diffPercent <= 15 ? '⚠️' : '❌';
    console.log(`${icon} ${diffPercent}%  ${screenshotName} (${ssMeta.width}x${ssMeta.height} → ${dgMeta.width}x${dgMeta.height}, compare at ${COMPARE_WIDTH}x${compareH})`);
  } catch (err) {
    results.push({ page: screenshotName.replace('.png', ''), error: err.message });
    console.log(`🚫 ${screenshotName}: ${err.message}`);
  }
}

await fs.writeFile(REPORT_PATH, JSON.stringify(results, null, 2));

const ok = results.filter(r => r.diffPercent !== undefined && r.diffPercent <= 5).length;
const warn = results.filter(r => r.diffPercent !== undefined && r.diffPercent > 5 && r.diffPercent <= 15).length;
const bad = results.filter(r => r.diffPercent !== undefined && r.diffPercent > 15).length;

console.log(`\n=== NORMALIZED COMPARISON ===`);
console.log(`✅ Good (≤5%):  ${ok}`);
console.log(`⚠️ Warning (5-15%): ${warn}`);
console.log(`❌ Significant (>15%): ${bad}`);
