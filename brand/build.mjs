// Builds pfp.png, banner.png, favicon-192.png.  Run:  node brand/build.mjs
// Hourly marks. PFP: the hour ring with minute ticks, 45 of 60 filled, an H in the middle, soft glow.
// Banner: ring + wordmark, tagline, a faint giant ring watermark, five stocks riding the price line.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
const logo = t => "data:image/png;base64," + readFileSync(`logos/${t}.png`).toString("base64");
const badge = (t, x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r + 6}" fill="#0F1419"/><circle r="${r}" fill="#fff"/><image href="${logo(t)}" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" clip-path="url(#c${r})" preserveAspectRatio="xMidYMid slice"/></g>`;
const GRID = `<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1.5"/></pattern>`;
const INK = "#0F1419", GREEN = "#1DB874", DIM = "#2A333D";

// ring with 60 minute ticks; `filled` minutes are green
function ring(cx, cy, r, w, filled = 45, tick = true) {
  const C = 2 * Math.PI * r;
  let ticks = "";
  if (tick) for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI - Math.PI / 2; const big = i % 5 === 0;
    const r1 = r + w / 2 + 12, r2 = r1 + (big ? 22 : 10);
    ticks += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" stroke="${i < filled ? GREEN : DIM}" stroke-opacity="${big ? 1 : .55}" stroke-width="${big ? 5 : 3}" stroke-linecap="round"/>`;
  }
  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${DIM}" stroke-width="${w}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GREEN}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - filled / 60)).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
  ${ticks}`;
}

const pfp = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>${GRID}
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.55"><stop offset="0" stop-color="${GREEN}" stop-opacity="0.30"/><stop offset="0.6" stop-color="${GREEN}" stop-opacity="0.06"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="800" height="800" fill="${INK}"/>
  <rect width="800" height="800" fill="url(#grid)"/>
  <rect width="800" height="800" fill="url(#glow)"/>
  ${ring(400, 400, 236, 30, 45, true)}
  <circle cx="400" cy="400" r="196" fill="${INK}" fill-opacity=".55"/>
  <text x="400" y="486" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="250" fill="#ffffff">H</text>
</svg>`;

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <defs>${GRID}<clipPath id="c40"><circle r="40"/></clipPath>
    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GREEN}" stop-opacity="0.22"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></linearGradient>
    <radialGradient id="glow2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${GREEN}" stop-opacity="0.16"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1500" height="500" fill="${INK}"/>
  <rect width="1500" height="500" fill="url(#grid)"/>
  <!-- giant faint ring watermark on the right -->
  <g opacity="0.16">${ring(1180, 250, 300, 22, 45, true)}</g>
  <rect x="800" y="-100" width="700" height="700" fill="url(#glow2)"/>
  <!-- price line; logos ride it -->
  <path d="M0 400 L160 372 L300 392 L460 350 L640 366 L820 320 L1000 340 L1110 290 L1220 305 L1330 235 L1440 200 L1500 175 L1500 500 L0 500 Z" fill="url(#area)"/>
  <path d="M0 400 L160 372 L300 392 L460 350 L640 366 L820 320 L1000 340 L1110 290 L1220 305 L1330 235 L1440 200 L1500 175" fill="none" stroke="${GREEN}" stroke-width="5" stroke-linejoin="round" stroke-opacity="0.9"/>
  <!-- left copy (left 300px clear for the avatar) -->
  <g transform="translate(366 170)">${ring(0, 0, 24, 7, 45, false)}</g>
  <text x="410" y="200" font-family="Fraunces" font-weight="800" font-size="84" fill="#ffffff">Hourly</text>
  <text x="340" y="262" font-family="Inter" font-weight="500" font-size="27" fill="#C9D0D8">Draft five stocks. <tspan fill="${GREEN}">Paid every hour.</tspan></text>
  <text x="340" y="308" font-family="IBM Plex Mono" font-weight="600" font-size="14" letter-spacing="3" fill="#7A8592">$HOURLY  ·  ROBINHOOD CHAIN  ·  PLAYHOURLY.APP</text>
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
