import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particlesArray = [];

    // Resize canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const mouse = {
      x: null,
      y: null,
    };

    let lastSpawn = { x: 0, y: 0 };

    const symbols = ["♪", "♫", "♬", "♩", "{ }", "< />", "[ ]", ";", "</>"];

    // Particle Class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Random starting size - slightly larger for readability
        this.size = Math.random() * 15 + 12;
        // Slower drift so they look elegant
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1.5 - 0.5;
        // Float angle and spin
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.04;
        // Longer life so they fade gracefully
        this.life = 1;
        // Randomly pick a symbol for this particle
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Randomly mix white and yellow for variation
        this.isYellow = Math.random() > 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Gentle rotation
        this.angle += this.spin;
        // Slower shrink
        this.size -= 0.05;
        // Slower fade
        this.life -= 0.01;
      }

      draw() {
        if (this.size > 0 && this.life > 0) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);

          // Color calculation
          const color = this.isYellow 
            ? `rgba(250, 204, 21, ${this.life})` // yellow-400
            : `rgba(255, 255, 255, ${this.life})`; // white
            
          ctx.fillStyle = color;
          ctx.font = `${this.size}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Subtle glow effect
          ctx.shadowBlur = 12;
          ctx.shadowColor = color;
          
          ctx.fillText(this.symbol, 0, 0);
          ctx.restore();
        }
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Only spawn particles if the mouse has moved a certain distance to prevent overlapping clutter
      const dx = mouse.x - lastSpawn.x;
      const dy = mouse.y - lastSpawn.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 35) { // Spawn one symbol every 35 pixels
        lastSpawn = { x: mouse.x, y: mouse.y };
        
        // slight random offset so they emanate organically from the cursor
        const randomX = mouse.x + (Math.random() * 10 - 5);
        const randomY = mouse.y + (Math.random() * 10 - 5);
        particlesArray.push(new Particle(randomX, randomY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Remove dead particles
        if (particlesArray[i].size <= 0.2 || particlesArray[i].life <= 0) {
          particlesArray.splice(i, 1);
          i--;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] hidden md:block"
    />
  );
}
