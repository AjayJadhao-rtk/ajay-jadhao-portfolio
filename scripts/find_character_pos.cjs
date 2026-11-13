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

console.log('Comparing Reference for character position with hero background...');
const charRef = decodePng('public/assets/Character frames/Reference for character position.png');
const bg = decodePng('public/assets/hero-bg-figma.jpg'); // wait, hero-bg-figma.jpg is jpg

// In charRef, character is the dark-haired boy in brown/olive jacket looking up to the right.
// Skin tone is peach/warm (r: 200-245, g: 150-200, b: 120-170).
// Hair is dark brown/black (r: 30-70, g: 30-70, b: 30-70).
// Character sits around x: 200-750, y: 200-821.
let minX = charRef.w, maxX = 0, minY = charRef.h, maxY = 0;
let skinCount = 0;

for (let y = 200; y < charRef.h; y++) {
  for (let x = 200; x < 750; x++) {
    const idx = (y * charRef.w + x) * charRef.bpp;
    const r = charRef.data[idx];
    const g = charRef.data[idx + 1];
    const b = charRef.data[idx + 2];
    
    // Check skin tone (face/neck)
    if (r > 190 && r < 250 && g > 140 && g < 200 && b > 110 && b < 170 && r > g && g > b) {
      skinCount++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Character face bounding box: X in [${minX}, ${maxX}] (center X: ${((minX + maxX)/2).toFixed(1)}), Y in [${minY}, ${maxY}] (center Y: ${((minY + maxY)/2).toFixed(1)})`);
