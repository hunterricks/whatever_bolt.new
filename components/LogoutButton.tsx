"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (isWebContainer) {
        logout();
        router.push('/login');
      } else {
        window.location.href = '/api/auth/logout';
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Log Out
    </Button>
  );
}