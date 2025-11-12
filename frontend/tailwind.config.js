/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // colors: {
      //   // 🎨 Brand Theme Colors
      //   primary: {
      //     DEFAULT: "#6B21A8", // purple-700
      //     light: "#8B5CF6",   // lighter purple
      //     dark: "#581C87",    // darker purple
      //     scrolled: "#4C1D95" // purple for scrolled state
      //   },
      //   secondary: {
      //     DEFAULT: "#EC4899", // pink-500
      //     light: "#F472B6",
      //     dark: "#BE185D",
      //     scrolled: "#DB2777" // pink for scrolled state
      //   },
      // },

      // 🌈 Gradient Background Images
      // Note: Standard gradient utilities (bg-gradient-to-b, from-*, to-*) work out of the box
      // This is for custom gradient using theme colors
      backgroundImage: {
        "theme-gradient": "var(--gradient-theme)", // forwards CSS variable for easier tweaks
        "gradient-purple-pink":
          "linear-gradient(to bottom, #6B21A8, #EC4899)", // purple-800 to pink-700 equivalent
      },
    },
  },
  plugins: [],
};
