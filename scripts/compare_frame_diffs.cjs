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

const frames = [];
for (let i = 1; i <= 8; i++) {
  const f = i < 10 ? '0' + i : i;
  frames.push(decodePng(`src/assets/character/frame_${f}.png`));
}

console.log('Comparing frame motions:');
for (let i = 0; i < 8; i++) {
  const next = (i + 1) % 8;
  const fA = frames[i];
  const fB = frames[next];
  const minW = Math.min(fA.w, fB.w);
  const minH = Math.min(fA.h, fB.h);
  let diff = 0;
  for (let y = 0; y < minH; y += 4) {
    for (let x = 0; x < minW; x += 4) {
      const idxA = (y * fA.w + x) * 4;
      const idxB = (y * fB.w + x) * 4;
      const dR = Math.abs(fA.data[idxA] - fB.data[idxB]);
      const dG = Math.abs(fA.data[idxA+1] - fB.data[idxB+1]);
      const dB = Math.abs(fA.data[idxA+2] - fB.data[idxB+2]);
      diff += dR + dG + dB;
    }
  }
  console.log(`Diff Frame ${i + 1} -> Frame ${next + 1}: ${diff}`);
}
