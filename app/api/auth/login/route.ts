import { handleLogin } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const returnTo = searchParams.get('returnTo');
    const screenHint = searchParams.get('screen_hint');

    return handleLogin({
      returnTo: returnTo || '/dashboard',
      authorizationParams: {
        screen_hint: screenHint || undefined,
        prompt: 'login',
      },
    })(request);
  } catch (error) {
    console.error('Login error:', error);
    return new Response('Login failed', { status: 500 });
  }
}