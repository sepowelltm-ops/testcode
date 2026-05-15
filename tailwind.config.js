/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 40px rgba(34, 197, 94, 0.22)",
      },
    },
  },
  plugins: [],
};
