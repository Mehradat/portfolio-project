const fs = require('fs');

// 1. Add "dark" to index.html
let indexHtml = fs.readFileSync('first-app/index.html', 'utf8');
indexHtml = indexHtml.replace('<html lang="en">', '<html lang="en" class="dark">');
fs.writeFileSync('first-app/index.html', indexHtml);

// 2. Enable darkMode class in tailwind.config.js
let tailwindConfig = fs.readFileSync('first-app/tailwind.config.js', 'utf8');
if (!tailwindConfig.includes('darkMode:')) {
  tailwindConfig = tailwindConfig.replace('export default {', 'export default {\n  darkMode: "class",');
  fs.writeFileSync('first-app/tailwind.config.js', tailwindConfig);
}
console.log('Setup Dark Mode Base!');
