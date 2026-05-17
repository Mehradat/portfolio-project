const fs = require('fs');
const files = ['first-app/src/pages/About.tsx', 'first-app/src/pages/Projects.tsx', 'first-app/src/pages/music.tsx', 'first-app/src/pages/Contact.tsx'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-slate-800/g, 'text-white');
  content = content.replace(/text-slate-700/g, 'text-slate-200');
  content = content.replace(/text-slate-600/g, 'text-slate-300');
  content = content.replace(/text-slate-500/g, 'text-slate-400');
  content = content.replace(/text-gray-500/g, 'text-slate-400');
  
  content = content.replace(/bg-white(?!\/)/g, 'bg-white/10');
  content = content.replace(/bg-slate-50(?!\/)/g, 'bg-slate-900/40');
  content = content.replace(/bg-slate-100(?!\/)/g, 'bg-slate-800/40');
  content = content.replace(/bg-slate-200(?!\/)/g, 'bg-white/20');
  
  content = content.replace(/border-slate-100/g, 'border-white/10');
  content = content.replace(/border-slate-200/g, 'border-white/10');
  content = content.replace(/border-slate-300/g, 'border-white/20');

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
