// Builds pfp.png, banner.png, favicon-192.png.  Run:  node brand/build.mjs
// Concept: minimal with one layer of depth. Faint grid, soft green glow, HOURLY in white, a green price line.
// On the banner, five stock logos sit on the line as its rising points.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
const logo = t => "data:image/png;base64," + readFileSync(`logos/${t}.png`).toString("base64");
const badge = (t, x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r + 6}" fill="#0F1419"/><circle r="${r}" fill="#fff"/><image href="${logo(t)}" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" clip-path="url(#c${r})" preserveAspectRatio="xMidYMid slice"/></g>`;
const GRID = `<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1.5"/></pattern>`;

const pfp = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>${GRID}
    <radialGradient id="glow" cx="0.5" cy="0.62" r="0.5"><stop offset="0" stop-color="#1DB874" stop-opacity="0.26"/><stop offset="1" stop-color="#1DB874" stop-opacity="0"/></radialGradient>
    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1DB874" stop-opacity="0.35"/><stop offset="1" stop-color="#1DB874" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="800" height="800" fill="#0F1419"/>
  <rect width="800" height="800" fill="url(#grid)"/>
  <rect width="800" height="800" fill="url(#glow)"/>
  <!-- the hour ring: 45 of 60 minutes filled, with the H inside -->
  <circle cx="400" cy="400" r="250" fill="none" stroke="#2A333D" stroke-width="34"/>
  <circle cx="400" cy="400" r="250" fill="none" stroke="#1DB874" stroke-width="34" stroke-linecap="round" stroke-dasharray="1571" stroke-dashoffset="393" transform="rotate(-90 400 400)"/>
  <circle cx="400" cy="150" r="22" fill="#0F1419" stroke="#1DB874" stroke-width="10"/>
  <text x="400" y="478" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="260" fill="#ffffff">H</text>
</svg>`;

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <defs>${GRID}<clipPath id="c40"><circle r="40"/></clipPath>
    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1DB874" stop-opacity="0.22"/><stop offset="1" stop-color="#1DB874" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1500" height="500" fill="#0F1419"/>
  <rect width="1500" height="500" fill="url(#grid)"/>
  <!-- price line across the banner; logos sit on its points on the right -->
  <path d="M0 400 L160 372 L300 392 L460 350 L640 366 L820 320 L1000 340 L1110 290 L1220 305 L1330 235 L1440 200 L1500 175 L1500 500 L0 500 Z" fill="url(#area)"/>
  <path d="M0 400 L160 372 L300 392 L460 350 L640 366 L820 320 L1000 340 L1110 290 L1220 305 L1330 235 L1440 200 L1500 175" fill="none" stroke="#1DB874" stroke-width="5" stroke-linejoin="round" stroke-opacity="0.9"/>
  <!-- left copy (left 300px clear for the avatar) -->
  <g transform="translate(340 168)"><circle cx="0" cy="0" r="22" fill="none" stroke="#2A333D" stroke-width="6"/><circle cx="0" cy="0" r="22" fill="none" stroke="#1DB874" stroke-width="6" stroke-linecap="round" stroke-dasharray="138" stroke-dashoffset="35" transform="rotate(-90)"/></g>
  <text x="378" y="196" font-family="Fraunces" font-weight="800" font-size="72" fill="#ffffff">Hourly</text>
  <text x="340" y="252" font-family="Inter" font-weight="500" font-size="25" fill="#C9D0D8">Draft five stocks. <tspan fill="#1DB874">Paid every hour.</tspan></text>
  <text x="340" y="298" font-family="IBM Plex Mono" font-weight="600" font-size="14" letter-spacing="3" fill="#7A8592">$HOURLY  ·  ROBINHOOD CHAIN</text>
  <!-- five logos on the line -->
  ${badge("GME", 1000, 340, 40)}
  ${badge("AAPL", 1110, 290, 40)}
  ${badge("TSLA", 1220, 305, 40)}
  ${badge("NVDA", 1330, 235, 40)}
  ${badge("SPCX", 1440, 200, 40)}
</svg>`;

function render(svg, out, width) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
  writeFileSync(out, png); console.log(`${out}  ${(png.length / 1024).toFixed(0)} KB`);
}
writeFileSync("brand/pfp.svg", pfp); writeFileSync("brand/banner.svg", banner);
render(pfp, "brand/pfp.png", 800);
render(pfp, "brand/favicon-192.png", 192);
render(banner, "brand/banner.png", 1500);
