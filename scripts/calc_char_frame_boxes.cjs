const fs = require('fs');

const files = ['01_char.svg', '02_char.svg', '03_char.svg', '04_char.svg', '05_char.svg', '06_char.svg', '07_char.svg', '08_char.svg'];

const frames = [];
for (const f of files) {
  const text = fs.readFileSync('public/assets/Character frames/' + f, 'utf8');
  const svgMatch = text.match(/<svg width="(\d+)" height="(\d+)" viewBox="0 0 (\d+) (\d+)"/);
  const useMatch = text.match(/transform="matrix\(([^)]+)\)"/);
  const [a, b, c, d, e, fVal] = useMatch[1].split(/\s+/).map(Number);
  
  const imgW = 1 / a;
  const imgH = 1 / d;
  const imgX = -e / a;
  const imgY = -fVal / d;
  
  console.log(`${f}: SVG (${svgMatch[1]}x${svgMatch[2]}), Image Crop: x=${imgX.toFixed(1)}, y=${imgY.toFixed(1)}, w=${imgW.toFixed(1)}, h=${imgH.toFixed(1)}`);
  frames.push({
    file: f,
    svgW: Number(svgMatch[1]),
    svgH: Number(svgMatch[2]),
    crop: { x: imgX, y: imgY, w: imgW, h: imgH }
  });
}
