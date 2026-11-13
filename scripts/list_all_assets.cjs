const fs = require('fs');
const path = require('path');

// Let's search all files in public and src
function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        scan(full);
      }
    } else {
      console.log(full, fs.statSync(full).size);
    }
  }
}

console.log('--- ALL FILES IN SRC AND PUBLIC ---');
scan(path.join(__dirname, '../src'));
scan(path.join(__dirname, '../public'));
