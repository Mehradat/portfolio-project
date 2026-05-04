const fs = require('fs');
const p = '../first-app/src/pages/AdminPanel.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace('          }\n      if (!res.ok)', '          }\n        });\n\n      if (!res.ok)');
fs.writeFileSync(p, c);
