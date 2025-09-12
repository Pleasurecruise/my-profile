import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <div className="space-y-2">
        <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
            Sorry, the page you are visiting does not exist or has been moved.
            Please check if the URL is correct, or return to the home page to continue browsing.
        </p>
      </div>
      
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
    </div>
  );
}