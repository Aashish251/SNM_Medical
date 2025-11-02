/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Brand Theme Colors
        primary: {
          DEFAULT: "#6B21A8", // purple-700
          light: "#8B5CF6",   // lighter purple
          dark: "#581C87",    // darker purple
          scrolled: "#4C1D95" // purple for scrolled state
        },
        secondary: {
          DEFAULT: "#EC4899", // pink-500
          light: "#F472B6",
          dark: "#BE185D",
          scrolled: "#DB2777" // pink for scrolled state
        },
        accent: {
          DEFAULT: "#FACC15", // yellow-400
          light: "#FEF08A",
          dark: "#CA8A04",
          scrolled: "#EAB308" // yellow for scrolled state
        },
        neutral: {
          light: "#F3F4F6",
          DEFAULT: "#9CA3AF",
          dark: "#111827",
          scrolled: "#4B5563" // gray for scrolled state
        },
      },

      // 🌈 Gradient Background (using theme colors)
      backgroundImage: (theme) => ({
        "theme-gradient": `linear-gradient(to right, ${theme("colors.primary.DEFAULT")}, ${theme("colors.secondary.DEFAULT")}, ${theme("colors.accent.DEFAULT")})`,
      }),
    },
  },
  plugins: [],
};
