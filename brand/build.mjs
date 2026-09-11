// Builds pfp.png, banner.png, favicon-192.png.  Run:  node brand/build.mjs
// Concept: the letters "FSL" cut out of a faded mosaic of stock logos, with a green edge.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
// Only marks that read at thumbnail size; text-only logos (SPDR, iShares, USCF) are left out of the mosaic.
const TICKERS = ["NVDA","TSLA","AAPL","GME","META","COIN","GOOGL","MSFT","RDDT","AMD","AMZN","MSTR","SOFI","PLTR","SPCX","TSM","RKLB","AMC"];
const logo = t => "data:image/png;base64," + readFileSync(`logos/${t}.png`).toString("base64");
const LOGO = Object.fromEntries(TICKERS.map(t => [t, logo(t)]));

const GRID = `<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1.5"/></pattern>`;

// A staggered field of round logo tiles covering a box. Deterministic order so it looks arranged, not random.
function mosaic(x0, y0, w, h, r, gap, opacity) {
  let out = "", i = 0; const step = r * 2 + gap;
  for (let row = 0, y = y0 + r; y < y0 + h + r; row++, y += step * 0.88) {
    const off = row % 2 ? step / 2 : 0;
    for (let x = x0 + r + off; x < x0 + w + r; x += step) {
      const t = TICKERS[i++ % TICKERS.length];
      out += `<g transform="translate(${x} ${y})" opacity="${opacity}"><circle r="${r}" fill="#fff"/><image href="${LOGO[t]}" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" clip-path="url(#cr${r})" preserveAspectRatio="xMidYMid slice"/></g>`;
    }
  }
  return `<defs><clipPath id="cr${r}"><circle r="${r}"/></clipPath></defs>` + out;
}

// Letters filled with mosaic + green tint, then a green outline on top.
function letters(text, x, y, size, anchor, r, gap) {
  const id = "t" + size;
  return `
  <defs>
    <clipPath id="${id}"><text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Fraunces" font-weight="800" font-size="${size}" letter-spacing="-${size * 0.03}">${text}</text></clipPath>
    <linearGradient id="tint${size}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F1419" stop-opacity="0.18"/><stop offset="1" stop-color="#0F1419" stop-opacity="0.55"/></linearGradient>
  </defs>
  <g clip-path="url(#${id})">
    <rect x="0" y="0" width="4000" height="4000" fill="#141B22"/>
    ${mosaic(0, 0, 1600, 900, r, gap, 0.95)}
    <rect x="0" y="0" width="4000" height="4000" fill="url(#tint${size})"/>
    <rect x="0" y="0" width="4000" height="4000" fill="#1DB874" fill-opacity="0.08"/>
  </g>
  <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Fraunces" font-weight="800" font-size="${size}" letter-spacing="-${size * 0.03}" fill="none" stroke="#1DB874" stroke-width="${size * 0.014}" stroke-linejoin="round">${text}</text>`;
}

const pfp = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>${GRID}
    <radialGradient id="glow" cx="0.5" cy="0.55" r="0.55"><stop offset="0" stop-color="#1DB874" stop-opacity="0.22"/><stop offset="1" stop-color="#1DB874" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="800" height="800" fill="#0F1419"/>
  <rect width="800" height="800" fill="url(#grid)"/>
  <rect width="800" height="800" fill="url(#glow)"/>
  ${letters("FSL", 400, 545, 410, "middle", 27, 7)}
</svg>`;

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <defs>${GRID}
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0F1419" stop-opacity="0"/><stop offset="1" stop-color="#0F1419" stop-opacity="0"/></linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1DB874" stop-opacity="0.18"/><stop offset="1" stop-color="#1DB874" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1500" height="500" fill="#0F1419"/>
  <rect width="1500" height="500" fill="url(#grid)"/>
  <!-- price line sweeping under the headline -->
  <path d="M0 420 L180 380 L330 405 L520 320 L700 350 L900 250 L1060 280 L1240 170 L1500 120 L1500 500 L0 500 Z" fill="url(#line)"/>
  <path d="M0 420 L180 380 L330 405 L520 320 L700 350 L900 250 L1060 280 L1240 170 L1500 120" fill="none" stroke="#1DB874" stroke-opacity="0.45" stroke-width="4" stroke-linejoin="round"/>
  <!-- giant letters on the right -->
  ${letters("FSL", 1476, 400, 330, "end", 22, 6)}
  <!-- left copy (left 300px clear for the avatar) -->
  <text x="330" y="118" font-family="IBM Plex Mono" font-weight="600" font-size="15" letter-spacing="3" fill="#98A2AE">FANTASY STOCK LEAGUE  ·  ROBINHOOD CHAIN</text>
  <text x="330" y="204" font-family="Fraunces" font-weight="800" font-size="66" fill="#ffffff">Draft <tspan font-weight="600" font-style="italic" fill="#1DB874">five</tspan> stocks.</text>
  <text x="330" y="276" font-family="Fraunces" font-weight="800" font-size="66" fill="#ffffff">Beat the chain.</text>
  <text x="330" y="348" font-family="Fraunces" font-weight="800" font-size="66" fill="#1DB874">Paid every hour.</text>
  <text x="330" y="400" font-family="Inter" font-weight="500" font-size="19" fill="#C9D0D8">A new round at the top of every hour, 24/7.</text>
</svg>`;

function render(svg, out, width) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
  writeFileSync(out, png); console.log(`${out}  ${(png.length / 1024).toFixed(0)} KB`);
}
writeFileSync("brand/pfp.svg", pfp); writeFileSync("brand/banner.svg", banner);
render(pfp, "brand/pfp.png", 800);
render(pfp, "brand/favicon-192.png", 192);
render(banner, "brand/banner.png", 1500);
