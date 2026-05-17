const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Projects.tsx', 'utf-8');

fileContent = fileContent.replace(
    /bg-white\/80 dark:bg-white\/5 backdrop-blur-sm border/g,
    'bg-white/95 dark:bg-white/5 backdrop-blur-md shadow-xl border'
);

fileContent = fileContent.replace(
    /text-slate-500 max-w-2xl mx-auto leading-relaxed/g,
    'text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed' 
);

fs.writeFileSync('first-app/src/pages/Projects.tsx', fileContent);
console.log('Fixed Projects.tsx!');
