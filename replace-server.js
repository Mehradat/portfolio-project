const fs = require('fs');
let content = fs.readFileSync('server/server.js', 'utf-8');

// Insert API_URL definition
if (!content.includes('const API_URL')) {
    content = content.replace('dotenv.config();\n', 'dotenv.config();\n\nconst API_URL = process.env.API_URL || "http://localhost:5005";\n');
}

// Replace occurrences
content = content.replace(/`http:\/\/localhost:5005\/uploads\/\$\{([^}]+)\}`/g, '`${API_URL}/uploads/${$1}`');

fs.writeFileSync('server/server.js', content);
console.log('Server updated');
