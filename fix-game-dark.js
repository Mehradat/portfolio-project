const fs = require('fs');

const files = ['first-app/src/pages/Game.tsx', 'first-app/src/pages/Game1.tsx'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Common wrapper fixes
  content = content.replace(/bg-gray-900 text-white/g, 'bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white transition-colors duration-500');
  content = content.replace(/bg-transparent font-sans text-slate-800 dark:text-white/g, 'bg-transparent font-sans text-slate-900 dark:text-white transition-colors duration-500');
  
  // Specific Game elements
  content = content.replace(/bg-gray-800/g, 'bg-white dark:bg-gray-800 shadow-md dark:shadow-none');
  content = content.replace(/border-gray-700/g, 'border-gray-200 dark:border-gray-700');
  content = content.replace(/text-gray-400/g, 'text-gray-600 dark:text-gray-400');
  content = content.replace(/text-gray-300/g, 'text-gray-700 dark:text-gray-300');
  content = content.replace(/text-gray-200/g, 'text-gray-800 dark:text-gray-200');
  content = content.replace(/bg-blue-600/g, 'bg-blue-500 dark:bg-blue-600');
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-blue-600 dark:hover:bg-blue-700');
  content = content.replace(/bg-red-600/g, 'bg-red-500 dark:bg-red-600');
  content = content.replace(/hover:bg-red-700/g, 'hover:bg-red-600 dark:hover:bg-red-700');
  content = content.replace(/bg-green-600/g, 'bg-green-500 dark:bg-green-600');
  content = content.replace(/hover:bg-green-700/g, 'hover:bg-green-600 dark:hover:bg-green-700');
  
  // Box styles mapping -> ensure borders are visible in light mode
  content = content.replace(/border-gray-600/g, 'border-gray-300 dark:border-gray-600');
  content = content.replace(/border-gray-800/g, 'border-gray-300 dark:border-gray-800');
  content = content.replace(/bg-gray-700/g, 'bg-gray-100 dark:bg-gray-700');
  
  // Game 1 Wrapper
  // Check if we already replaced it or it was slightly different
  content = content.replace(/className="min-h-screen flex flex-col bg-gray-900 text-white"/g, 'className="min-h-screen flex flex-col transition-colors duration-500 bg-transparent text-slate-900 dark:text-white"');
  content = content.replace(/className="min-h-screen flex flex-col bg-gray-900 text-white"/g, 'className="min-h-screen flex flex-col transition-colors duration-500 bg-transparent text-slate-900 dark:text-white"');
  
  // Make game wrapper transparent to respect global 3D background (or bg-slate-50 if no 3D)
  content = content.replace(/bg-slate-50 dark:bg-gray-900/g, 'bg-transparent dark:bg-transparent');
  content = content.replace(/bg-gray-900/g, 'bg-transparent dark:bg-transparent');
  content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
  // cleanup double replacements
  content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/bg-transparent dark:bg-transparent text-slate-900 dark:text-white/g, 'bg-transparent text-slate-900 dark:text-white');
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
