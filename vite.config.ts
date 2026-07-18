import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { voidPlugin } from "void";

export default defineConfig(({ command }) => ({
  envDir: command === "build" ? ".void/build-env" : ".",
  plugins: [
    voidPlugin(),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ["@cloudflare/pages-plugin-vercel-og", "@cloudflare/pages-plugin-vercel-og/api"],
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@shared": new URL("./types", import.meta.url).pathname,
      "@server": new URL("./server", import.meta.url).pathname,
    },
  },
  lint: {
    ignorePatterns: ["dist/**", "src/generated/**", "src/routeTree.gen.ts"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    indent: "tab",
    ignorePatterns: ["dist/**", "src/generated/**", "src/routeTree.gen.ts"],
  },
}));
