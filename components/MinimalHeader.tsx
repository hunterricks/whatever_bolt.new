"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export function MinimalHeader() {
  return (
    <header className="sticky-header">
      <div className="container mx-auto px-4 py-4 relative">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between lg:hidden">
          <div className="w-10" /> {/* Spacer to maintain centering */}
          <Link 
            href="/"
            className="text-2xl font-bold absolute left-1/2 -translate-x-1/2"
          >
            WHATEVER™
          </Link>
          <ModeToggle />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          <Link 
            href="/"
            className="text-2xl font-bold"
          >
            WHATEVER™
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}