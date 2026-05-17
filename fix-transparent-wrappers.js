const fs = require('fs');

const files = ['first-app/src/pages/About.tsx', 'first-app/src/pages/Projects.tsx', 'first-app/src/pages/music.tsx', 'first-app/src/pages/Contact.tsx'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Any min-h-screen div should be transparent to show the 3D bg behind it
  content = content.replace(/className="min-h-screen\b[^"]*"/, (match) => {
    // Remove any bg- white, slate, gray from the wrapper 
    let newClass = match;
    newClass = newClass.replace(/bg-slate-\S+/g, 'bg-transparent');
    newClass = newClass.replace(/bg-white(?!\/)\S*/g, 'bg-transparent');
    newClass = newClass.replace(/dark:bg-slate-\S+/g, 'dark:bg-transparent');
    // Ensure transition
    if(!newClass.includes('transition-colors')) {
      newClass = newClass.replace('"', ' transition-colors duration-500"');
    }
    return newClass;
  });

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
