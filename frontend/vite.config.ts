import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],  

  // 🔥 Required for static hosting (Render / Netlify / Vercel)
  base: "/",

  // 🔥 Make sure Vite builds into /dist directory
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
              return "vendor-charts";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (
              id.includes("@reduxjs/toolkit") ||
              id.includes("react-redux") ||
              id.includes("redux-persist")
            ) {
              return "vendor-redux";
            }
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            if (id.includes("react-hook-form")) {
              return "vendor-forms";
            }
            if (id.includes("lodash") || id.includes("date-fns")) {
              return "vendor-utils";
            }
            if (id.includes("modules/admin-panel")) {
              return "admin-panel";
            }
            if (id.includes("@tanstack/react-table")) {
              return "vendor-tanstack-table";
            }
            if (id.includes("recharts")) {
              return "vendor-recharts";
            }
            return "vendor";
          }
        },
      },
    },
  },

  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
      "@entities": fileURLToPath(new URL("./src/entities", import.meta.url)),
      "@widgets": fileURLToPath(new URL("./src/widgets", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@admin-panel": fileURLToPath(new URL("./src/modules/admin-panel", import.meta.url)),
    }
  }
});
