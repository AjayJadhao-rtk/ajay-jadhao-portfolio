const fs = require('fs');
const path = require('path');

const p1 = 'public/assets/hero-bg-figma.jpg';
const p2 = 'public/assets/Wheel/wheel_isolated.png';
const p3 = 'public/assets/Wheel/extracted_base_image.png';

console.log('p1 exists:', fs.existsSync(p1), fs.statSync(p1).size);
console.log('p2 exists:', fs.existsSync(p2), fs.statSync(p2).size);
console.log('p3 exists:', fs.existsSync(p3), fs.statSync(p3).size);

// Let's check git log for public/assets/hero-bg-figma.jpg
