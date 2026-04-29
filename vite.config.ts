import { defineConfig } from "vite-plus";
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    cloudflare(),
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@shared": new URL("./types", import.meta.url).pathname,
    },
  },
  build: {
    outDir: "dist/client",
  },
  lint: {
    ignorePatterns: [
      "dist/**",
      "src/generated/**",
      "src/routeTree.gen.ts",
      "worker-configuration.d.ts",
    ],
  },
  fmt: {
    indent: "tab",
    ignorePatterns: [
      "dist/**",
      "src/generated/**",
      "src/routeTree.gen.ts",
      "worker-configuration.d.ts",
    ],
  },
});
