// Generates the player sprite (public/assets/player.png) from scratch.
// Original geometric art (a faceted crystal), no external assets, no dependencies.
// License: CC0 / public domain. Run with: node tools/gen-sprite.js
"use strict";

const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const W = 64;
const H = 128;

// RGBA buffer, fully transparent to start.
const px = new Uint8Array(W * H * 4);

function set(x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  px[i] = r;
  px[i + 1] = g;
  px[i + 2] = b;
  px[i + 3] = a;
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const hit = (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function fillPoly(poly, r, g, b, a) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // sample the pixel centre for slightly tighter edges
      if (pointInPoly(x + 0.5, y + 0.5, poly)) set(x, y, r, g, b, a);
    }
  }
}

// Crystal anchor points inside the 64x128 frame. The base point B sits near
// the bottom so the sprite "stands" on a tile.
const T = [32, 18];   // top apex
const L = [9, 58];    // left girdle
const R = [55, 58];   // right girdle
const B = [32, 118];  // bottom apex
const MidTop = [32, 40];

// soft contact shadow on the ground
for (let y = 108; y < 122; y++) {
  for (let x = 0; x < W; x++) {
    const dx = (x - 32) / 22;
    const dy = (y - 115) / 6;
    if (dx * dx + dy * dy <= 1) set(x, y, 0, 0, 0, 60);
  }
}

// Facets: right side brighter (lit), left side cooler/darker, top highlight.
fillPoly([T, R, B, MidTop], 0x2f, 0xb6, 0xc9, 0xff);   // right facet
fillPoly([T, MidTop, B, L], 0x1f, 0x86, 0x99, 0xff);   // left facet
fillPoly([T, [22, 40], MidTop, [42, 40]], 0x7d, 0xe6, 0xf2, 0xff); // top highlight
fillPoly([[30, 44], [34, 44], [33, 100], [31, 100]], 0xcf, 0xf7, 0xfb, 0xb0); // centre glint

// Encode as PNG (single IDAT, filter 0 per scanline).
const raw = Buffer.alloc((W * 4 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0;
  for (let x = 0; x < W * 4; x++) {
    raw[y * (W * 4 + 1) + 1 + x] = px[y * W * 4 + x];
  }
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c;
}

const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;   // bit depth
ihdr[9] = 6;   // colour type RGBA
const idat = zlib.deflateSync(raw);
const png = Buffer.concat([
  sig,
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = path.resolve(__dirname, "..", "public", "assets", "player.png");
fs.writeFileSync(out, png);
console.log("wrote", out, png.length, "bytes");
