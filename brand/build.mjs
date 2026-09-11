// Builds pfp.png, banner.png, favicon-192.png.  Run:  node brand/build.mjs
// Concept: minimal. Dark ground, white FSL, one green rising line. Banner adds five clean logo circles.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
const logo = t => "data:image/png;base64," + readFileSync(`logos/${t}.png`).toString("base64");
const badge = (t, x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff"/><image href="${logo(t)}" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" clip-path="url(#c${r})" preserveAspectRatio="xMidYMid slice"/></g>`;

const pfp = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#0F1419"/>
  <text x="400" y="452" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="300" letter-spacing="-6" fill="#ffffff">FSL</text>
  <path d="M212 560 L330 522 L420 540 L520 490 L590 502 L640 470" fill="none" stroke="#1DB874" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <defs><clipPath id="c44"><circle r="44"/></clipPath></defs>
  <rect width="1500" height="500" fill="#0F1419"/>
  <!-- left 300px clear for the avatar -->
  <text x="340" y="214" font-family="Fraunces" font-weight="800" font-size="56" fill="#ffffff">Fantasy Stock League</text>
  <text x="340" y="268" font-family="Inter" font-weight="500" font-size="25" fill="#98A2AE">Draft five stocks. <tspan fill="#1DB874">Paid every hour.</tspan></text>
  <text x="340" y="314" font-family="IBM Plex Mono" font-weight="600" font-size="14" letter-spacing="3" fill="#5C6670">$FSL  ·  ROBINHOOD CHAIN</text>
  <!-- five logos, one row -->
  ${badge("NVDA", 1062, 250, 44)}
  ${badge("TSLA", 1160, 250, 44)}
  ${badge("AAPL", 1258, 250, 44)}
  ${badge("GME", 1356, 250, 44)}
  ${badge("SPCX", 1454, 250, 44)}
</svg>`;

function render(svg, out, width) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
  writeFileSync(out, png); console.log(`${out}  ${(png.length / 1024).toFixed(0)} KB`);
}
writeFileSync("brand/pfp.svg", pfp); writeFileSync("brand/banner.svg", banner);
render(pfp, "brand/pfp.png", 800);
render(pfp, "brand/favicon-192.png", 192);
render(banner, "brand/banner.png", 1500);
