const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'IMAGES', 'Images', 'REctangle stripes');
const files = ['01_strip.svg', '02_strip.svg', '03_strip.svg'];

files.forEach((file, idx) => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const match = content.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
  if (match) {
    const b64 = match[1];
    const buf = Buffer.from(b64, 'base64');
    const outPath = `C:/Users/itsru/.gemini/antigravity/brain/ad378062-1b5d-42da-9fa6-664f5332545c/strip_${idx + 1}.png`;
    fs.writeFileSync(outPath, buf);
    console.log(file, 'extracted to', outPath, 'size:', buf.length);
  } else {
    console.log(file, 'no base64 match found');
  }
});
