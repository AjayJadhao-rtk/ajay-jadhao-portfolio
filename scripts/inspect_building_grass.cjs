const fs = require('fs');
const path = require('path');

const dir = 'public/assets/Building and grass';
const files = ['Building.svg', 'Grass pallet for night view and day view.svg', 'Reference.svg'];

for (const f of files) {
  const p = path.join(dir, f);
  const text = fs.readFileSync(p, 'utf8');
  console.log('=== FILE:', f, '===');
  console.log('Size:', text.length);
  const svgMatch = text.match(/<svg[^>]*>/);
  console.log('SVG tag:', svgMatch ? svgMatch[0] : 'none');
  
  // Find all elements in the SVG
  const tags = text.match(/<([a-zA-Z0-9]+)[^>]*>/g);
  const tagNames = tags.map(t => t.match(/<([a-zA-Z0-9]+)/)[1]);
  const counts = {};
  tagNames.forEach(name => counts[name] = (counts[name] || 0) + 1);
  console.log('Element counts:', counts);
  
  // Check any pattern or use transforms
  const patterns = text.match(/<pattern[^>]*>[\s\S]*?<\/pattern>/g);
  if (patterns) {
    patterns.forEach((pat, i) => {
      console.log(`Pattern ${i}:`, pat.replace(/data:image\/[^;]+;base64,[^"]+/g, '[BASE64]'));
    });
  }
}
