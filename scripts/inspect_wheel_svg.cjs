const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/assets/Wheel/Wheel_01.svg');
let text = fs.readFileSync(filePath, 'utf8');

// Replace base64 data with [...]
const stripped = text.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '[BASE64]');
console.log('--- Wheel_01.svg ---');
console.log(stripped);

const filePath2 = path.join(__dirname, '../public/assets/Wheel/Wheel_02.svg');
let text2 = fs.readFileSync(filePath2, 'utf8');
const stripped2 = text2.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '[BASE64]');
console.log('--- Wheel_02.svg ---');
console.log(stripped2);
