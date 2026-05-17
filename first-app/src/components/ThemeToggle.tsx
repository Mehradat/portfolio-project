import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  // Initialize state synchronously so there's no jump on mount
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    // Read from localStorage on first full load if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || !savedTheme) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
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
        initial={false}
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
