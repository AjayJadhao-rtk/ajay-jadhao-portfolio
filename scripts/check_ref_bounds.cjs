const fs = require('fs');
const zlib = require('zlib');

function decodePngFast(filePath) {
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
  return { ihdr, decompressed };
}

const ref = decodePngFast('public/assets/Building and grass/extracted_ref.png');
const w = ref.ihdr.w;
const h = ref.ihdr.h;
const stride = 1 + w * 4;

let minX = w, maxX = 0, minY = h, maxY = 0;
let solidPixels = 0;

for (let y = 0; y < h; y++) {
  const rowOffset = y * stride + 1;
  for (let x = 0; x < w; x++) {
    const a = ref.decompressed[rowOffset + x * 4 + 3];
    if (a > 10) {
      solidPixels++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log('REFERENCE non-transparent bounding box:');
console.log(`X: [${minX}, ${maxX}] out of ${w}`);
console.log(`Y: [${minY}, ${maxY}] out of ${h}`);
console.log(`Solid pixels: ${solidPixels}`);
