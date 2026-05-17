const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Home.tsx', 'utf-8');

const oldStr = `<div className="relative group bg-gradient-to-br from-white/80 via-white/50 to-white/30 dark:from-transparent dark:via-transparent dark:to-transparent p-6 sm:p-10 -mx-6 sm:mx-0 rounded-3xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-none border border-white/60 dark:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] hover:border-white/90 dark:hover:-translate-y-0">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none dark:hidden"></div>`;

const newStr = `<div className="relative group bg-gradient-to-br from-white/80 via-white/50 to-white/30 dark:from-white/10 dark:via-white/5 dark:to-transparent p-6 sm:p-10 -mx-6 sm:mx-0 rounded-3xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] hover:border-white/90 dark:hover:border-white/20">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>`;

fileContent = fileContent.replace(oldStr, newStr);

fs.writeFileSync('first-app/src/pages/Home.tsx', fileContent);
console.log('Applied Glassmorphism to Dark Mode too!');
