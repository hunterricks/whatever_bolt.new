"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { UserCircle } from "lucide-react";
import type { UserRole } from "@/lib/auth";
import { useRouter } from 'next/navigation';

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const router = useRouter();

  if (!user?.roles || user.roles.length <= 1) {
    return null;
  }

  const handleRoleSwitch = async (role: UserRole) => {
    if (role !== user.activeRole) {
      switchRole(role);
      await new Promise(resolve => setTimeout(resolve, 0)); // Allow state to update
      router.push(`/dashboard/${role}`);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    return role === 'homeowner' ? 'Homeowner' : 'Contractor';
  };

  return (
    <div className="flex items-center gap-2">
      {isWebContainer && (
        <div className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
          Web Container Mode
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <UserCircle className="h-4 w-4" />
            {getRoleLabel(user.activeRole)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user.roles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`gap-2 cursor-pointer ${role === user.activeRole ? 'bg-primary/5' : ''}`}
            >
              <UserCircle className="h-4 w-4" />
              Switch to {getRoleLabel(role)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}