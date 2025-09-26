import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md">
              Sorry, the page you are visiting does not exist or has been moved.
              Please check if the URL is correct, or return to the home page to continue browsing.
          </p>
        </div>
      </BlurFade>
      
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/blog">
              Visit Blog
            </Link>
          </Button>
        </div>
      </BlurFade>
    </div>
  );
}