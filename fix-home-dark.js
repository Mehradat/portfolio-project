const fs = require('fs');

let file = 'first-app/src/pages/Home.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');

  // Inject logical dark mode
  content = content.replace(/className="text-white min-h-screen/g, 'className="text-slate-900 dark:text-white min-h-screen transition-colors duration-500');
  content = content.replace(/text-white(?!(\/| space| px-))/g, 'text-slate-900 dark:text-white');
  content = content.replace(/border-white(?!(\/| space| px-))/g, 'border-slate-400 dark:border-white');
  content = content.replace(/border-white\/5/g, 'border-slate-200 dark:border-white/5');
  content = content.replace(/border-white\/20/g, 'border-slate-300 dark:border-white/20');
  content = content.replace(/bg-slate-900\/50/g, 'bg-slate-100 dark:bg-slate-900/50');
  content = content.replace(/bg-slate-950\/80/g, 'bg-slate-200 dark:bg-slate-950/80');
  content = content.replace(/bg-white\/10/g, 'bg-slate-200 dark:bg-white/10');
  content = content.replace(/text-slate-300/g, 'text-slate-600 dark:text-slate-300');
  content = content.replace(/text-slate-400/g, 'text-slate-500 dark:text-slate-400');
  
  fs.writeFileSync(file, content);
  console.log('Fixed Home.tsx');
}
