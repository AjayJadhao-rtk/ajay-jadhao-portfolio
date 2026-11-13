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

console.log('Decoding extracted_grass.png...');
const grass = decodePngFast('public/assets/Building and grass/extracted_grass.png');
console.log('Grass IHDR:', grass.ihdr, 'raw uncompressed size:', grass.decompressed.length);

console.log('Decoding extracted_ref.png...');
const ref = decodePngFast('public/assets/Building and grass/extracted_ref.png');
console.log('Ref IHDR:', ref.ihdr, 'raw uncompressed size:', ref.decompressed.length);

console.log('Decoding extracted_building.png...');
const bldg = decodePngFast('public/assets/Building and grass/extracted_building.png');
console.log('Building IHDR:', bldg.ihdr, 'raw uncompressed size:', bldg.decompressed.length);

// Let's create an ASCII thumbnail of grass vs ref
function asciiMap(ihdr, decompressed, name) {
  const w = ihdr.w;
  const h = ihdr.h;
  const bpp = 4;
  const stride = 1 + w * bpp;
  const stepX = Math.floor(w / 60);
  const stepY = Math.floor(h / 30);
  
  console.log(`\n=== ASCII MAP OF ${name} (${w}x${h}) ===`);
  for (let y = 0; y < h; y += stepY) {
    let line = '';
    const rowOffset = y * stride + 1;
    for (let x = 0; x < w; x += stepX) {
      const idx = rowOffset + x * bpp;
      const r = decompressed[idx];
      const g = decompressed[idx + 1];
      const b = decompressed[idx + 2];
      const a = decompressed[idx + 3];
      if (a < 30) {
        line += ' ';
      } else if (g > r && g > b) {
        line += 'T'; // Tree / green
      } else if (r > 150 && g > 150 && b > 150) {
        line += '.'; // Concrete / white
      } else {
        line += '#'; // Other solid
      }
    }
    console.log(line);
  }
}

asciiMap(grass.ihdr, grass.decompressed, 'GRASS PALLET');
asciiMap(ref.ihdr, ref.decompressed, 'REFERENCE');
asciiMap(bldg.ihdr, bldg.decompressed, 'BUILDING');
