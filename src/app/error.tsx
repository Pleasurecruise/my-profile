'use client'

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

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
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-muted-foreground">Oops!</h1>
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
            Sorry, an error occurred while loading the page.
            This might be a temporary issue; please try refreshing the page or try again later.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset}>
          Refresh
        </Button>
        
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        错误ID: {error.digest && `${error.digest.substring(0, 8)}`}
      </div>
    </div>
  );
}