"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogoutButton } from "@/components/LogoutButton";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (user?.activeRole) {
      router.push(`/dashboard/${user.activeRole}`);
    } else {
      router.push('/');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const NavItems = () => (
    <>
      {user ? (
        <>
          {user.roles && user.roles.length > 1 && <RoleSwitcher />}
          <LogoutButton />
        </>
      ) : (
        <>
          <Button asChild variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </>
  );

  if (!mounted) {
    return (
      <header className="sticky-header animate-pulse">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 bg-muted rounded" />
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-10 w-10 bg-muted rounded" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky-header ${scrolled ? 'scrolled shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 py-4 relative">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>

          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold absolute left-1/2 -translate-x-1/2"
          >
            WHATEVER™
          </button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold"
          >
            WHATEVER™
          </button>
          
          <nav className="flex items-center space-x-4">
            <NavItems />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}