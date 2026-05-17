const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Home.tsx', 'utf-8');

// Fix the decorative background behind the image
const oldBgImg = 'className="absolute inset-0 h-full w-full object-contain object-center blur-md opacity-60 saturate-[3] brightness-[0.6] pointer-events-none"';
const newBgImg = 'className="absolute inset-0 h-full w-full object-contain object-center blur-2xl opacity-20 dark:opacity-60 saturate-[2] dark:saturate-[3] brightness-[1.1] dark:brightness-[0.6] pointer-events-none mix-blend-multiply dark:mix-blend-normal"';
fileContent = fileContent.replace(oldBgImg, newBgImg);

// Fix the drop-shadow on the meImage
const oldMeImg = 'className="relative z-10 w-full h-auto object-contain drop-shadow-2xl pointer-events-auto transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-4 hover:brightness-125 hover:drop-shadow-[0_20px_50px_rgba(250,204,21,0.5)]"';
const newMeImg = 'className="relative z-10 w-full h-auto object-contain drop-shadow-xl dark:drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-4 hover:brightness-105 dark:hover:brightness-125 hover:drop-shadow-[0_20px_50px_rgba(250,204,21,0.3)] dark:hover:drop-shadow-[0_20px_50px_rgba(250,204,21,0.5)]"';
fileContent = fileContent.replace(oldMeImg, newMeImg);

fs.writeFileSync('first-app/src/pages/Home.tsx', fileContent);
console.log('Fixed halo!');
