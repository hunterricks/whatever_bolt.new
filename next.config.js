/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Disable Webpack caching by setting cache to false
    config.cache = false;

    return config;
  },
  env: {
    NEXT_PUBLIC_ENV_MODE: process.env.NEXT_PUBLIC_ENV_MODE || 'production',
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_REDIRECT_URI: process.env.AUTH0_REDIRECT_URI,
    AUTH0_POST_LOGOUT_REDIRECT_URI: process.env.AUTH0_POST_LOGOUT_REDIRECT_URI,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '0.0.0.0:3000']
    }
  }
};

module.exports = nextConfig;