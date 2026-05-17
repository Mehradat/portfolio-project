const fs = require('fs');
let file = 'first-app/src/components/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `      className={\`fixed w-full top-0 left-0 z-[100] font-sans transition-all duration-300 border-b \${
        scrolled 
          ? className.includes("text-slate-9") || className.includes("text-black") 
            ? "bg-white/95 backdrop-blur-md shadow-sm border-slate-200" 
            : "bg-slate-950/95 backdrop-blur-md shadow-md border-white/10"
          : className.includes("text-slate-9") || className.includes("text-black")
            ? "bg-transparent border-slate-200"
            : "bg-transparent border-white/10"
      } \${className}\`}`;

const replaceStr = `      className={\`fixed w-full top-0 left-0 z-[100] font-sans transition-all duration-300 border-b \${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm border-slate-200 dark:bg-slate-950/95 dark:shadow-md dark:border-white/10"
          : "bg-transparent border-slate-200 dark:border-white/10"
      } \${className}\`}`;

if (content.includes('scrolled \n          ? className.includes("text-slate-9")')) {
  // Try regex replace
  content = content.replace(/className=\{`fixed[^\`]*`\}/, replaceStr);
}

// Ensure the replace actually targets effectively
content = content.replace(/className=\{`fixed w-full top-0 left-0 z-\[100\] font-sans transition-all duration-300 border-b \$\{.*?\} \$\{className\}`\}/s, replaceStr);

fs.writeFileSync(file, content);
console.log("Fixed header scroll!");
