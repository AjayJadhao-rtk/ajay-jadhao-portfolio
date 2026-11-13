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
  const bpp = 4;
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
  
  return { w, h, data: raw };
}

const trees = decodePng('src/assets/trees_clean.png');
console.log('Inspecting trees_clean.png...');
// ASCII map of trees_clean.png
const w = trees.w;
const h = trees.h;
const stepX = Math.floor(w / 70);
const stepY = Math.floor(h / 35);

for (let y = 0; y < h; y += stepY) {
  let line = '';
  const row = y * w * 4;
  for (let x = 0; x < w; x += stepX) {
    const a = trees.data[row + x * 4 + 3];
    if (a < 30) {
      line += ' ';
    } else {
      line += '♣';
    }
  }
  if (line.trim().length > 0) {
    console.log(`y=${y.toString().padStart(4, ' ')}: ${line}`);
  }
}
