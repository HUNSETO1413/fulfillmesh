import puppeteer from "puppeteer";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200));
const cards = await page.evaluate(() => {
  const wrap = document.querySelectorAll(".absolute.bg-white.rounded-xl");
  return [...document.querySelectorAll("div")].filter(d => /Supplier Matching|Quality Control|Shipping Routes|Overseas Warehouses/.test(d.textContent || "") && d.className.includes("absolute")).map(d => {
    const r = d.getBoundingClientRect();
    const s = getComputedStyle(d);
    return { txt: (d.textContent||"").slice(0,22), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), op: s.opacity, vis: s.visibility, disp: s.display };
  });
});
console.log(JSON.stringify(cards, null, 2));
await browser.close();
