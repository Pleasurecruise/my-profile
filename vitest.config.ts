import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@shared": new URL("./types", import.meta.url).pathname,
      "@server": new URL("./server", import.meta.url).pathname,
    },
  },
  test: {
    environment: "node",
    include: ["packages/**/*.test.ts", "server/**/*.test.ts", "types/**/*.test.ts"],
  },
});
