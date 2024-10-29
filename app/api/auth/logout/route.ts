import { handleLogout } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const logout = handleLogout({
    returnTo: '/',
  });

  return logout(request);
}