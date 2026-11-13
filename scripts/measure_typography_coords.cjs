const fs = require('fs');
const zlib = require('zlib');

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let ihdr = null;
  const idatChunks = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      ihdr = {
        w: buf.readUInt32BE(pos + 8),
        h: buf.readUInt32BE(pos + 12),
        bitDepth: buf[pos + 16],
        colorType: buf[pos + 17]
      };
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const w = ihdr.w;
  const h = ihdr.h;
  const bpp = ihdr.colorType === 6 ? 4 : 3;
  const stride = 1 + w * bpp;
  
  const raw = Buffer.alloc(w * h * bpp);
  let prevRow = Buffer.alloc(w * bpp);
  
  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < h; y++) {
    const filter = decompressed[y * stride];
    const srcRow = y * stride + 1;
    const dstRow = y * w * bpp;
    
    for (let x = 0; x < w * bpp; x++) {
      const b = decompressed[srcRow + x];
      const left = x >= bpp ? raw[dstRow + x - bpp] : 0;
      const up = prevRow[x];
      const upLeft = x >= bpp ? prevRow[x - bpp] : 0;
      
      let val = 0;
      if (filter === 0) val = b;
      else if (filter === 1) val = (b + left) & 0xff;
      else if (filter === 2) val = (b + up) & 0xff;
      else if (filter === 3) val = (b + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) val = (b + paeth(left, up, upLeft)) & 0xff;
      
      raw[dstRow + x] = val;
    }
    raw.copy(prevRow, 0, dstRow, dstRow + w * bpp);
  }
  
  return { w, h, bpp, data: raw };
}

console.log('Decoding reference image.png...');
const ref = decodePng('public/assets/Typography/reference image.png');

// In reference image.png, background is white (r > 240, g > 240, b > 240).
// Let's find regions on the right (x > 800) where text is present (dark pixels: r < 180 || g < 180 || b < 180).
const w = ref.w;
const h = ref.h;
const bpp = ref.bpp;

const rightTextRegions = [];
for (let y = 0; y < h; y += 4) {
  let darkCount = 0;
  let minX = w, maxX = 0;
  for (let x = 800; x < w; x += 2) {
    const idx = (y * w + x) * bpp;
    const r = ref.data[idx];
    const g = ref.data[idx + 1];
    const b = ref.data[idx + 2];
    if (r < 200 || g < 200 || b < 200) {
      darkCount++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  }
  if (darkCount > 5) {
    rightTextRegions.push({ y, darkCount, minX, maxX });
  }
}

console.log('Sampled dark regions on the right (x > 800):');
let inBlock = false;
let blockStart = 0, blockMinX = w, blockMaxX = 0;
for (const r of rightTextRegions) {
  if (!inBlock) {
    inBlock = true;
    blockStart = r.y;
    blockMinX = r.minX;
    blockMaxX = r.maxX;
  } else {
    blockMinX = Math.min(blockMinX, r.minX);
    blockMaxX = Math.max(blockMaxX, r.maxX);
  }
}
// Group contiguous vertical ranges
const blocks = [];
let curr = null;
for (const r of rightTextRegions) {
  if (!curr) {
    curr = { startY: r.y, endY: r.y, minX: r.minX, maxX: r.maxX };
  } else if (r.y - curr.endY <= 8) {
    curr.endY = r.y;
    curr.minX = Math.min(curr.minX, r.minX);
    curr.maxCount = Math.max(curr.maxCount || 0, r.darkCount);
    curr.maxX = Math.max(curr.maxX, r.maxX);
  } else {
    blocks.push(curr);
    curr = { startY: r.y, endY: r.y, minX: r.minX, maxX: r.maxX };
  }
}
if (curr) blocks.push(curr);

blocks.forEach((b, i) => {
  console.log(`Block ${i + 1}: Y in [${b.startY}, ${b.endY}] (${b.endY - b.startY}px tall), X in [${b.minX}, ${b.maxX}] (${b.maxX - b.minX}px wide)`);
});
