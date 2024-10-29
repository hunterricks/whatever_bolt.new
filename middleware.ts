import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

// Skip Auth0 middleware in web container mode
export default isWebContainer 
  ? function middleware() { return Promise.resolve(); }
  : withMiddlewareAuthRequired({
      returnTo: '/login',
    });

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/post-job/:path*',
    '/browse-jobs/:path*',
    '/my-jobs/:path*',
    '/my-proposals/:path*',
    '/messages/:path*',
  ],
};