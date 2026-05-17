const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/About.tsx', 'utf-8');

// The main issues are transparent / low contrast wrappers in light mode on about page:
// 1. Resume button styling: bg-slate-900 text-slate-900? Change to bg-slate-900 text-white
fileContent = fileContent.replace(
    /className="inline-block bg-slate-900 text-slate-900 dark:text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg relative overflow-hidden group"/g,
    'className="inline-block bg-slate-900 text-white dark:text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg relative overflow-hidden group"'
);
fileContent = fileContent.replace(
    /className="bg-slate-900 text-slate-900 dark:text-white px-8 py-3 rounded-lg font-bold transition shadow-lg opacity-50 cursor-not-allowed"/g,
    'className="bg-slate-900 text-white dark:text-white px-8 py-3 rounded-lg font-bold transition shadow-lg opacity-50 cursor-not-allowed"'
);

// 2. Main wrappers like bg-slate-50 => we should make them nicely separated with bg-white or subtle gradient, maybe a border. Currently they seem okay but maybe they lack contrast against light mode 3D background.
fileContent = fileContent.replace(
    /className="px-6 py-24 bg-slate-50 dark:bg-slate-900\/50"/g,
    'className="px-6 py-24 bg-white/90 dark:bg-slate-900/50 backdrop-blur-sm border-y border-slate-200 dark:border-white/5"'
);
fileContent = fileContent.replace(
    /className="py-24 px-6 bg-slate-50 dark:bg-slate-900\/50 relative overflow-hidden"/g,
    'className="py-24 px-6 bg-slate-50/90 dark:bg-slate-900/50 relative overflow-hidden backdrop-blur-sm border-b border-slate-200 dark:border-white/5"'
);

// 3. Technical proficiency section bg-slate-950 text-slate-900?? It's bg-slate-950 which is almost black.
fileContent = fileContent.replace(
    /className="px-6 py-24 bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden"/g,
    'className="px-6 py-24 bg-slate-900 text-white dark:text-white relative overflow-hidden border-b border-slate-200 dark:border-white/5"'
);

// Under technical section there are list strings: text-slate-300
fileContent = fileContent.replace(
    /text-slate-300 leading-7 list-disc pl-5/g,
    'text-slate-200 leading-7 list-disc pl-5'
);

// Box inside Technical proficiency
fileContent = fileContent.replace(
    /className="rounded-3xl border border-slate-200 dark:border-white\/10 bg-white\/80 dark:bg-white\/5 p-6 backdrop-blur-sm"/g,
    'className="rounded-3xl border border-slate-700/50 dark:border-white/10 bg-slate-800/80 dark:bg-white/5 p-6 backdrop-blur-md shadow-xl"'
);

// Philosophy text section box
fileContent = fileContent.replace(
    /className="rounded-3xl border border-slate-200 dark:border-slate-200 dark:border-white\/10 bg-slate-950 p-8 text-slate-900 dark:text-white shadow-\[0_20px_60px_rgba\(15,23,42,0\.20\)\]"/g,
    'className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-950 p-8 text-slate-900 dark:text-white shadow-xl backdrop-blur-md"'
);

// "space-y-4 text-slate-300 leading-8" inside a box that is now white in light mode!
fileContent = fileContent.replace(
    /<div className="space-y-4 text-slate-300 leading-8">/g,
    '<div className="space-y-4 text-slate-700 dark:text-slate-300 leading-8">'
);


fs.writeFileSync('first-app/src/pages/About.tsx', fileContent);
console.log('Fixed About.tsx!');
