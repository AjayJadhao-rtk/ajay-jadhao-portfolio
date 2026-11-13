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
  const bpp = 4; // assuming RGBA 8-bit
  const stride = 1 + w * bpp;
  
  // Unfilter scanlines
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
  
  return { w, h, data: raw };
}

console.log('Unfiltering extracted_ref.png...');
const ref = decodePng('public/assets/Building and grass/extracted_ref.png');
console.log('Done in JS! Checking bounds...');

let minX = ref.w, maxX = 0, minY = ref.h, maxY = 0, count = 0;
for (let y = 0; y < ref.h; y++) {
  const row = y * ref.w * 4;
  for (let x = 0; x < ref.w; x++) {
    const a = ref.data[row + x * 4 + 3];
    if (a > 20) {
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log(`Reference non-transparent: X: [${minX}, ${maxX}] (${maxX - minX + 1} px wide)`);
console.log(`Reference non-transparent: Y: [${minY}, ${maxY}] (${maxY - minY + 1} px tall)`);
console.log(`Total non-transparent pixels: ${count} (${(count / (ref.w * ref.h) * 100).toFixed(1)}%)`);

// Let's also check building non-transparent bounds
const bldg = decodePng('public/assets/Building and grass/extracted_building.png');
let bMinX = bldg.w, bMaxX = 0, bMinY = bldg.h, bMaxY = 0, bCount = 0;
for (let y = 0; y < bldg.h; y++) {
  const row = y * bldg.w * 4;
  for (let x = 0; x < bldg.w; x++) {
    const a = bldg.data[row + x * 4 + 3];
    if (a > 20) {
      bCount++;
      if (x < bMinX) bMinX = x;
      if (x > bMaxX) bMaxX = x;
      if (y < bMinY) bMinY = y;
      if (y > bMaxY) bMaxY = y;
    }
  }
}
console.log(`Building (${bldg.w}x${bldg.h}): X: [${bMinX}, ${bMaxX}], Y: [${bMinY}, ${bMaxY}], Count: ${bCount}`);
