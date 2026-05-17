const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/pages/Home.tsx', 'utf-8');

const oldStr = `<RevealOnScroll>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight text-slate-900 dark:text-white max-w-xl">`;

const newStr = `<RevealOnScroll>
                  <div className="bg-white/70 dark:bg-transparent p-6 sm:p-10 -mx-6 sm:mx-0 rounded-3xl backdrop-blur-md shadow-xl dark:shadow-none border border-white/50 dark:border-transparent">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight text-slate-900 dark:text-white max-w-xl">`;

fileContent = fileContent.replace(oldStr, newStr);

const oldStr2 = `                    </div>
                </RevealOnScroll>
              </div>

              <div className="order-1 lg:order-2`;

const newStr2 = `                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              <div className="order-1 lg:order-2`;
              
fileContent = fileContent.replace(oldStr2, newStr2);

fs.writeFileSync('first-app/src/pages/Home.tsx', fileContent);
console.log('Fixed Home Hero Blur securely!');
