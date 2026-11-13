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

function writePng(filePath, w, h, rgbaBuffer) {
  const stride = 1 + w * 4;
  const raw = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    raw[y * stride] = 0; // Filter None
    rgbaBuffer.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  
  // PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);
  
  // IDAT
  const idatChunk = makeChunk('IDAT', compressed);
  
  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  fs.writeFileSync(filePath, Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]));
  console.log(`Saved ${filePath} (${w}x${h}, ${fs.statSync(filePath).size} bytes)`);
}

// Simple CRC32 table
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

console.log('Extracting 8 cropped character frames...');
const sheet = decodePng('public/assets/Character frames/character_sheet.png');

if (!fs.existsSync('public/assets/Character frames/extracted')) {
  fs.mkdirSync('public/assets/Character frames/extracted', { recursive: true });
}
if (!fs.existsSync('src/assets/character')) {
  fs.mkdirSync('src/assets/character', { recursive: true });
}

// Crops for 01-08:
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
  const cw = Math.round(c.w);
  const ch = Math.round(c.h);
  const croppedBuf = Buffer.alloc(cw * ch * 4);
  
  for (let y = 0; y < ch; y++) {
    const srcY = Math.min(sheet.h - 1, Math.max(0, Math.round(c.y) + y));
    for (let x = 0; x < cw; x++) {
      const srcX = Math.min(sheet.w - 1, Math.max(0, Math.round(c.x) + x));
      const srcIdx = (srcY * sheet.w + srcX) * 4;
      const dstIdx = (y * cw + x) * 4;
      sheet.data.copy(croppedBuf, dstIdx, srcIdx, srcIdx + 4);
    }
  }
  
  writePng(`public/assets/Character frames/extracted/frame_${c.f}.png`, cw, ch, croppedBuf);
  writePng(`src/assets/character/frame_${c.f}.png`, cw, ch, croppedBuf);
});
