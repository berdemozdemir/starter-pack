import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    // Local Supabase Storage (127.0.0.1:54321) — Next.js 16 blocks private IPs by default (SSRF).
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
