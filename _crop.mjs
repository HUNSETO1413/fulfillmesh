// Crop a region of an image for close inspection.
// Usage: node _crop.mjs <imgPath> <outName> <topPct> <bottomPct>
import puppeteer from "puppeteer";
import { mkdirSync, readFileSync } from "fs";
import path from "path";

const [, , imgPath, outName = "crop", topPct = "0", bottomPct = "100"] = process.argv;
mkdirSync("shots", { recursive: true });

const buf = readFileSync(imgPath);
const b64 = buf.toString("base64");
const ext = path.extname(imgPath).slice(1) || "png";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
await page.setContent(
  `<html><body style="margin:0"><img id="i" src="data:image/${ext};base64,${b64}" style="display:block;width:1000px"/></body></html>`
);
await page.evaluate(() => new Promise((r) => { const i = document.getElementById("i"); if (i.complete) r(); else i.onload = r; }));
const dims = await page.evaluate(() => { const i = document.getElementById("i"); return { w: i.clientWidth, h: i.clientHeight }; });
const top = (parseFloat(topPct) / 100) * dims.h;
const bottom = (parseFloat(bottomPct) / 100) * dims.h;
await page.setViewport({ width: dims.w, height: Math.ceil(bottom - top), deviceScaleFactor: 1 });
await page.screenshot({ path: `shots/${outName}.png`, clip: { x: 0, y: top, width: dims.w, height: bottom - top } });
console.log(`saved shots/${outName}.png (img ${dims.w}x${dims.h}, crop ${top}-${bottom})`);
await browser.close();
