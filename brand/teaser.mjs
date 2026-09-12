// Builds tweet images: brand/teaser.png (announcement) and brand/howto.png (three steps).  Run: node brand/teaser.mjs
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
const logo = t => "data:image/png;base64," + readFileSync(`logos/${t}.png`).toString("base64");
const badge = (t, x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r + 6}" fill="#0F1419"/><circle r="${r}" fill="#fff"/><image href="${logo(t)}" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" clip-path="url(#c${r})" preserveAspectRatio="xMidYMid slice"/></g>`;
const GRID = `<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1.5"/></pattern>`;
const AREA = `<linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1DB874" stop-opacity="0.22"/><stop offset="1" stop-color="#1DB874" stop-opacity="0"/></linearGradient>`;

// 1600x900 announcement card
const teaser = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>${GRID}${AREA}<clipPath id="c46"><circle r="46"/></clipPath>
    <radialGradient id="glow" cx="0.5" cy="0.7" r="0.6"><stop offset="0" stop-color="#1DB874" stop-opacity="0.18"/><stop offset="1" stop-color="#1DB874" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="#0F1419"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
  <path d="M0 760 L200 720 L380 745 L560 690 L740 710 L920 640 L1060 668 L1200 600 L1340 615 L1470 520 L1600 480 L1600 900 L0 900 Z" fill="url(#area)"/>
  <path d="M0 760 L200 720 L380 745 L560 690 L740 710 L920 640 L1060 668 L1200 600 L1340 615 L1470 520 L1600 480" fill="none" stroke="#1DB874" stroke-width="6" stroke-linejoin="round"/>
  ${badge("GME", 1060, 668, 46)}${badge("AAPL", 1200, 600, 46)}${badge("TSLA", 1340, 615, 46)}${badge("NVDA", 1470, 520, 46)}
  <text x="100" y="150" font-family="IBM Plex Mono" font-weight="600" font-size="22" letter-spacing="5" fill="#1DB874">COMING TO ROBINHOOD CHAIN</text>
  <text x="100" y="330" font-family="Fraunces" font-weight="800" font-size="160" fill="#ffffff">Hourly</text>
  <text x="100" y="430" font-family="Fraunces" font-weight="600" font-style="italic" font-size="64" fill="#1DB874">the stock draft that pays every hour</text>
  <text x="100" y="530" font-family="Inter" font-weight="500" font-size="36" fill="#C9D0D8">Draft five stocks. Beat the chain. <tspan fill="#1DB874">Paid every hour.</tspan></text>
  <text x="100" y="600" font-family="Inter" font-weight="500" font-size="26" fill="#7A8592">A new round every hour, 24/7. Top ten split the pot. Scored by on-chain prices.</text>
  <text x="100" y="820" font-family="IBM Plex Mono" font-weight="600" font-size="20" letter-spacing="3" fill="#7A8592">$HOURLY  ·  @FSLonChain</text>
</svg>`;

// 1600x900 three-step card
const step = (x, n, title, body1, body2) => `
  <rect x="${x}" y="300" width="440" height="420" rx="24" fill="#1B222B" stroke="#2A333D"/>
  <text x="${x + 36}" y="380" font-family="Fraunces" font-weight="800" font-size="72" fill="#1DB874">${n}</text>
  <text x="${x + 36}" y="450" font-family="Fraunces" font-weight="800" font-size="40" fill="#ffffff">${title}</text>
  <text x="${x + 36}" y="510" font-family="Inter" font-weight="500" font-size="24" fill="#C9D0D8">${body1}</text>
  <text x="${x + 36}" y="548" font-family="Inter" font-weight="500" font-size="24" fill="#C9D0D8">${body2}</text>`;
const howto = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>${GRID}<clipPath id="c30"><circle r="30"/></clipPath></defs>
  <rect width="1600" height="900" fill="#0F1419"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <text x="100" y="130" font-family="IBM Plex Mono" font-weight="600" font-size="22" letter-spacing="5" fill="#1DB874">HOW A ROUND WORKS</text>
  <text x="100" y="230" font-family="Fraunces" font-weight="800" font-size="72" fill="#ffffff">Sixty minutes. Then it starts again.</text>
  ${step(100, "1", "Draft", "Five stocks, twelve points.", "Nvidia costs 4, gold costs 1.")}
  ${step(580, "2", "Score", "Round opens at :00.", "Percent move, average of five.")}
  ${step(1060, "3", "Get paid", "Round closes at :00.", "Top ten paid within minutes.")}
  ${badge("NVDA", 160, 660, 30)}${badge("TSLA", 232, 660, 30)}${badge("GME", 304, 660, 30)}${badge("AAPL", 376, 660, 30)}${badge("COIN", 448, 660, 30)}
  <text x="640" y="672" font-family="IBM Plex Mono" font-weight="600" font-size="22" fill="#F2B544">NEXT ROUND 00:34:12</text>
  <text x="1096" y="672" font-family="IBM Plex Mono" font-weight="600" font-size="22" fill="#1DB874">+2.53%  →  1st place</text>
  <text x="100" y="820" font-family="IBM Plex Mono" font-weight="600" font-size="20" letter-spacing="3" fill="#7A8592">$HOURLY  ·  ROBINHOOD CHAIN  ·  @FSLonChain</text>
</svg>`;

function render(svg, out, width) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
  writeFileSync(out, png); console.log(`${out}  ${(png.length / 1024).toFixed(0)} KB`);
}
render(teaser, "brand/teaser.png", 1600);
render(howto, "brand/howto.png", 1600);
