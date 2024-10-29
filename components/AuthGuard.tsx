"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'homeowner' | 'contractor';
}

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }

    if (requiredRole && user?.activeRole !== requiredRole) {
      // In web container, allow access to all roles
      if (!isWebContainer) {
        router.push(`/dashboard/${user?.activeRole}`);
      }
    }
  }, [checkAuth, router, user?.activeRole, requiredRole]);

  if (!checkAuth()) {
    return null;
  }

  if (requiredRole && user?.activeRole !== requiredRole && !isWebContainer) {
    return null;
  }

  return <>{children}</>;
}