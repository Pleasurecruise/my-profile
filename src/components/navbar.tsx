import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom">
      {/* SVG liquid glass distortion filter */}
      <svg className="absolute size-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="liquid-glass-distort" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.022 0.018"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background" />

      {/* Liquid glass dock wrapper */}
      <div className="z-50 pointer-events-auto relative mx-auto">
        <Dock
          direction="middle"
          magnification={68}
          distance={120}
          className="relative flex items-center px-4 gap-1
            bg-transparent dark:bg-transparent
            border border-white/25 dark:border-black/30
            [box-shadow:0_4px_30px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.6)_inset]
            dark:[box-shadow:0_4px_30px_rgba(0,0,0,0.6),0_1px_0_rgba(0,0,0,0.4)_inset]
            transform-gpu
          "
        >
          {DATA.navbar.map((item) => (
            <DockIcon key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-full rounded-full"
                    )}
                  >
                    <item.icon className="size-1/2" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full" />
          {Object.entries(DATA.contact.social)
            .filter(([, social]) => social.navbar)
            .map(([name, social]) => (
              <DockIcon key={name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={social.url}
                      aria-label={name}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-full rounded-full"
                      )}
                    >
                      <social.icon className="size-1/2" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{name}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
          <Separator orientation="vertical" className="h-full py-2" />
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModeToggle />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>

        {/* Specular highlight — simulates light refracting through curved glass */}
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full pointer-events-none bg-gradient-to-b from-white/20 to-transparent" />
        <div className="absolute top-px left-[12%] right-[12%] h-px pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      </div>
    </div>
  );
}
