import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Offline() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
        <p className="text-muted-foreground mb-8">
          Please check your internet connection and try again
        </p>
        <Button asChild>
          <Link href="/">Retry</Link>
        </Button>
      </div>
    </div>
  );
}