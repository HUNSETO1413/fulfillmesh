/**
 * Pixel-diff: compare each screenshot against its design mockup.
 * Outputs a JSON report + diff images where differences are highlighted.
 */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

// We'll use a simple pixel comparison approach with Canvas
// Since we're on Node, let's use sharp for image processing

const SCREENSHOTS_DIR = 'd:/web/fulfillmesh/screenshots';
const DESIGN_DIR = 'd:/web/fulfillmesh/设计稿';
const DIFF_DIR = 'd:/web/fulfillmesh/diffs';
const REPORT_PATH = 'd:/web/fulfillmesh/diff-report.json';

// Mapping: screenshot name → design mockup name
const mappings = [
  // 前台
  ['首页.png', '首页.png'],
  ['solutions列表页.png', 'solutions列表页.png'],
  ['solutions列表页-Supplier Matching.png', 'solutions列表页-Supplier Matching.png'],
  ['solutions列表页-Overseas Warehousing.png', 'solutions列表页-Overseas Warehousing.png'],
  ['solutions列表页-Quality Control.png', 'solutions列表页-Quality Control.png'],
  ['solutions列表页-Inventory Visibility.png', 'solutions列表页-Inventory Visibility.png'],
  ['solutions列表页-Packaging & Labeling.png', 'solutions列表页-Packaging & Labeling.png'],
  ['solutions列表页-Returns Management.png', 'solutions列表页-Returns Management.png'],
  ['solutions列表页-Shipping & Logistics.png', 'solutions列表页-Shipping & Logistics.png'],
  ['solutions列表页-Analytics & Reporting.png', 'solutions列表页-Analytics & Reporting.png'],
  ['Pricing 页.png', 'Pricing 页.png'],
  ['How It Works 页.png', 'How It Works 页.png'],
  ['Resources 页.png', 'Resources 页.png'],
  ['Resources 页-Guides列表页.png', 'Resources 页-Guides列表页.png'],
  ['Resources 页-Guides列表页-详情页.png', 'Resources 页-Guides列表页-详情页.png'],
  ['Resources 页-Case Studies列表页.png', 'Resources 页-Case Studies列表页.png'],
  ['Resources 页-Case Studies列表页-详情页.png', 'Resources 页-Case Studies列表页-详情页.png'],
  ['Resources 页-Help Center列表页.png', 'Resources 页-Help Center列表页.png'],
  ['Resources 页-Help Center列表页-详情页.png', 'Resources 页-Help Center列表页-详情页.png'],
  ['Resources 页-API Documentation页.png', 'Resources 页-API Documentation页.png'],
  ['Resources 页-Shipping Insights页.png', 'Resources 页-Shipping Insights页.png'],
  ['Resources 页-Supplier Playbooks页.png', 'Resources 页-Supplier Playbooks页.png'],
  ['blog页.png', 'blog页.png'],
  ['blog页-文章详情.png', 'blog页-文章详情.png'],
  ['Contact Us.png', 'Contact Us.png'],
  ['Book a Demo.png', 'Book a Demo.png'],
  ['Onboarding.png', 'Onboarding.png'],
  // 认证
  ['登录注册页-login.png', '登录注册页.png'],
  ['登录注册页-register.png', '登录注册页.png'],
  ['忘记密码页.png', '忘记密码页.png'],
  ['创建新密码页.png', '创建新密码页.png'],
  ['Email Verification.png', 'Email Verification.png'],
  // 后台核心
  ['后台-overview页.png', '后台-overview页.png'],
  ['后台-order页.png', '后台-order页.png'],
  ['后台-order页-详情页.png', '后台-order页-详情页.png'],
  ['后台-shipments页.png', '后台-shipments页.png'],
  ['后台-shipments页-详情页.png', '后台-shipments页-详情页.png'],
  ['后台-inventory页.png', '后台-inventory页.png'],
  ['后台-inventory页-详情页.png', '后台-inventory页-详情页.png'],
  ['后台-returns页.png', '后台-returns页.png'],
  ['后台-returns页-详情页.png', '后台-returns页-详情页.png'],
  ['后台-customers页.png', '后台-customers页.png'],
  ['后台-customers页-详情页.png', '后台-customers页-详情页.png'],
  ['后台-analytics页.png', '后台-analytics页.png'],
  ['后台-reports页.png', '后台-reports页.png'],
  ['后台-Product页.png', '后台-Product页.png'],
  ['后台-Product页-Product Detail.png', '后台-Product页-Product Detail.png'],
  ['后台-Quote页.png', '后台-Quote页.png'],
  ['后台-Quote页-Quote Detail.png', '后台-Quote页-Quote Detail.png'],
  ['后台-Suppliers页.png', '后台-Suppliers页.png'],
  ['后台-Suppliers页-详情页.png', '后台-Suppliers页-详情页.png'],
  ['后台-QC Inspections页.png', '后台-QC Inspections页.png'],
  ['后台-QC Inspections页-详情页.png', '后台-QC Inspections页-详情页.png'],
  // 设置
  ['后台-settins页.png', '后台-settins页.png'],
  ['后台-settins页-security.png', '后台-settins页-security.png'],
  ['后台-settins页-integrations.png', '后台-settins页-integrations.png'],
  ['后台-settins页-billing.png', '后台-settins页-billing.png'],
  ['后台-settins页-notifications.png', '后台-settins页-notifications.png'],
  ['后台-settins页-carriers.png', '后台-settins页-carriers.png'],
  ['后台-settins页-users.png', '后台-settins页-users.png'],
  ['后台-settins页-warehouses.png', '后台-settins页-warehouses.png'],
  // 仓储
  ['Warehouse Operations Storage.png', 'Warehouse Operations Storage｜仓储运营 存储管理页.png'],
  ['Warehouse Inventory.png', 'Warehouse Inventory｜仓储库存管理页.png'],
  ['Warehouse Outbound Shipments.png', 'Warehouse Outbound Shipments｜出库管理页.png'],
  ['Warehouse Transfers.png', 'Warehouse Transfers｜库存调拨 仓库转移页.png'],
  ['Warehouse Cycle Count.png', 'Warehouse Cycle Count｜盘点管理页.png'],
  ['Warehouse Locations.png', 'Warehouse Locations.png'],
  ['Warehouse Storage Types.png', 'Warehouse Storage Types.png'],
  // 运营
  ['Tasks Operations.png', 'Tasks Operations｜任务运营中心页.png'],
  ['Messages Inbox.png', 'Messages Inbox｜消息中心页.png'],
  ['Documents.png', 'Documents｜文件中心页.png'],
  ['Notifications.png', 'Notifications｜通知中心页.png'],
  ['Invoices Payments.png', 'Invoices Payments｜发票与支付页.png'],
  ['Operational Reports.png', 'Operational Reports.png'],
  ['Productivity.png', 'Productivity.png'],
  ['Order Performance Report.png', 'Order Performance Report.png'],
  ['Exception Reports.png', 'Exception Reports｜异常报告页.png'],
  ['Users & Roles.png', 'Users & Roles｜用户与角色管理页.png'],
  ['System Settings.png', 'System Settings｜系统设置页.png'],
  ['Integrations.png', 'Integrations｜集成管理页.png'],
  ['Audit Logs.png', 'Audit Logs.png'],
  ['API Keys.png', 'API Keys｜API 密钥管理页.png'],
  // 法律合规及其他
  ['Terms of Service.png', 'Terms of Service.png'],
  ['Privacy Policy.png', 'Privacy Policy.png'],
  ['Cookie Policy.png', 'Cookie Policy｜Cookie.png'],
  ['Data Processing Agreement.png', 'Data Processing Agreement｜数据处理协议页.png'],
  ['Compliance Security.png', 'Compliance Security｜合规与安全页.png'],
  ['Glossary.png', 'Glossary.png'],
  ['Comparison Alternatives.png', 'Comparison Alternatives｜对比与替代方案页.png'],
  ['Status Page.png', 'Status Page｜系统状态页.png'],
  ['Packaging Requests.png', 'Packaging Requests｜包装请求页.png'],
  ['Integration Marketplace.png', 'Integration Marketplace.png'],
  ['共建未来列表页.png', '共建未来列表页.png'],
  ['共建未来详情页.png', '共建未来详情页.png'],
];

