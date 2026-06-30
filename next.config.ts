import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Template demo routes under /dashboard retain legacy typing; tighten when replacing with AVIATONLY features.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
