const fs = require('fs');

const bSvg = fs.readFileSync('public/assets/Building and grass/Building.svg', 'utf8');
const mb = bSvg.match(/xlink:href="data:image\/([^;]+);base64,([^"]+)"/);
if (mb) {
  fs.writeFileSync('public/assets/Building and grass/extracted_building.png', Buffer.from(mb[2], 'base64'));
  console.log('Saved extracted_building.png');
}

const gSvg = fs.readFileSync('public/assets/Building and grass/Grass pallet for night view and day view.svg', 'utf8');
const mg = gSvg.match(/xlink:href="data:image\/([^;]+);base64,([^"]+)"/);
if (mg) {
  fs.writeFileSync('public/assets/Building and grass/extracted_grass.png', Buffer.from(mg[2], 'base64'));
  console.log('Saved extracted_grass.png');
}
