"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Briefcase, MessageSquare, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isHomeowner = user.activeRole === 'homeowner';
  const isContractor = user.activeRole === 'contractor';

  const getNavItems = () => {
    const baseItems = [
      {
        href: `/dashboard/${user.activeRole}`,
        icon: Home,
        label: 'Home'
      },
      {
        href: '/messages',
        icon: MessageSquare,
        label: 'Messages'
      },
      {
        href: '/notifications',
        icon: Bell,
        label: 'Alerts'
      }
    ];

    if (isHomeowner) {
      return [
        ...baseItems,
        {
          href: '/post-job',
          icon: Briefcase,
          label: 'Post Job'
        }
      ];
    }

    if (isContractor) {
      return [
        ...baseItems,
        {
          href: '/browse-jobs',
          icon: Search,
          label: 'Find Work'
        }
      ];
    }

    return baseItems;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden lg:hidden xl:hidden 2xl:hidden">
      <div className="flex justify-around items-center h-16">
        {getNavItems().map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "text-muted-foreground hover:text-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
