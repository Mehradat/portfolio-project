const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Home.tsx', 'utf-8');

// First Project Colors (Amber / Yellow)
fileContent = fileContent.replace(
    /bg-amber-400\/20 flex items-center justify-center relative overflow-hidden backdrop-blur-sm/,
    'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/20 dark:to-transparent flex items-center justify-center relative overflow-hidden backdrop-blur-sm border-b border-amber-200 dark:border-white/5'
);

fileContent = fileContent.replace(
    /text-yellow-200 opacity-50 transition-transform duration-500 group-hover:scale-110(?! shrink)/,
    'text-amber-500 dark:text-yellow-200 opacity-80 dark:opacity-50 transition-transform duration-500 group-hover:scale-110 drop-shadow-md dark:drop-shadow-none'
);

// First Project Badge
fileContent = fileContent.replace(
    /bg-amber-400\/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400\/30/g,
    'bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-400/30'
);

fileContent = fileContent.replace(
    /group-hover:text-amber-400 transition-colors text-slate-900 dark:text-white(?![\s\S]*Interactive Audio Sequencer)/,
    'group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-slate-900 dark:text-white'
);


// Second Project Colors (Indigo)
fileContent = fileContent.replace(
    /bg-indigo-500\/20 flex items-center justify-center relative overflow-hidden backdrop-blur-sm/,
    'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-transparent flex items-center justify-center relative overflow-hidden backdrop-blur-sm border-b border-indigo-200 dark:border-white/5'
);

fileContent = fileContent.replace(
    /text-indigo-200 opacity-50 transition-transform duration-500 group-hover:scale-110 shrink-0/,
    'text-indigo-500 dark:text-indigo-200 opacity-80 dark:opacity-50 transition-transform duration-500 group-hover:scale-110 shrink-0 drop-shadow-md dark:drop-shadow-none'
);

// Second Project Badge
fileContent = fileContent.replace(
    /bg-indigo-400\/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400\/30/g,
    'bg-indigo-100 dark:bg-indigo-400/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-300 dark:border-indigo-400/30'
);

fileContent = fileContent.replace(
    /group-hover:text-indigo-400 transition-colors text-slate-900 dark:text-white(?![\s\S]*Rhythmic Reflex Game)/,
    'group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-slate-900 dark:text-white'
);


fs.writeFileSync('first-app/src/pages/Home.tsx', fileContent);
console.log('Fixed Home Cards!');
