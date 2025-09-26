'use client'

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import BlurFade from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">Oops!</h1>
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md">
              Sorry, an error occurred while loading the page.
              This might be a temporary issue; please try refreshing the page or try again later.
          </p>
        </div>
      </BlurFade>
      
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={reset}>
            Refresh
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </BlurFade>
      
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="mt-8 text-sm text-muted-foreground">
          错误ID: {error.digest && `${error.digest.substring(0, 8)}`}
        </div>
      </BlurFade>
    </div>
  );
}