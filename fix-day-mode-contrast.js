const fs = require('fs');

const files = [
  'first-app/src/pages/Home.tsx',
  'first-app/src/pages/About.tsx',
  'first-app/src/pages/Projects.tsx',
  'first-app/src/pages/music.tsx',
  'first-app/src/pages/Contact.tsx',
  'first-app/src/components/Header.tsx',
  'first-app/src/components/Footer.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix bare text-white that isn't already dark:text-white or yellow/black combinations
  content = content.replace(/(?<!dark:)(?<!from-|to-|via-|bg-)text-white(?=\s|"|')/g, 'text-slate-900 dark:text-white');
  
  // Oh wait, some buttons are intentionally text-white on dark backgrounds, let's fix the resulting issues instead
  content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
  
  // Cards and wrappers with bg-white/10 or bg-white/5 or bg-transparent
  content = content.replace(/bg-white\/5/g, 'bg-white/80 dark:bg-white/5');
  content = content.replace(/bg-white\/10(?!\/)/g, 'bg-white/80 dark:bg-white/10');
  content = content.replace(/bg-white\/20(?!\/)/g, 'bg-slate-800 dark:bg-white/20');
  
  // Specifically fix Projects tags that would become text-slate-900 on bg-slate-800
  // They usually have "bg-slate-800 dark:bg-white/20 text-slate-900 dark:text-white"
  // We want them to be white text on slate-800 in light mode:
  content = content.replace(/bg-slate-800 dark:bg-white\/20 text-slate-900 dark:text-white/g, 'bg-slate-800 dark:bg-white/20 text-white');

  // Fix borders
  content = content.replace(/border-white\/10(?!\/)/g, 'border-slate-200 dark:border-white/10');
  content = content.replace(/border-white\/5(?!\/)/g, 'border-slate-200 dark:border-white/5');
  content = content.replace(/border-slate-400 dark:border-white/g, 'border-slate-900 dark:border-white');

  // Fix Contact form inputs
  content = content.replace(/bg-white\/5 border-white\/10 text-white/g, 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white');
  
  // Let's refine text colors
  content = content.replace(/text-slate-600/g, 'text-slate-700'); // Make text slightly bolder in light mode

  // Custom replacements for hero button in Home.tsx which might be text-slate-900 on dark mode too
  content = content.replace(/bg-slate-200 dark:bg-transparent/g, 'bg-slate-100 dark:bg-transparent');

  fs.writeFileSync(file, content);
  console.log('Processed', file);
});
