import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import devServer from "@hono/vite-dev-server";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    devServer({
      entry: "./server/app.ts",
      exclude: [/^\/(?!api(?:\/|$)).*/],
    }),
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  build: {
    outDir: "dist/client",
  },
  ssr: {
    external: [
      "@prisma/client",
      "@prisma/adapter-pg",
      "@better-auth/prisma-adapter",
      "ali-oss",
      "nodemailer",
      "notion-client",
      "notion-types",
      "openai",
      "better-auth",
      "pg",
    ],
  },
  lint: {
    ignorePatterns: ["dist/**", "src/generated/**", "src/routeTree.gen.ts"],
  },
  fmt: {
    indent: "tab",
    ignorePatterns: ["dist/**", "src/generated/**", "src/routeTree.gen.ts"],
  },
});
