import { readFileSync } from "node:fs";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { voidPlugin } from "void";

const SITE = "https://you-find.me";
const PRIVATE_ROUTES = new Set([
  "/login",
  "/signup",
  "/password",
  "/password/forget",
  "/password/reset",
]);
const ROUTE_TITLES: Record<string, string> = {
  "/chat": "Chat",
  "/cv": "CV",
  "/social": "Social",
  "/story": "Story",
};

export default defineConfig(({ command }) => ({
  envDir: command === "build" ? ".void/build-env" : ".",
  plugins: [
    voidPlugin(),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    {
      name: "my-profile:route-shells",
      apply: "build",
      enforce: "post",
      applyToEnvironment: (environment) => environment.name === "client",
      generateBundle(_, bundle) {
        const index = bundle["index.html"];
        if (index === undefined || index.type !== "asset" || typeof index.source !== "string") {
          throw new Error("Missing built index.html for route shells");
        }
        const shell = index.source;
        const tree = readFileSync(new URL("./src/routeTree.gen.ts", import.meta.url), "utf8");
        const start = tree.indexOf("fullPaths:");
        const end = tree.indexOf("fileRoutesByTo:", start);
        if (start === -1 || end === -1) throw new Error("routeTree.gen.ts has no fullPaths union");
        const hidden = shell
          .replace(/\s*<link rel="canonical"[^>]*>/, "")
          .replace("</head>", '  <meta name="robots" content="noindex" />\n  </head>');
        this.emitFile({ type: "asset", fileName: "404.html", source: hidden });
        for (const path of tree
          .slice(start + "fullPaths:".length, end)
          .split("|")
          .slice(1)
          .map((member) => member.trim().slice(1, -1))) {
          if (path === "/") continue;
          const title = ROUTE_TITLES[path];
          if (!PRIVATE_ROUTES.has(path) && title === undefined) {
            throw new Error(`Missing route title for ${path}`);
          }
          this.emitFile({
            type: "asset",
            fileName: `${path.slice(1)}.html`,
            source: PRIVATE_ROUTES.has(path)
              ? hidden
              : shell
                  .replace(
                    '<link rel="canonical" href="https://you-find.me/" />',
                    `<link rel="canonical" href="${SITE}${path}" />`,
                  )
                  .replace(
                    '<meta property="og:url" content="https://you-find.me/" />',
                    `<meta property="og:url" content="${SITE}${path}" />`,
                  )
                  .replace("<title>Pleasure1234</title>", `<title>${title} · Pleasure1234</title>`),
          });
        }
      },
    },
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
