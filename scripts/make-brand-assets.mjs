/**
 * Regenerates the favicon set from the wordmark font. Run: node scripts/make-favicons.mjs
 * Output (picked up by Next's file conventions): app/icon.png, app/apple-icon.png, app/favicon.ico.
 * A bold "P" in Unbounded (the wordmark face) on the site's near-black, with a magenta bar.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const fontFile = path.join(
  path.dirname(require.resolve("@fontsource-variable/unbounded/package.json")),
  "files/unbounded-latin-wght-normal.woff2",
);

// Inlined: a blank page cannot load a file:// font.
const fontData = readFileSync(fontFile).toString("base64");

const html = (size, round) => `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: U; src: url(data:font/woff2;base64,${fontData}); font-weight: 200 900; }
  html, body { margin: 0; background: transparent; }
  .icon { width: ${size}px; height: ${size}px; background: #07050d; position: relative; overflow: hidden;
    display: grid; place-items: center; border-radius: ${round ? size * 0.2 : 0}px; }
  .icon span { font: 800 ${size * 0.64}px/1 U; color: #f1effa; letter-spacing: -0.05em; transform: translate(-1%, -6%); }
  .icon i { position: absolute; left: 0; right: 0; bottom: 0; height: ${size * 0.13}px; background: #ff3fa4; }
</style><div class="icon"><span>P</span><i></i></div>`;

const browser = await chromium.launch();
// Rounded icons carry an alpha channel, which Next requires for the PNGs inside favicon.ico.
const render = async (size, round = true) => {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(html(size, round));
  await page.evaluate(() => document.fonts.load("800 64px U"));
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.locator(".icon").screenshot({ omitBackground: true });
  await page.close();
  return buf;
};

writeFileSync("app/icon.png", await render(512));
writeFileSync("app/apple-icon.png", await render(180, false));

// PNG-in-ICO: header, directory entries, then the PNG payloads.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => render(s)));
const head = Buffer.alloc(6);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
writeFileSync("app/favicon.ico", Buffer.concat([head, ...entries, ...pngs]));
await browser.close();
