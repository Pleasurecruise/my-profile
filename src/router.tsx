import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/query-client";

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultStaleTime: 30_000,
  defaultPreloadStaleTime: 30_000,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
