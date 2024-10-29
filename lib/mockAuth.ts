"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/lib/auth';

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        // In web container, ensure both roles are available
        const roles = isWebContainer ? ['homeowner', 'contractor'] as UserRole[] : user.roles;
        const activeRole = user.activeRole || roles[0];
        
        set({ 
          user: { ...user, roles, activeRole },
          isAuthenticated: true 
        });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      switchRole: (role) => set((state) => ({
        ...state,
        user: state.user ? { ...state.user, activeRole: role } : null,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, switchRole } = useAuthStore();
  
  const checkAuth = () => {
    return isAuthenticated && user !== null;
  };

  return { user, isAuthenticated, login, logout, switchRole, checkAuth };
}