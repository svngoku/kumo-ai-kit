import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// Library build — emits ESM + type declarations for the kumo-ai-kit package
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src/lib"], tsconfigPath: "./tsconfig.json", rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: "src/lib/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^react\/jsx-runtime/,
        /^@cloudflare\/kumo($|\/)/,
        /^@phosphor-icons\/react($|\/)/,
      ],
    },
  },
});
