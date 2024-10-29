import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export const GET = isWebContainer
  ? () => new Response('Auth0 routes not available in web container mode', { status: 404 })
  : handleAuth({
      login: handleLogin({
        returnTo: '/dashboard',
      }),
      callback: handleCallback({
        redirectUri: process.env.AUTH0_REDIRECT_URI,
      }),
    });

export const POST = GET;