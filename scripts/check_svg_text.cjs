const fs = require('fs');

const svg = fs.readFileSync('public/assets/Building and grass/Grass pallet for night view and day view.svg', 'utf8');
const clean = svg.replace(/xlink:href="data:image[^"]+"/g, 'xlink:href="..."');
console.log(clean);
