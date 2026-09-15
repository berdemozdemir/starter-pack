import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Local Supabase Storage (127.0.0.1:54321) — Next.js 16 blocks private IPs by default (SSRF).
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
