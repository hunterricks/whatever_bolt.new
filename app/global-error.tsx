"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground">Please try again later.</p>
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}