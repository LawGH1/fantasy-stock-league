// Renders brand/*.svg to PNG with the site's fonts.  Run:  node brand/render.mjs
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const fontFiles = readdirSync("brand/fonts").filter(f => f.endsWith(".ttf")).map(f => "brand/fonts/" + f);
const jobs = [
  ["brand/pfp.svg", "brand/pfp.png", 800],
  ["brand/banner.svg", "brand/banner.png", 1500],
  ["brand/pfp.svg", "brand/favicon-192.png", 192],
];
for (const [src, out, width] of jobs) {
  const svg = readFileSync(src, "utf8");
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
  writeFileSync(out, png);
  console.log(`${out}  ${(png.length / 1024).toFixed(0)} KB`);
}
