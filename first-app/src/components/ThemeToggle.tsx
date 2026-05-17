import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state from html element
    const isDarkNow = document.documentElement.classList.contains('dark');
    setIsDark(isDarkNow);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-14 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out border outline-none cursor-pointer ${
        isDark ? 'bg-slate-800 border-white/20' : 'bg-blue-100 border-yellow-300'
      }`}
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        className="absolute left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
        animate={{
          x: isDark ? 24 : 0,
        }}
      >
        {isDark ? (
          <span className="text-[10px]">🌙</span>
        ) : (
          <span className="text-[10px]">☀️</span>
        )}
      </motion.div>
    </button>
  );
}
