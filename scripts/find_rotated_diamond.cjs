const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchDir(full);
    } else if (entry.name.endsWith('.svg')) {
      const text = fs.readFileSync(full, 'utf8');
      if (text.includes('data:image')) {
        console.log('SVG with image:', full, 'size:', text.length);
      }
    }
  }
}

searchDir(path.join(__dirname, '../public'));
searchDir(path.join(__dirname, '../IMAGES'));
