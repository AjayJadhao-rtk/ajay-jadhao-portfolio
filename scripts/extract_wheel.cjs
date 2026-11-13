const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = path.join(__dirname, '../public/assets/Wheel');
for (let i = 1; i <= 8; i++) {
  const name = `Wheel_0${i}.svg`;
  const text = fs.readFileSync(path.join(dir, name), 'utf8');
  const match = text.match(/xlink:href="data:image\/([^;]+);base64,([^"]+)"/);
  if (match) {
    const ext = match[1];
    const b64 = match[2];
    const buf = Buffer.from(b64, 'base64');
    const hash = crypto.createHash('md5').update(buf).digest('hex');
    console.log(`${name}: mime=${ext}, size=${buf.length}, md5=${hash}`);
    if (i === 1) {
      fs.writeFileSync(path.join(__dirname, '../public/assets/Wheel/extracted_base_image.png'), buf);
      console.log('Saved extracted_base_image.png');
    }
  }
}
