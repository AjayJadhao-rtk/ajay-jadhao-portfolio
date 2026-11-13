const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/assets/Wheel');
for (let i = 1; i <= 8; i++) {
  const name = `Wheel_0${i}.svg`;
  const text = fs.readFileSync(path.join(dir, name), 'utf8');
  // Check pattern and use transforms
  const pattern = text.match(/<pattern[^>]*>/);
  const use = text.match(/<use[^>]*>/);
  const rect = text.match(/<rect[^>]*>/);
  console.log(`${name}:`);
  console.log(`  rect: ${rect ? rect[0] : 'none'}`);
  console.log(`  pattern: ${pattern ? pattern[0] : 'none'}`);
  console.log(`  use: ${use ? use[0] : 'none'}`);
}
