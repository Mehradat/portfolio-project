import { useEffect, useRef } from "react";
import * as THREE from "three";

function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const getSize = () => ({
      width: mount.clientWidth || window.innerWidth,
      height: mount.clientHeight || window.innerHeight,
    });

    const initialSize = getSize();
    renderer.setSize(initialSize.width, initialSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    // HELPER: CREATE TEXTURE FROM TEXT
    const createTextTexture = (text, color) => {
      const canvas = document.createElement("canvas");
      const size = 128; // Increased size for sharper rendering
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size); // Transparent background

      ctx.font = "bold 80px Arial"; // Larger font 
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Add a slight shadow for depth and better visibility in both modes
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = color;
      ctx.fillText(text, size / 2, size / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Better filtering
      texture.needsUpdate = true;
      return texture;
    };

        // SYMBOLS & PARTICLES
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

    scene.add(particlesGroup);

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;

    const animateParticles = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener("mousemove", animateParticles);

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate group
      particlesGroup.rotation.y = elapsedTime * 0.05;
      
      // Subtle individual layer movement
      particlesGroup.children.forEach((mesh, i) => {
        mesh.rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1);
      });

      // Mouse interactivity
      const targetRotX = -mouseY * 0.2;
      const targetRotY = mouseX * 0.2;
      
      particlesGroup.rotation.x += (targetRotX - particlesGroup.rotation.x) * 0.05;
      particlesGroup.rotation.y += (targetRotY - particlesGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // RESIZE HANDLER
    const handleResize = () => {
      const { width, height } = getSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", animateParticles);
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      cleanupMeshes.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); if (mesh.material.map) mesh.material.map.dispose(); });
      observer.disconnect();
      
      renderer.dispose();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
    />
  );
};

export default ThreeBackground;
