const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Projects.tsx', 'utf-8');

fileContent = fileContent.replace(
    /className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"/g,
    'className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"'
);

// The first <div> inside the map is the image container
fileContent = fileContent.replace(
    /<div key={project._id} className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">\n              <div>/g,
    '<div key={project._id} className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">\n              <div className="w-full lg:w-7/12">'
);

// The second div is the text container
fileContent = fileContent.replace(
    /<div className="bg-white\/70 dark:bg-slate-900\/40 p-6 md:p-8 rounded-2xl backdrop-blur-md shadow-lg border border-white\/50 dark:border-white\/10">/g,
    '<div className="w-full lg:w-5/12 bg-white/70 dark:bg-slate-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-md shadow-lg border border-white/50 dark:border-white/10">'
);

// object-contain object-top is causing empty spaces if image doesn't match aspect ratio. 
// We'll also change object-contain to object-cover to make the pictures feel bigger and fill their frame:
fileContent = fileContent.replace(
    /className="cursor-pointer w-full h-full object-contain object-top"/g,
    'className="cursor-pointer w-full h-full object-cover object-top"'
);

fs.writeFileSync('first-app/src/pages/Projects.tsx', fileContent);
console.log('Fixed Projects image sizes!');