// Check if sharp is available
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('sharp not found, installing...');
  const { execSync } = await import('child_process');
  execSync('npm install sharp', { cwd: 'd:/web/fulfillmesh', stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

await fs.mkdir(DIFF_DIR, { recursive: true });

const results = [];

for (const [screenshotName, designName] of mappings) {
  const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
  const designPath = path.join(DESIGN_DIR, designName);

  try {
    // Check files exist
    await fs.access(screenshotPath);
    await fs.access(designPath);

    // Get image metadata
    const [ssMeta, dgMeta] = await Promise.all([
      sharp(screenshotPath).metadata(),
      sharp(designPath).metadata(),
    ]);

    // Resize both to same dimensions for comparison (use the smaller dimensions)
    const targetWidth = Math.max(ssMeta.width, dgMeta.width);
    const targetHeight = Math.max(ssMeta.height, dgMeta.height);

    // Resize and get raw pixel data
    const [ssRaw, dgRaw] = await Promise.all([
      sharp(screenshotPath).resize(targetWidth, targetHeight, { fit: 'fill' }).raw().toBuffer(),
      sharp(designPath).resize(targetWidth, targetHeight, { fit: 'fill' }).raw().toBuffer(),
    ]);

    // Compare pixels
    const totalPixels = targetWidth * targetHeight;
    let diffPixels = 0;
    const diffBuf = Buffer.alloc(ssRaw.length);

    const threshold = 30; // color difference threshold per channel

    for (let i = 0; i < ssRaw.length; i += ssMeta.channels || 3) {
      const channels = ssMeta.channels || 3;
      let isDiff = false;
      for (let c = 0; c < channels && c < (dgMeta.channels || 3); c++) {
        if (Math.abs(ssRaw[i + c] - dgRaw[i + c]) > threshold) {
          isDiff = true;
          break;
        }
      }
      if (isDiff) {
        diffPixels++;
        // Mark diff pixels in red
        for (let c = 0; c < diffBuf.length / totalPixels; c++) {
          if (c === 0) diffBuf[i] = 255;      // R
          else if (c === 1) diffBuf[i + 1] = 0; // G
          else if (c === 2) diffBuf[i + 2] = 0; // B
          if (channels === 4) diffBuf[i + 3] = 255; // A
        }
      } else {
        for (let c = 0; c < channels; c++) {
          diffBuf[i + c] = ssRaw[i + c];
        }
      }
    }

    const diffPercent = (diffPixels / totalPixels * 100).toFixed(2);

    // Save diff image if significant differences
    if (diffPixels / totalPixels > 0.01) {
      const channels = ssMeta.channels || 3;
      await sharp(diffBuf, {
        raw: { width: targetWidth, height: targetHeight, channels }
      }).png().toFile(path.join(DIFF_DIR, screenshotName));
    }

    results.push({
      page: screenshotName.replace('.png', ''),
      screenshotSize: `${ssMeta.width}x${ssMeta.height}`,
      designSize: `${dgMeta.width}x${dgMeta.height}`,
      diffPercent: parseFloat(diffPercent),
      diffPixels,
      totalPixels,
      hasDiffImage: diffPixels / totalPixels > 0.01,
    });

    console.log(`${diffPercent > 5 ? '❌' : diffPercent > 1 ? '⚠️' : '✅'} ${screenshotName}: ${diffPercent}% diff (${ssMeta.width}x${ssMeta.height} vs ${dgMeta.width}x${dgMeta.height})`);
  } catch (err) {
    results.push({
      page: screenshotName.replace('.png', ''),
      error: err.message,
    });
    console.log(`🚫 ${screenshotName}: ERROR - ${err.message}`);
  }
}

// Save report
await fs.writeFile(REPORT_PATH, JSON.stringify(results, null, 2));

// Summary
const ok = results.filter(r => r.diffPercent !== undefined && r.diffPercent <= 5).length;
const warn = results.filter(r => r.diffPercent !== undefined && r.diffPercent > 5 && r.diffPercent <= 15).length;
const bad = results.filter(r => r.diffPercent !== undefined && r.diffPercent > 15).length;
const err = results.filter(r => r.error).length;

console.log(`\n=== PIXEL DIFF SUMMARY ===`);
console.log(`✅ Good (≤5% diff): ${ok}`);
console.log(`⚠️ Warning (5-15% diff): ${warn}`);
console.log(`❌ Significant (>15% diff): ${bad}`);
console.log(`🚫 Error: ${err}`);
console.log(`Total: ${results.length}`);
console.log(`\nReport saved to: ${REPORT_PATH}`);

if (bad > 0 || warn > 0) {
  console.log(`\nPages with >5% difference:`);
  results.filter(r => r.diffPercent > 5).sort((a, b) => b.diffPercent - a.diffPercent)
    .forEach(r => console.log(`  ${r.diffPercent}% - ${r.page} (${r.screenshotSize} vs ${r.designSize})`));
}
