const fs = require('fs');

const svg01 = fs.readFileSync('public/assets/Character frames/01_char.svg', 'utf8');
const m = svg01.match(/xlink:href="data:image\/([^;]+);base64,([^"]+)"/);
if (m) {
  const buf = Buffer.from(m[2], 'base64');
  fs.writeFileSync('public/assets/Character frames/character_sheet.png', buf);
  console.log('Saved character_sheet.png, size:', buf.length, 'bytes');
}
