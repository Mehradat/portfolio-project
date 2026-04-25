/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "serif"], // Fallback changed for testing, but mostly ensures Inter is sans
        serif: ["Playfair", "serif"],
      },
    },
  },
  plugins: [],
};
