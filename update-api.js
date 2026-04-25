const fs = require("fs");

const files = [
  "first-app/src/components/Header.tsx",
  "first-app/src/pages/Projects.tsx",
  "first-app/src/pages/Contact.tsx",
  "first-app/src/pages/music.tsx",
  "first-app/src/pages/EditProject.tsx",
  "first-app/src/pages/AdminPanel.tsx",
  "first-app/src/pages/Admin.tsx",
  "first-app/src/pages/About.tsx",
];

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf-8");
  let original = content;

  // Add import if missing
  if (
    content.includes("http://localhost:5005") &&
    !content.includes("import { API_URL }")
  ) {
    const importPath = "../config";
    const lines = content.split("\n");
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        lastImportIdx = i;
      }
    }
    const importStr = `import { API_URL } from "${importPath}";`;
    lines.splice(lastImportIdx + 1, 0, importStr);
    content = lines.join("\n");
  }

  // Replacements
  content = content.replace(
    /"http:\/\/localhost:5005(\/api[^"]*)"/g,
    "`${API_URL}$1`",
  );
  content = content.replace(/"http:\/\/localhost:5005"/g, "API_URL");
  content = content.replace(
    /`http:\/\/localhost:5005(\/api[^`]*)`/g,
    "`${API_URL}$1`",
  );

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  }
});
