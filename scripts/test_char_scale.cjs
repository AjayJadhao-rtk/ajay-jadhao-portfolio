const fs = require('fs');

// Reference for character position.png: 1451x821
// 01_char.svg: width="386" height="403" viewBox="0 0 386 403"
// In 01_char.svg: pattern matrix(0.00123087 0 0 0.00117895 -0.0428511 0)
// Notice: 386 * 1.35 = 521, 403 * 1.35 = 544
// If x=210, y=277: bottom y = 277 + 544 = 821 (exactly bottom of screen!)
console.log('Testing character viewBox positioning:');
console.log('If bottom is at 821:');
const heights = [540, 560, 580];
heights.forEach(h => {
  const w = h * (812 / 848);
  const y = 821 - h;
  console.log(`h=${h}, w=${w.toFixed(1)}, y=${y.toFixed(1)}`);
});
