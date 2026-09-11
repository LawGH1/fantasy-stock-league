// Stat card for tweets, Route-style: one big number, one label, brand mark.
// Usage: node brand/stat.mjs "$10K+" "total swap volume" brand/out.png [dark|light]
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const [big = "0", label = "", out = "brand/stat.png", theme = "light"] = process.argv.slice(2);
const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
const dark = theme === "dark";
const bg = dark ? "#0F1419" : "#F5F1E8", ink = dark ? "#ffffff" : "#0F1419", muted = dark ? "#98A2AE" : "#6E7580", line = dark ? "#2A333D" : "#E4DED2";
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const size = big.length <= 5 ? 220 : big.length <= 9 ? 170 : 130;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="${bg}"/>
  <text x="110" y="140" font-family="Fraunces" font-weight="800" font-size="34" fill="${ink}">Fantasy Stock League</text>
  <text x="110" y="500" font-family="Fraunces" font-weight="800" font-size="${size}" fill="${ink}">${esc(big)}</text>
  <text x="110" y="580" font-family="Inter" font-weight="500" font-size="44" fill="${muted}">${esc(label)}</text>
  <path d="M1080 700 C 1180 700, 1180 300, 1300 300 S 1420 620, 1500 200" fill="none" stroke="#1DB874" stroke-width="4"/>
  <circle cx="1080" cy="700" r="7" fill="#1DB874"/><circle cx="1500" cy="200" r="7" fill="#1DB874"/>
  <line x1="110" y1="780" x2="1490" y2="780" stroke="${line}"/>
  <text x="110" y="828" font-family="IBM Plex Mono" font-weight="600" font-size="18" letter-spacing="3" fill="${muted}">$FSL  ·  ROBINHOOD CHAIN  ·  @FantasyStocksRH</text>
</svg>`;
const png = new Resvg(svg, { fitTo: { mode: "width", value: 1600 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
writeFileSync(out, png); console.log(`${out}  ${(png.length / 1024).toFixed(0)} KB`);
