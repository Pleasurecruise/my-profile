import { CherryBlossom } from "@my-profile/ui";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FloatingTerminal } from "@/components/layout/floating-terminal";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider delayDuration={0}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
          <div
            className="dark:hidden absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.95) 0%, transparent 70%)",
            }}
          />
          <div
            className="hidden dark:block absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.05) 0%, transparent 65%)",
            }}
          />
          <div className="bg-noise absolute inset-0 opacity-[0.05] dark:opacity-[0.025]" />
        </div>

        <CherryBlossom />
        <ScrollProgress />

        <div className="relative z-[2] mx-auto w-full max-w-2xl px-6 pt-12 pb-24 sm:py-24">
          <Outlet />
          <Navbar />
          <FloatingTerminal />
          <Toaster />
        </div>

        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-left" />}
      </TooltipProvider>
    </ThemeProvider>
  );
}
