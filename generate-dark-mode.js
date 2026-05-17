const fs = require('fs');

const files = ['first-app/src/pages/About.tsx', 'first-app/src/pages/Projects.tsx', 'first-app/src/pages/music.tsx', 'first-app/src/pages/Contact.tsx'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  // Let's get the LIGHT version of the file which is currently in commit 86e30e2
  const { execSync } = require('child_process');
  let content = execSync(`git show 86e30e2:${file}`).toString();

  // Now selectively apply dark mode classes
  // Text colors
  content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
  content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-white');
  content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-200');
  content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
  content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-slate-400');
  content = content.replace(/text-gray-600/g, 'text-gray-600 dark:text-slate-300');

  // Background and border colors
  content = content.replace(/bg-white([^/])/g, 'bg-white dark:bg-white/10$1'); 
  content = content.replace(/bg-slate-50([^/])/g, 'bg-slate-50 dark:bg-slate-900/50$1');
  content = content.replace(/bg-slate-100([^/])/g, 'bg-slate-100 dark:bg-slate-800/50$1');
  content = content.replace(/bg-slate-200([^/])/g, 'bg-slate-200 dark:bg-white/20$1');
  content = content.replace(/bg-gray-200([^/])/g, 'bg-gray-200 dark:bg-white/20$1');
  
  content = content.replace(/border-slate-100/g, 'border-slate-100 dark:border-white/10');
  content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-white/10');
  content = content.replace(/border-slate-300/g, 'border-slate-300 dark:border-white/20');

  // For About.tsx the main container uses bg-slate-50 font-sans text-slate-800
  // we replaced it with font-sans text-white. Let's make sure min-h-screen container logic works:
  content = content.replace(/bg-slate-50 font-sans text-slate-800(.*?)className="text-slate-900"/s, 'font-sans text-slate-800 dark:text-white dark:bg-transparent$1');

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
