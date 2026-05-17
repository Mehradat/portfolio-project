const fs = require('fs');

const files = [
  'first-app/src/pages/Home.tsx',
  'first-app/src/pages/About.tsx',
  'first-app/src/pages/Projects.tsx',
  'first-app/src/pages/music.tsx',
  'first-app/src/pages/Contact.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Any stray text-white text-slate-800 combination
  content = content.replace(/text-slate-800 dark:text-slate-900 dark:text-white/g, 'text-slate-800 dark:text-white');
  content = content.replace(/text-gray-600 dark:text-slate-900 dark:text-white/g, 'text-slate-700 dark:text-white');
  content = content.replace(/text-slate-400 dark:text-slate-900 dark:text-white/g, 'text-slate-600 dark:text-slate-400');
  
  // Projects overlay titles usually have text-slate-900 which means they are black in light mode. Let's make them white, wait, the overlay is dark!
  // In Projects.tsx, we have "bg-black/45 text-white" -> our previous script made it "bg-black/45 text-slate-900 dark:text-white". That's BAD.
  content = content.replace(/bg-black\/45 text-slate-900 dark:text-white/g, 'bg-black/45 text-white');
  content = content.replace(/from-black\/80 to-transparent p-3">\s*<h3 className="text-xl md:text-2xl font-bold mb-2 text-slate-900 dark:text-white/g, 'from-black/80 to-transparent p-3">\n                                <h3 className="text-xl md:text-2xl font-bold mb-2 text-white');
  content = content.replace(/text-xs font-medium text-slate-900 dark:text-white/g, 'text-xs font-medium text-white');

  // Contact form button
  content = content.replace(/bg-white text-slate-900/g, 'bg-slate-900 text-white dark:bg-white dark:text-slate-900');

  // Hero Outline Button in Home
  content = content.replace(/border-slate-900 dark:border-white text-slate-900 dark:text-white px-8/g, 'border-slate-900 dark:border-white text-slate-900 dark:text-white px-8 hover:bg-slate-900 hover:text-white');

  fs.writeFileSync(file, content);
});
