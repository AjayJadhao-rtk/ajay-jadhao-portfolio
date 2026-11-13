const fs = require('fs');

const files = fs.readdirSync('public/assets/Character frames').filter(f => f.endsWith('.svg'));
console.log('Character SVGs:', files);

for (const f of files.slice(0, 2)) {
  const text = fs.readFileSync('public/assets/Character frames/' + f, 'utf8');
  console.log(`\n=== ${f} === (size: ${text.length})`);
  const svgMatch = text.match(/<svg[^>]*>/);
  console.log('SVG tag:', svgMatch ? svgMatch[0] : 'none');
  const clean = text.replace(/data:image\/[^;]+;base64,[^"]+/g, '[BASE64]');
  console.log('SVG content preview:\n', clean.slice(0, 800));
}
