import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/sell", destination: "/dashboard/seller/upload", permanent: false },
      { source: "/signin", destination: "/auth/auth1/login", permanent: false },
      { source: "/signup", destination: "/auth/auth1/register", permanent: false },
      { source: "/forgot-password", destination: "/auth/auth1/forgot-password", permanent: false },
      { source: "/properties", destination: "/dashboard/buy", permanent: false },
      { source: "/properties/:slug", destination: "/dashboard/buy", permanent: false },
      { source: "/blogs", destination: "/dashboard/buy", permanent: false },
      { source: "/blogs/:slug", destination: "/dashboard/buy", permanent: false },
      { source: "/documentation", destination: "/dashboard", permanent: false },
      { source: "/contactus", destination: "/dashboard", permanent: false },
      { source: "/privacy-policy", destination: "/dashboard", permanent: false },
      { source: "/terms-and-conditions", destination: "/dashboard", permanent: false },
    ];
  },
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
