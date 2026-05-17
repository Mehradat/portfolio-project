const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Home.tsx', 'utf-8');

const oldStr = `<section className="bg-slate-200 dark:bg-slate-950/80 text-slate-900 dark:text-white py-20 sm:py-24 text-center px-4 sm:px-6 lg:px-10 border-t border-slate-200 dark:border-slate-200 dark:border-white/5">`;

const newStr = `<section className="relative overflow-hidden bg-gradient-to-br from-yellow-50/40 via-white/60 to-amber-50/40 dark:from-slate-900/80 dark:via-slate-950/80 dark:to-slate-950/95 backdrop-blur-xl text-slate-900 dark:text-white py-24 sm:py-32 text-center px-4 sm:px-6 lg:px-10 border-t border-white/60 dark:border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.02)] dark:shadow-none">
        {/* Subtle light mode decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-yellow-100/20 to-transparent blur-3xl -z-10 dark:hidden"></div>`;

fileContent = fileContent.replace(oldStr, newStr);

fileContent = fileContent.replace(
    /<p className="text-slate-500/g,
    '<p className="text-slate-600'
);

fs.writeFileSync('first-app/src/pages/Home.tsx', fileContent);
console.log('Fixed Home CTA Background!');
