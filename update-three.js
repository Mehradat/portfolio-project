const fs = require('fs');

let fileContent = fs.readFileSync('first-app/src/components/ThreeBackground.jsx', 'utf-8');

const newCode = `    // SYMBOLS & PARTICLES
    const symbols = ["♪", "♫", "♩", "♬", "</>", "{ }", ";", "//","𝄞","⚛","⁴⁰⁴","⋆.˚","𝄢"];
    
    // Define both color palettes
    const lightModeColors = ["#ea580c", "#d946ef", "#8b5cf6", "#3b82f6", "#10b981", "#ef4444"]; 
    const darkModeColors = ["#facc15", "#fbbf24", "#a855f7", "#6366f1"]; // Original yellow & indigo

    const particlesGroup = new THREE.Group();
    const cleanupMeshes = [];
    const materialsArray = [];

    const isDarkMode = () => document.documentElement.classList.contains("dark");

    const createMaterials = () => {
      const modeColors = isDarkMode() ? darkModeColors : lightModeColors;
      symbols.forEach((symbol, index) => {
        const color = modeColors[index % modeColors.length];
        const texture = createTextTexture(symbol, color);
        
        if (materialsArray[index]) {
            materialsArray[index].map.dispose();
            materialsArray[index].map = texture;
            materialsArray[index].needsUpdate = true;
        } else {
            const particlesMaterial = new THREE.PointsMaterial({
              size: 0.5,
              map: texture,
              transparent: true,
              opacity: 1.0,
              depthWrite: false,
              blending: THREE.NormalBlending,
            });
            materialsArray.push(particlesMaterial);
        }
      });
    };
    
    createMaterials();

    // Watch for theme changes on HTML to dynamically switch colors
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            createMaterials();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    symbols.forEach((symbol, index) => {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = window.innerWidth < 768 ? 48 : 80;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      );

      const particlesMaterial = materialsArray[index];
      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      
      // Random rotation
      particlesMesh.rotation.x = Math.random() * Math.PI;
      particlesMesh.rotation.y = Math.random() * Math.PI;

      particlesGroup.add(particlesMesh);
      cleanupMeshes.push({ geometry: particlesGeometry, material: particlesMaterial });
    });

    scene.add(particlesGroup);`;

// Let's replace the whole "// SYMBOLS & PARTICLES" to "scene.add(particlesGroup);"

const startIdx = fileContent.indexOf('// SYMBOLS & PARTICLES');
const endIdx = fileContent.indexOf('scene.add(particlesGroup);') + 'scene.add(particlesGroup);'.length;

const finalContent = fileContent.substring(0, startIdx) + newCode + fileContent.substring(endIdx);
let cleanupSection = finalContent.replace(
      /cleanupMeshes.forEach\(mesh => \{([^{}]+)\}\);/g, 
      "cleanupMeshes.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); if (mesh.material.map) mesh.material.map.dispose(); });\n      observer.disconnect();"
);

fs.writeFileSync('first-app/src/components/ThreeBackground.jsx', cleanupSection);
console.log('Done replacement!');
