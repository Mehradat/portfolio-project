const fs = require('fs');
let fileContent = fs.readFileSync('first-app/src/components/Header.tsx', 'utf-8');

// 1. Fix header wrapper background and remove backdrop-blur in light mode
fileContent = fileContent.replace(
    /className=\{\`fixed w-full top-0 left-0 z-\[100\] font-sans transition-all duration-300 border-b \$\{\s*scrolled\s*\?\s*"[^"]+"\s*:\s*"[^"]+"\s*\}\s*\$\{className\}\`\}/,
    `className={\`fixed w-full top-0 left-0 z-[100] font-sans transition-all duration-300 border-b \${
        scrolled 
          ? "bg-white shadow-sm border-slate-200 dark:bg-slate-950/95 dark:backdrop-blur-md dark:shadow-md dark:border-white/10"
          : "bg-transparent border-transparent dark:border-transparent"
      } \${className}\`}`
);

// 2. Fix the hover and active colors to be indigo-600 in light mode and yellow-400 in dark mode
fileContent = fileContent.replace(
    /hover:text-yellow-400 md:px-0 md:py-0 \$\{(isActive) \? "text-yellow-400" : ""\}/g,
    'hover:text-indigo-600 dark:hover:text-yellow-400 md:px-0 md:py-0 ${$1 ? "text-indigo-600 dark:text-yellow-400" : ""}'
);

// 3. Fix the underline background color
fileContent = fileContent.replace(
    /bg-yellow-400 transition-all duration-300 ease-out group-hover:w-\[calc\(100%-1\.5rem\)\] md:left-0 md:-bottom-2 md:group-hover:w-full/g,
    'bg-indigo-600 dark:bg-yellow-400 transition-all duration-300 ease-out group-hover:w-[calc(100%-1.5rem)] md:left-0 md:-bottom-2 md:group-hover:w-full'
);

// 4. Admin Panel link hover
fileContent = fileContent.replace(
    /hover:text-yellow-400( md:px-0 md:py-0)/g,
    'hover:text-indigo-600 dark:hover:text-yellow-400$1'
);

// 5. Mobile menu background - remove blur in light mode
fileContent = fileContent.replace(
    /bg-white\/95 dark:bg-slate-950\/95 text-slate-900 dark:text-white p-4 shadow-2xl backdrop-blur-xl md:border-0/g,
    'bg-white dark:bg-slate-950/95 text-slate-900 dark:text-white p-4 shadow-2xl dark:backdrop-blur-xl md:border-0'
);

fs.writeFileSync('first-app/src/components/Header.tsx', fileContent);
console.log('Fixed Header!');
