const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/assets/Wheel');
const files = fs.readdirSync(dir);

console.log('Files in public/assets/Wheel:');
for (const file of files) {
  const filePath = path.join(dir, file);
  const stats = fs.statSync(filePath);
  console.log(`- ${file} (${stats.size} bytes)`);
  if (file.endsWith('.svg')) {
    const text = fs.readFileSync(filePath, 'utf8');
    const svgTag = text.match(/<svg[^>]*>/);
    console.log(`  SVG Tag: ${svgTag ? svgTag[0].slice(0, 150) : 'none'}`);
    const imageMatches = text.match(/<image[^>]*>/g);
    if (imageMatches) {
      console.log(`  Found ${imageMatches.length} <image> tags`);
      imageMatches.forEach((img, idx) => {
        const preview = img.replace(/xlink:href="data:image\/[^;]+;base64,[^"]+"/g, 'xlink:href="[BASE64_DATA]"');
        console.log(`    Tag ${idx}: ${preview}`);
      });
    }
    const paths = text.match(/<path[^>]*>/g);
    if (paths) {
      console.log(`  Found ${paths.length} <path> tags`);
    }
  }
}
