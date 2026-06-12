// Screenshot harness for design-fidelity comparison.
// Usage: node _shot.mjs <route> <outName> [width] [full|view]
//   route   e.g. /  or  /dashboard  or  /pricing
//   outName e.g. home  (writes shots/home.png)
//   width   viewport width, default 1440
//   mode    "full" = full-page (default), "view" = viewport only
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";

const [, , route = "/", outName = "shot", widthArg = "1440", mode = "full", heightArg = "900"] = process.argv;
const width = parseInt(widthArg, 10);
const height = parseInt(heightArg, 10);
const fullPage = mode !== "view";

mkdirSync("shots", { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });

// retry goto — dev server may be mid-recompile under concurrent edits
let ok = false;
for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
  try {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "load", timeout: 45000 });
    ok = true;
  } catch (e) {
    console.error(`goto attempt ${attempt} failed: ${e.message}`);
    await new Promise((r) => setTimeout(r, 2000));
  }
}
if (!ok) { console.error("FAILED to load after retries"); await browser.close(); process.exit(1); }

// settle: wait for fonts + any lazy content
await page.evaluate(() => document.fonts.ready).catch(() => {});
await new Promise((r) => setTimeout(r, 1200));

const out = `shots/${outName}.png`;
await page.screenshot({ path: out, fullPage });
console.log("saved", out);
await browser.close();
