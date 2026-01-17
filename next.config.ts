import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'img-cn.static.isla.fan',
      },
      {
        protocol: 'https',
        hostname: 'gravatar.com',
      },
    ],
  },
  serverExternalPackages: ['ali-oss'],
};

export default nextConfig;
