import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: [],
  },
  async rewrites() {
    return [
      { source: "/", destination: "/index.html" },
      { source: "/contact", destination: "/contact.html" },
      { source: "/services", destination: "/services.html" },
      { source: "/portfolio", destination: "/portfolio.html" },
      { source: "/event", destination: "/Event.html" },
      { source: "/career", destination: "/Career.html" },
    ];
  },
};

export default nextConfig;
