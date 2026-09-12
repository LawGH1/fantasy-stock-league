// Builds the 8 thread images (brand/thread-1.png … thread-8.png) and the wheel-spin video frames.
// Run: node brand/thread.mjs        then encode frames with ffmpeg (see thread.md)
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";

const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
const logo = t => "data:image/png;base64," + readFileSync(`logos/${t}.png`).toString("base64");
const W = 1600, H = 900;
const INK = "#0F1419", CREAM = "#F5F1E8", GREEN = "#1DB874", MUTED_D = "#98A2AE", MUTED_L = "#6E7580", LINE_D = "#2A333D", LINE_L = "#E4DED2", AMBER = "#F2B544";
const GRID = `<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1.5"/></pattern>`;
const badge = (t, x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r + 5}" fill="${INK}"/><circle r="${r}" fill="#fff"/><image href="${logo(t)}" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" clip-path="url(#c${r})" preserveAspectRatio="xMidYMid slice"/></g>`;
const clip = r => `<clipPath id="c${r}"><circle r="${r}"/></clipPath>`;
const foot = (dark) => `<text x="100" y="830" font-family="IBM Plex Mono" font-weight="600" font-size="18" letter-spacing="3" fill="${dark ? MUTED_D : MUTED_L}">$HOURLY  ·  ROBINHOOD CHAIN  ·  @FSLonChain</text>`;
const dark = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${GRID}${clip(46)}${clip(40)}${clip(30)}</defs><rect width="${W}" height="${H}" fill="${INK}"/><rect width="${W}" height="${H}" fill="url(#grid)"/>${inner}${foot(true)}</svg>`;
const light = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${clip(46)}${clip(40)}${clip(30)}</defs><rect width="${W}" height="${H}" fill="${CREAM}"/>${inner}${foot(false)}</svg>`;
const render = (svg, out) => { const png = new Resvg(svg, { fitTo: { mode: "width", value: W }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng(); writeFileSync(out, png); console.log(out, (png.length / 1024).toFixed(0) + " KB"); };
const H1 = (y, text, fill = "#fff", size = 96) => `<text x="100" y="${y}" font-family="Fraunces" font-weight="800" font-size="${size}" fill="${fill}">${text}</text>`;
const SUB = (y, text, fill = MUTED_D, size = 34) => `<text x="100" y="${y}" font-family="Inter" font-weight="500" font-size="${size}" fill="${fill}">${text}</text>`;
const EYE = (y, text, fill = GREEN) => `<text x="100" y="${y}" font-family="IBM Plex Mono" font-weight="600" font-size="22" letter-spacing="5" fill="${fill}">${text}</text>`;

// 1. hook
render(dark(`
  ${EYE(150, "Hourly  ·  ROBINHOOD CHAIN")}
  ${H1(330, "Draft <tspan font-weight='600' font-style='italic' fill='" + GREEN + "'>five</tspan> stocks.", "#fff", 120)}
  ${H1(460, "Beat the chain.", "#fff", 120)}
  ${H1(590, "Paid every hour.", GREEN, 120)}
  <path d="M0 780 L260 740 L520 760 L800 690 L1080 710 L1340 620 L1600 580" fill="none" stroke="${GREEN}" stroke-width="5" stroke-opacity=".7"/>
  ${badge("NVDA", 1080, 710, 40)}${badge("GME", 1340, 620, 40)}${badge("TSLA", 800, 690, 40)}
`), "brand/thread-1.png");

// 2. one round = one hour (ring)
render(dark(`
  ${EYE(150, "HOW A ROUND WORKS")}
  ${H1(330, "One round.", "#fff", 110)}
  ${H1(450, "One hour.", GREEN, 110)}
  ${SUB(540, "Opens at :00. Closes at the next :00. Then it starts again.")}
  ${SUB(600, "24 rounds a day. Weekends too, the pools never close.")}
  <g transform="translate(1250 450)">
    <circle r="220" fill="none" stroke="${LINE_D}" stroke-width="26"/>
    <circle r="220" fill="none" stroke="${GREEN}" stroke-width="26" stroke-linecap="round" stroke-dasharray="1382" stroke-dashoffset="345" transform="rotate(-90)"/>
    <text y="18" text-anchor="middle" font-family="IBM Plex Mono" font-weight="600" font-size="72" fill="#fff">44:12</text>
    <text y="70" text-anchor="middle" font-family="IBM Plex Mono" font-weight="600" font-size="16" letter-spacing="4" fill="${MUTED_D}">UNTIL CLOSE</text>
  </g>
`), "brand/thread-2.png");

// 3. scoring
render(light(`
  ${EYE(150, "SCORING", "#128A56")}
  ${H1(330, "Percent move per stock.", INK, 88)}
  ${H1(430, "Average of five.", INK, 88)}
  ${SUB(520, "Prices are the on-chain pool price at open and at close. Nothing to argue with.", MUTED_L, 30)}
  <g font-family="IBM Plex Mono" font-weight="600" font-size="34">
    <g transform="translate(140 640)">${badge("NVDA", 0, 0, 30)}<text x="56" y="12" fill="${INK}">NVDA</text><text x="240" y="12" fill="#128A56">+3.06%</text></g>
    <g transform="translate(560 640)">${badge("GME", 0, 0, 30)}<text x="56" y="12" fill="${INK}">GME</text><text x="240" y="12" fill="#128A56">+3.38%</text></g>
    <g transform="translate(980 640)">${badge("TSLA", 0, 0, 30)}<text x="56" y="12" fill="${INK}">TSLA</text><text x="240" y="12" fill="#C8412F">-0.18%</text></g>
    <g transform="translate(140 730)">${badge("AAPL", 0, 0, 30)}<text x="56" y="12" fill="${INK}">AAPL</text><text x="240" y="12" fill="#128A56">+4.47%</text></g>
    <g transform="translate(560 730)">${badge("SPCX", 0, 0, 30)}<text x="56" y="12" fill="${INK}">SPCX</text><text x="240" y="12" fill="#128A56">+1.92%</text></g>
    <g transform="translate(980 730)"><text x="0" y="12" fill="${MUTED_L}">SCORE</text><text x="240" y="12" fill="#128A56" font-size="44">+2.53%</text></g>
  </g>
`), "brand/thread-3.png");

// 4. budget
render(dark(`
  ${EYE(150, "DRAFTING")}
  ${H1(330, "Twelve points.", "#fff", 110)}
  ${H1(450, "Five slots.", GREEN, 110)}
  ${SUB(540, "Big names cost 4. Quiet ones cost 1. Choose wisely.")}
  <g font-family="IBM Plex Mono" font-weight="600" font-size="26">
    ${[["NVDA", 4], ["TSLA", 4], ["SPCX", 4], ["GME", 3], ["PLTR", 3], ["COIN", 3], ["AAPL", 2], ["META", 2], ["AMD", 2]].map(([t, c], i) => { const x = 1000 + (i % 3) * 190, y = 250 + Math.floor(i / 3) * 150; return `${badge(t, x, y, 40)}<rect x="${x + 26}" y="${y - 66}" width="52" height="34" rx="8" fill="${GREEN}"/><text x="${x + 52}" y="${y - 42}" text-anchor="middle" fill="${INK}">${c}</text>`; }).join("")}
    <rect x="960" y="660" width="52" height="34" rx="8" fill="${GREEN}"/><text x="986" y="684" text-anchor="middle" fill="${INK}">1</text>
    <text x="1030" y="685" fill="${MUTED_D}" font-size="24">GLD · SLV · USO · SPY · QQQ</text>
  </g>
`), "brand/thread-4.png");

// 5. wheel (still)  + frames for the video
const N = 29, TICK = ["NVDA","TSLA","SPCX","MSTR","GME","PLTR","COIN","CRCL","IONQ","OKLO","RKLB","SMCI","AMD","META","AMZN","GOOGL","AAPL","MSFT","HIMS","RDDT","DJT","SOFI","AMC","TSM","GLD","SLV","USO","SPY","QQQ"];
const wheelSvg = (rot, hot = -1, dim = false, hub = "29", sub = "STOCKS ON THE WHEEL") => light(`
  ${EYE(150, "THE WHEEL", "#128A56")}
  ${H1(330, "One spin.", INK, 110)}
  ${H1(450, "One stock.", "#128A56", 110)}
  ${SUB(540, "Whatever stops under the pointer goes in", MUTED_L, 30)}
  ${SUB(586, "your next slot. It only lands on stocks", MUTED_L, 30)}
  ${SUB(632, "that still fit your budget.", MUTED_L, 30)}
  <g transform="translate(1180 470)">
    <circle r="330" fill="none" stroke="#cfc9bb" stroke-dasharray="6 8"/>
    ${TICK.map((t, i) => { const a = (rot + i * 360 / N) * Math.PI / 180; const x = Math.cos(a) * 330, y = Math.sin(a) * 330; const isHot = i === hot; return `<g opacity="${dim && !isHot ? .3 : 1}">${badge(t, x, y, isHot ? 34 : 26)}${isHot ? `<circle cx="${x}" cy="${y}" r="44" fill="none" stroke="${GREEN}" stroke-width="5"/>` : ""}</g>`; }).join("")}
    <text y="10" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="64" fill="${INK}">${hub}</text>
    <text y="48" text-anchor="middle" font-family="IBM Plex Mono" font-weight="600" font-size="14" letter-spacing="3" fill="${MUTED_L}">${sub}</text>
    <path d="M-14 -412 L14 -412 L0 -384 Z" fill="${INK}"/>
  </g>
`);
render(wheelSvg(-90 - 0 * 360 / N, 0, false), "brand/thread-5.png");

// video frames: 5 s spin easing out to NVDA under the pointer, then hold 1.5 s
mkdirSync("brand/frames", { recursive: true });
const FPS = 30, SPIN = 4.2, HOLD = 1.6, total = Math.round((SPIN + HOLD) * FPS);
const target = -90 - 0 * 360 / N + 360 * 4; const start = target - 360 * 4 - 137; // ends on NVDA (index 0)
const ease = p => 1 - Math.pow(1 - p, 3);
for (let f = 0; f < total; f++) {
  const t = f / FPS; const p = Math.min(1, t / SPIN); const rot = start + (target - start) * ease(p);
  const landed = t >= SPIN; const svg = wheelSvg(rot, landed ? 0 : -1, landed, landed ? "1/5" : "…", landed ? "NVDA ADDED · 4 PT" : "SPINNING");
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1280 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
  writeFileSync(`brand/frames/f${String(f).padStart(4, "0")}.png`, png);
}
console.log("frames:", total);

// 6. prizes
render(dark(`
  ${EYE(150, "PRIZES")}
  ${H1(330, "Top ten", "#fff", 110)}
  ${H1(450, "split the pot.", GREEN, 110)}
  ${SUB(540, "Fixed split, published up front.")}
  <g font-family="Fraunces" font-weight="800" text-anchor="middle">
    <rect x="1000" y="360" width="150" height="300" rx="14" fill="#1B222B" stroke="${LINE_D}"/><text x="1075" y="440" font-size="56" fill="#fff">18%</text><text x="1075" y="640" font-family="IBM Plex Mono" font-size="16" fill="${MUTED_D}">2ND</text>
    <rect x="1170" y="280" width="150" height="380" rx="14" fill="${GREEN}"/><text x="1245" y="370" font-size="64" fill="${INK}">30%</text><text x="1245" y="640" font-family="IBM Plex Mono" font-size="16" fill="${INK}">1ST</text>
    <rect x="1340" y="420" width="150" height="240" rx="14" fill="#1B222B" stroke="${LINE_D}"/><text x="1415" y="500" font-size="56" fill="#fff">12%</text><text x="1415" y="640" font-family="IBM Plex Mono" font-size="16" fill="${MUTED_D}">3RD</text>
  </g>
  <text x="960" y="720" font-family="IBM Plex Mono" font-weight="600" font-size="17" fill="${MUTED_D}">4th 9% · 5th 7% · 6th 6% · 7th 5% · 8th 5% · 9th 4% · 10th 4%</text>
`), "brand/thread-6.png");

// 7. token split
render(light(`
  ${EYE(150, "$HOURLY", "#128A56")}
  ${H1(330, "Where every entry goes.", INK, 88)}
  <g font-family="Fraunces" font-weight="800">
    <rect x="100" y="420" width="1200" height="110" rx="16" fill="${GREEN}"/><text x="130" y="497" font-size="64" fill="${INK}">85%</text><text x="330" y="490" font-family="Inter" font-weight="600" font-size="34" fill="${INK}">Prize pot. Paid to the top ten every hour.</text>
    <rect x="100" y="550" width="1200" height="90" rx="16" fill="#fff" stroke="${LINE_L}"/><text x="130" y="612" font-size="48" fill="${INK}">10%</text><text x="330" y="606" font-family="Inter" font-weight="600" font-size="30" fill="${INK}">Buyback. Buys $HOURLY from the pool.</text>
    <rect x="100" y="660" width="1200" height="90" rx="16" fill="#fff" stroke="${LINE_L}"/><text x="130" y="722" font-size="48" fill="${INK}">5%</text><text x="330" y="716" font-family="Inter" font-weight="600" font-size="30" fill="${INK}">Hourly. Keeps the engine running.</text>
  </g>
`), "brand/thread-7.png");

// 8. CTA
render(dark(`
  ${EYE(150, "LIVE NOW  ·  NO WALLET NEEDED")}
  ${H1(360, "Build a portfolio.", "#fff", 110)}
  ${H1(480, "Spin the wheel.", "#fff", 110)}
  ${H1(600, "fantasystockleague.app", GREEN, 92)}
  ${SUB(690, "Contract address and first round time posted here.")}
`), "brand/thread-8.png");
