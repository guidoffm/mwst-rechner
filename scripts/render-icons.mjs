// Erzeugt die Icons und Splashscreens in assets/ (Aufruf: node scripts/render-icons.mjs assets)
import { chromium } from 'playwright';
const out = process.argv[2];
const bg = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4FD8D0"/><stop offset="1" stop-color="#0B2F35"/></linearGradient></defs>`;
// Glyph: großes Prozentzeichen mit Euro-Münze, zentriert in 1024er Box
const glyph = (scale) => `
<g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
  <line x1="300" y1="760" x2="724" y2="264" stroke="#E6FFFC" stroke-width="72" stroke-linecap="round"/>
  <circle cx="340" cy="330" r="92" fill="none" stroke="#E6FFFC" stroke-width="62"/>
  <circle cx="684" cy="694" r="92" fill="none" stroke="#E6FFFC" stroke-width="62"/>
</g>`;
const svgs = {
  'icon-only.png': [1024, `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${bg('g')}<rect width="1024" height="1024" fill="url(#g)"/>${glyph(0.92)}</svg>`],
  'icon-background.png': [1024, `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${bg('g')}<rect width="1024" height="1024" fill="url(#g)"/></svg>`],
  'icon-foreground.png': [1024, `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${glyph(0.62)}</svg>`],
  'splash.png': [2732, `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732"><rect width="2732" height="2732" fill="#FFFFFF"/><g transform="translate(1110 1110) scale(0.5)">${bg('g')}<rect width="1024" height="1024" rx="230" fill="url(#g)"/>${glyph(0.92)}</g></svg>`],
  'splash-dark.png': [2732, `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732"><rect width="2732" height="2732" fill="#121212"/><g transform="translate(1110 1110) scale(0.5)">${bg('g')}<rect width="1024" height="1024" rx="230" fill="url(#g)"/>${glyph(0.92)}</g></svg>`],
};
const browser = await chromium.launch();
for (const [name, [size, svg]] of Object.entries(svgs)) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await page.screenshot({ path: `${out}/${name}`, omitBackground: true });
  await page.close();
}
await browser.close();
