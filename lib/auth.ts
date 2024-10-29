"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUser } from '@auth0/nextjs-auth0/client';

export type UserRole = 'homeowner' | 'contractor';

export type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      switchRole: (role) => {
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, activeRole: role } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useAuth = () => {
  const { user: auth0User, error, isLoading } = useUser();
  const { user: localUser, isAuthenticated: localAuth, login, logout, switchRole } = useAuthStore();

  const checkAuth = () => {
    if (process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer') {
      return localAuth && localUser !== null;
    }

    if (error) {
      console.error('Auth0 error:', error);
      return false;
    }

    return !isLoading && auth0User !== null;
  };

  // Use appropriate user based on environment
  const user = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer' ? localUser : auth0User ? {
    id: auth0User.sub!,
    name: auth0User.name!,
    email: auth0User.email!,
    roles: (auth0User['https://myapp.org/roles'] as UserRole[]) || ['homeowner'],
    activeRole: auth0User['https://myapp.org/activeRole'] as UserRole || 'homeowner',
  } : null;

  return {
    user,
    isAuthenticated: process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer' ? localAuth : !!auth0User,
    isLoading: process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer' ? false : isLoading,
    error: process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer' ? null : error,
    login,
    logout,
    switchRole,
    checkAuth,
  };
};