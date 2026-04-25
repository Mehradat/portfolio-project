const fs = require('fs');
let content = fs.readFileSync('server/server.js', 'utf-8');

// Replace API_URL used in uploads with process.env.BASE_URL 
content = content.replace(/\$\{API_URL\}\/uploads\/(\$\{req[^}]+\})/g, '${process.env.BASE_URL}/uploads/$1');
content = content.replace(/\$\{API_URL\}\/uploads\/\$\{file\.filename\}/g, '${process.env.BASE_URL}/uploads/${file.filename}');

fs.writeFileSync('server/server.js', content);
console.log('Fixed uploads URLs');
