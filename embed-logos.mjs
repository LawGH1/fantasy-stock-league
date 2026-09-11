// Embeds logos/*.png into index.html as data URIs so the page works as a single file.
// Re-run after adding or changing a logo:  node embed-logos.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const map = {};
for (const f of readdirSync("logos").filter(f => f.endsWith(".png"))) {
  map[f.replace(/\.png$/, "")] = "data:image/png;base64," + readFileSync("logos/" + f).toString("base64");
}
const block = `<script id="logo-data">window.LOGOS=${JSON.stringify(map)};</script>`;
let html = readFileSync("index.html", "utf8");
html = html.replace(/<script id="logo-data">[\s\S]*?<\/script>/, block);
writeFileSync("index.html", html);
console.log(`embedded ${Object.keys(map).length} logos, index.html is ${(html.length / 1024).toFixed(0)} KB`);
