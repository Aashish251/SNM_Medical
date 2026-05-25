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
    // The app bundles can exceed Rollup's default warning threshold due to charts/UI libs.
    // This does not affect runtime; it only silences noisy build warnings.
    chunkSizeWarningLimit: 1000,
  },

  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
    }
  }
});
