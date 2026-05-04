const fs = require('fs');
const filepath = '../first-app/src/pages/AdminPanel.tsx';
let code = fs.readFileSync(filepath, 'utf8');

// Replace fetch(...) calls where credentials are included
code = code.replace(/fetch\((.*?), \{(.*?)\}\)/gs, (match, p1, p2) => {
  if (p2.includes('credentials: "include"')) {
    // Remove credentials
    let newOptions = p2.replace(/credentials:\s*"include",?(\s*\/\/\s*SESSION\s*COOKIE)?/g, '');
    
    // Add token header
    if (newOptions.includes('headers: {')) {
      newOptions = newOptions.replace(/headers:\s*\{/, 'headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,');
    } else {
      newOptions += `\n        headers: { "Authorization": \`Bearer \${localStorage.getItem("adminToken")}\` },`;
    }
    return `fetch(${p1}, {${newOptions}})`;
  }
  return match;
});

fs.writeFileSync(filepath, code);
console.log('Fixed AdminPanel res calls');
