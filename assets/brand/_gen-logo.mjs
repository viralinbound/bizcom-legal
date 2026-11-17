// Generates the enhanced Bizcom Legal logo set as outlined SVGs.
import opentype from 'opentype.js';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const font = (w) => opentype.parse(fs.readFileSync(`node_modules/@fontsource/manrope/files/manrope-latin-${w}-normal.woff`).buffer);
const F800 = font(800), F600 = font(600);

const RED = '#C8102E', INK = '#0D0F12', WHITE = '#FFFFFF';

// Monogram on a 121.5 x 60.5 grid — redrawn from the original mark with
// consistent radii, a crisp notch and a smoother blade swoop.
const B = 'M0 0H59C65.4 0 69 3.6 69 10V27.6L66.4 31L71 35.6V50.6C71 56.8 67.3 60.5 61.1 60.5H0V23.5H48.4L50.6 21.3V15.7L48.4 13.5H0Z' +
          'M17 37H50.8L53 39.2V44.8L50.8 47H17Z';
const BLADE = 'M77.6 47H121.5V60.5H70.2C74.6 58.6 77.6 54.2 77.6 47Z';

function text(str, f, size, tracking) {
  // returns {d, width} with per-glyph tracking (em fraction)
  let x = 0, d = '';
  const glyphs = f.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    d += g.getPath(x, 0, size).toPathData(2);
    x += (g.advanceWidth / f.unitsPerEm) * size + (i < glyphs.length - 1 ? tracking * size : 0);
  });
  return { d, width: x };
}
const capH = (f, size) => (f.tables.os2.sCapHeight / f.unitsPerEm) * size;

function mono(blade) {
  return `<path fill="${RED}" fill-rule="evenodd" d="${B}"/><path fill="${blade}" d="${BLADE}"/>`;
}

// 1) Stacked lockup (original composition, refined)
function stacked(legalColor, bladeColor) {
  const size = 20, tr = 0.14;
  const a = text('BIZCOM', F800, size, tr), sp = size * 0.42, b = text('LEGAL', F600, size, tr);
  const total = a.width + sp + b.width, s = 121.5 / total;
  const ch = capH(F800, size) * s, y = 60.5 + 13 + ch;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 133.5 ${(y + 6).toFixed(1)}">` + mono(bladeColor) +
    `<g transform="translate(0 ${y.toFixed(2)}) scale(${s.toFixed(4)})"><path fill="${RED}" d="${a.d}"/>` +
    `<path fill="${legalColor}" transform="translate(${(a.width + sp).toFixed(2)} 0)" d="${b.d}"/></g></svg>`;
}

// 2) Horizontal lockup for nav/headers: monogram + two-line wordmark
function horizontal(legalColor, bladeColor) {
  const k = 0.62, mw = 121.5 * k, mh = 60.5 * k; // monogram scaled
  const size = 17, tr = 0.2;
  const a = text('BIZCOM', F800, size, tr), b = text('LEGAL', F600, size, tr);
  const ch = capH(F800, size);
  const gap = (mh - ch * 2) ; // distribute: two cap lines fill monogram height
  const x0 = mw + 13, y1 = ch, y2 = mh;
  // stretch LEGAL tracking so both lines share a width
  const extra = (a.width - b.width) / 4; // 5 letters → 4 gaps
  let d2 = '', x = 0;
  F600.stringToGlyphs('LEGAL').forEach((g, i) => { d2 += g.getPath(x, 0, size).toPathData(2); x += (g.advanceWidth / F600.unitsPerEm) * size + tr * size + extra; });
  const W = x0 + a.width;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(1)} ${mh.toFixed(1)}">` +
    `<g transform="scale(${k})">${mono(bladeColor)}</g>` +
    `<path fill="${RED}" transform="translate(${x0.toFixed(2)} ${y1.toFixed(2)})" d="${a.d}"/>` +
    `<path fill="${legalColor}" transform="translate(${x0.toFixed(2)} ${y2.toFixed(2)})" d="${d2}"/></svg>`;
}

// 3) Icon / favicon: monogram on a tile
function icon(bg, blade) {
  const s = 0.72, w = 121.5 * s, h = 60.5 * s, ox = (100 - w) / 2, oy = (100 - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="${bg}"/>` +
    `<g transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s})">${mono(blade)}</g></svg>`;
}

const files = {
  'logo-stacked.svg': stacked(INK, INK),
  'logo-stacked-reverse.svg': stacked(WHITE, WHITE),
  'logo-horizontal.svg': horizontal(INK, INK),
  'logo-horizontal-reverse.svg': horizontal(WHITE, WHITE),
  'monogram.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 125.5 64.5">${mono(INK)}</svg>`,
  'monogram-reverse.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 125.5 64.5">${mono(WHITE)}</svg>`,
  'favicon.svg': icon(INK, WHITE),
  'app-icon-light.svg': icon('#F4F5F7', INK),
};
for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(OUT, n), c);
fs.writeFileSync(path.join(OUT, 'paths.json'), JSON.stringify({ B, BLADE }));
console.log('wrote', Object.keys(files).join(', '));
