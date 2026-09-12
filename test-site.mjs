// Full functional check of index.html in jsdom, with real network for prices.  Run: node test-site.mjs
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const dom = new JSDOM(html, {
  url: "http://localhost:3000/?motion=1", runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
  beforeParse(w) {
    w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
    w.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe(el) { this.cb([{ isIntersecting: true, target: el }]); } unobserve() {} disconnect() {} };
    // real network: assets.json from disk, prices from DexScreener
    w.fetch = async (url, opts) => {
      if (String(url).includes("assets.json")) return { json: async () => JSON.parse(readFileSync("assets.json", "utf8")) };
      return fetch(url, opts);
    };
    Object.defineProperty(w.HTMLElement.prototype, "offsetWidth", { get() { return this.id === "wheel" ? 400 : 1200; } });
    Object.defineProperty(w.HTMLElement.prototype, "offsetHeight", { get() { return 800; } });
    w.scrollTo = () => {};
  },
});
const w = dom.window, d = w.document, $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
await new Promise(r => w.addEventListener("load", r));
await sleep(800);
if (w.anime) w.anime.engine.pauseOnDocumentHidden = false;
const errors = []; w.addEventListener("error", e => errors.push(e.message));

// 1. every in-page anchor resolves
const anchors = $$('a[href^="#"]').map(a => a.getAttribute("href")).filter(h => h.length > 1);
const missing = anchors.filter(h => !d.getElementById(h.slice(1)));
check("all in-page links resolve", missing.length === 0, missing.join(",") || anchors.length + " links");

// 2. no external links to stale brands
const ext = $$('a[href^="http"]').map(a => a.href);
check("no old handle / old brand links", !ext.some(h => /FSLonChain|FantasyStock|fantasystockleague/i.test(h)), ext.join(" ") || "none");

// 3. every button has a click handler
const dead = $$("button").filter(b => !b.onclick && !b.id.match(/^(copy)$/));
check("every button has a handler", dead.length === 0, dead.map(b => b.id || b.textContent.trim()).join(",") || $$("button").length + " buttons");

// 4. prices loaded from the chain
await sleep(6000);
const priced = $$(".asset .p .up, .asset .p .down").filter(e => e.textContent.trim()).length;
check("live prices loaded for stocks", priced >= 20, priced + " of " + $$(".asset").length);
check("ticker populated", $("#ticker").children.length >= 20, $("#ticker").children.length + " items");
check("second ticker populated", $("#ticker2").children.length === 29, $("#ticker2").children.length + " items");

// 5. countdown and ring tick
const c1 = $("#s-next").textContent; await sleep(1200); const c2 = $("#s-next").textContent;
check("countdown ticks", /^\d\d:\d\d$/.test(c2) && c1 !== c2, `${c1} -> ${c2}`);
check("ring has an offset", /^\d+(\.\d+)?$/.test($("#ring-fg").style.strokeDashoffset));

// 6. draft rules
$("#clear").click();
const card = t => $$(".asset").find(a => a.querySelector(".t").textContent === t);
const picks = () => w.eval("picks");
card("NVDA").click(); card("TSLA").click(); card("SPCX").click();
check("reserve rule blocks a third 4-pointer", picks().length === 2 && $("#toast").textContent.includes("unable to fill"), picks().join(","));
card("GLD").click(); card("SLV").click(); card("USO").click();
check("five picks reached, under budget", picks().length === 5 && w.eval("spent()") <= 12, picks().join(",") + " cost " + w.eval("spent()"));
card("SPY").click();
check("sixth pick refused", picks().length === 5 && $("#toast").textContent.includes("full"));
card("NVDA").click();
check("clicking a picked card removes it", picks().length === 4 && !picks().includes("NVDA"));
check("budget readout matches", +$("#b-left").textContent === 12 - w.eval("spent()"), $("#b-left").textContent + " left");
check("slots rendered", $$(".slot.filled").length === 4);
check("score shows a percent", /%$/.test($("#t-score").textContent), $("#t-score").textContent);

// 7. filters
$$(".chip").find(c => c.textContent === "4 pt").click();
check("filter shows only 4-pt cards", $$(".asset").every(a => a.querySelector(".cost").textContent.startsWith("4")), $$(".asset").length + " cards");
$$(".chip").find(c => c.textContent === "All").click();
check("filter All restores", $$(".asset").length === 29);

// 8. enter button responds
$("#enter").click();
check("enter button shows a message", $("#toast").textContent.length > 0, $("#toast").textContent);

// 9. clear
$("#clear").click();
check("clear empties the portfolio", picks().length === 0 && $$(".slot.filled").length === 0);

// 10. wheel: one spin adds one stock under the pointer
$("#spin").click(); await sleep(3800);
const landed = picks()[picks().length - 1]; const el = $$("#wheel .b").find(b => b.dataset.t === landed);
const m = el && /translate\(([-\d.]+)px,([-\d.]+)px\)/.exec(el.style.transform);
check("wheel adds exactly one stock", picks().length === 1, landed);
check("landed stock is under the pointer", m && Math.abs(+m[1]) < 8 && Math.abs(+m[2] + 196) < 8, m ? `${m[1]},${m[2]}` : "no transform");

// 11. localStorage persistence
check("portfolio saved to storage", JSON.parse(w.localStorage.getItem("hourly-team") || "[]").length === 1);

// 12. nothing left invisible after reveals
await sleep(1500);
const hidden = $$("[data-pre], .head, .moment, .step, .rule, .pod, .why .w, .flow .f, .status li").filter(e => e.style.opacity === "0");
check("no section stuck invisible", hidden.length === 0, hidden.length + " hidden");

// 13. text sanity
const txt = d.body.textContent;
check("no old brand text", !/Fantasy Stock League|FSLonChain|\bFSL\b/.test(txt));
check("brand present", /Hourly/.test(txt) && /\$HOURLY/.test(txt));
check("no script errors", errors.length === 0, errors.join(" | "));

const failed = results.filter(r => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
