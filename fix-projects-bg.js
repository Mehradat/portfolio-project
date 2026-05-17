const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Projects.tsx', 'utf-8');

fileContent = fileContent.replace(
    /<div>\s*<h2 className="text-3xl md:text-4xl font-extrabold mb-4">/g,
    '<div className="bg-white/70 dark:bg-slate-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-md shadow-lg border border-white/50 dark:border-white/10">\n                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4">'
);

// We need to make sure text is dark enough on the light mode card.
fileContent = fileContent.replace(
    /<p className="text-gray-600 dark:text-slate-300 mb-4">/g,
    '<p className="text-slate-800 dark:text-slate-300 mb-6 leading-relaxed">'
);

fileContent = fileContent.replace(
    /<ul className="list-disc ml-5">/g,
    '<ul className="list-disc ml-5 space-y-1 text-slate-700 dark:text-slate-300 mb-6">'
);

fileContent = fileContent.replace(
    /<strong>Features:<\/strong>/g,
    '<strong className="text-slate-900 dark:text-white text-lg inline-block mb-3">Features:</strong>'
);

fileContent = fileContent.replace(
    /<strong>Tech:<\/strong>/g,
    '<strong className="text-slate-900 dark:text-white text-lg inline-block mb-2">Tech:</strong>'
);

fileContent = fileContent.replace(
    /className="bg-gray-200 dark:bg-slate-800 dark:bg-white\/20 px-3 py-1 rounded"/g,
    'className="bg-white dark:bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm font-medium text-sm"'
);

fs.writeFileSync('first-app/src/pages/Projects.tsx', fileContent);
console.log('Fixed Projects Backgrounds!');
