const fs = require('fs');

let cssContent = fs.readFileSync('first-app/src/index.css', 'utf8');

if (!cssContent.includes('@apply bg-slate-50')) {
  cssContent = cssContent.replace('p, body {', 'body {\n    @apply bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-500;\n  }\n  p, body {');
  fs.writeFileSync('first-app/src/index.css', cssContent);
}
console.log('Fixed CSS Base');
