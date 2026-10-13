// Builds dist-single/reading-app.html: the whole app in one self-contained page,
// for sharing as a web preview. Run with `npm run build:single`.
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

execSync("vite build --outDir dist-single/tmp --emptyOutDir", {
  stdio: "inherit",
  env: { ...process.env, VITE_ROUTER: "memory" },
});

const dir = "dist-single/tmp";
let html = readFileSync(`${dir}/index.html`, "utf8");

html = html.replace(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/, (_, f) => {
  const js = readFileSync(`${dir}/${f}`, "utf8").replace(/<\/script/gi, "<\\/script");
  return `<script type="module">${js}</script>`;
});
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"]+\.css)">/, (_, f) => `<style>${readFileSync(`${dir}/${f}`, "utf8")}</style>`);
// Manifest, icons and apple meta point at files that don't exist in a single page.
html = html.replace(/\s*<link rel="(manifest|icon|apple-touch-icon)"[^>]*>/g, "");

mkdirSync("dist-single", { recursive: true });
writeFileSync("dist-single/reading-app.html", html);
console.log("Wrote dist-single/reading-app.html", (html.length / 1024).toFixed(0), "kB");
