const fs = require('fs');
const path = require('path');

// Let's inspect 01_strip.svg
const s1 = fs.readFileSync('public/assets/strips/01_strip.svg', 'utf8');
console.log('01_strip.svg length:', s1.length);
// Extract image from 01_strip.svg
const m1 = s1.match(/xlink:href="data:image\/([^;]+);base64,([^"]+)"/);
if (m1) {
  const buf = Buffer.from(m1[2], 'base64');
  console.log('01_strip embedded image size:', buf.length);
  fs.writeFileSync('public/assets/strips/extracted_strip1.png', buf);
  console.log('Saved extracted_strip1.png');
}

// Let's inspect Reference.svg
const rSvg = fs.readFileSync('public/assets/Building and grass/Reference.svg', 'utf8');
const mr = rSvg.match(/xlink:href="data:image\/([^;]+);base64,([^"]+)"/);
if (mr) {
  const buf = Buffer.from(mr[2], 'base64');
  fs.writeFileSync('public/assets/Building and grass/extracted_ref.png', buf);
  console.log('Saved extracted_ref.png');
}
