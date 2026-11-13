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

console.log('Unfiltering character_sheet.png...');
const sheet = decodePng('public/assets/Character frames/character_sheet.png');
console.log('Sheet decoded:', sheet.w, sheet.h);

// Check 8 crops computed earlier:
const crops = [
  { f: '01', x: 35, y: 0, w: 812, h: 848 },
  { f: '02', x: 847, y: 0, w: 785, h: 861 },
  { f: '03', x: 1636, y: 0, w: 785, h: 861 },
  { f: '04', x: 2437, y: 0, w: 785, h: 861 },
  { f: '05', x: 0, y: 880, w: 812, h: 848 },
  { f: '06', x: 807, y: 864, w: 785, h: 861 },
  { f: '07', x: 1590, y: 867, w: 785, h: 861 },
  { f: '08', x: 2396, y: 867, w: 785, h: 861 }
];

crops.forEach(c => {
  let count = 0;
  for (let y = Math.floor(c.y); y < Math.floor(c.y + c.h); y += 4) {
    for (let x = Math.floor(c.x); x < Math.floor(c.x + c.w); x += 4) {
      if (y >= 0 && y < sheet.h && x >= 0 && x < sheet.w) {
        const a = sheet.data[(y * sheet.w + x) * 4 + 3];
        if (a > 30) count++;
      }
    }
  }
  console.log(`Frame ${c.f}: non-transparent samples = ${count}`);
});
