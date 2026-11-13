const fs = require('fs');

const files = ['01_char.svg', '02_char.svg', '03_char.svg', '04_char.svg', '05_char.svg', '06_char.svg', '07_char.svg', '08_char.svg'];

const base64s = [];
for (const f of files) {
  const text = fs.readFileSync('public/assets/Character frames/' + f, 'utf8');
  const m = text.match(/xlink:href="data:image\/([^;]+);base64,([^"]+)"/);
  const svgTag = text.match(/<svg[^>]*>/)[0];
  const useTag = text.match(/<use[^>]*>/)[0];
  console.log(`\n=== ${f} ===`);
  console.log('SVG:', svgTag);
  console.log('USE:', useTag);
  if (m) {
    const len = m[2].length;
    console.log('Base64 length:', len);
    base64s.push({ f, len, hashPrefix: m[2].slice(0, 50), hashSuffix: m[2].slice(-50) });
  }
}

// Check if all base64 images are the same image
const allSame = base64s.every(b => b.len === base64s[0].len && b.hashPrefix === base64s[0].hashPrefix && b.hashSuffix === base64s[0].hashSuffix);
console.log('\nAre all base64 images identical?', allSame);
