import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Demo / showcase build
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist-demo",
  },
});
