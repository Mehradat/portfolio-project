const fs = require('fs');
let file = 'first-app/src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-slate-100/g, 'bg-slate-50 dark:bg-slate-950');
// Just use a generic replacement for layout
content = content.replace(/className="bg-slate-50 dark:bg-slate-950 text-slate-300 mt-24 border-t border-slate-900"/, 'className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 mt-24 border-t border-slate-200 dark:border-white/10 transition-colors"');

// Fix paragraph text
content = content.replace(/text-slate-400(.*)Crafting/, 'text-slate-600 dark:text-slate-400$1Crafting');

// Fix headers
content = content.replace(/text-white font-bold mb-6 text-lg/g, 'text-slate-900 dark:text-white font-bold mb-6 text-lg');

// Fix hover links
content = content.replace(/text-slate-400 hover:text-yellow-400/g, 'text-slate-500 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors');

// Fix text-slate-400 border-white\/10
content = content.replace(/text-slate-400 text-sm mt-12 pt-8 border-t border-white\/10/g, 'text-slate-500 dark:text-slate-400 text-sm mt-12 pt-8 border-t border-slate-200 dark:border-white/10 transition-colors');

// Add black logo conditional rendering
content = content.replace(/import logoWhite from "\.\.\/assets\/logo-white\.png";/, 'import logoWhite from "../assets/logo-white.png";\nimport logoBlack from "../assets/logo-black.png";');

content = content.replace(/<img\s+src=\{logoWhite\}\s+alt="Logo"\s+className="h-full w-auto object-contain"\s+\/>/, 
  '<img src={logoBlack} alt="Logo" className="h-full w-auto object-contain dark:hidden" />\n              <img src={logoWhite} alt="Logo" className="h-full w-auto object-contain hidden dark:block" />');

fs.writeFileSync(file, content);
console.log('Fixed Footer');
