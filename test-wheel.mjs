// Functional test of the wheel in jsdom.  Run: node test-wheel.mjs
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const dom = new JSDOM(html, {
  url: "http://localhost:3000/?motion=1",
  runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
  beforeParse(w) {
    w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
    w.fetch = () => Promise.reject(new Error("no network in test"));
    w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    Object.defineProperty(w.HTMLElement.prototype, "offsetWidth", { get() { return this.id === "wheel" ? 400 : 1200; } });
    Object.defineProperty(w.HTMLElement.prototype, "offsetHeight", { get() { return 800; } });
  },
});
const w = dom.window, d = w.document;
const sleep = ms => new Promise(r => setTimeout(r, ms));
await new Promise(r => w.addEventListener("load", r));
await sleep(500);
if (!w.anime) throw new Error("anime.js did not load");
w.anime.engine.pauseOnDocumentHidden = false;

d.querySelector("#clear").click();
const btn = d.querySelector("#spin");
const R = 400 / 2 - 4;
let ok = true;
for (let k = 1; k <= 5; k++) {
  btn.click();
  await sleep(3800);
  const picks = w.eval("picks"), ASSETS = w.eval("ASSETS");
  const landed = picks[picks.length - 1];
  const el = [...d.querySelectorAll("#wheel .b")].find(b => b.dataset.t === landed);
  const m = el && /translate\(([-\d.]+)px,([-\d.]+)px\)/.exec(el.style.transform);
  const x = m ? +m[1] : NaN, y = m ? +m[2] : NaN;
  const atTop = Math.abs(y + R) < 8 && Math.abs(x) < 8;
  const cost = picks.reduce((s, t) => s + ASSETS.find(a => a[0] === t)[3], 0);
  console.log(`spin ${k}: landed ${landed} at (${x.toFixed(1)}, ${y.toFixed(1)}) ${atTop ? "under pointer" : "NOT under pointer"} | picks ${picks.length} cost ${cost} | button "${btn.textContent}"${btn.disabled ? " (disabled)" : ""} | hub ${d.querySelector("#hub-big").textContent}`);
  if (!atTop || picks.length !== k || cost > 12) ok = false;
  await sleep(1300);
}
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
