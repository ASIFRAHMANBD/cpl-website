import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Image optimization settings
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for versioned images
  },
  
  // Compression
  compress: true,
  poweredByHeader: false,
  
  // Security & Performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
      // Static assets - long term caching (1 year)
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Images - long term caching
      {
        source: '/:path(\\.(?:png|jpg|jpeg|gif|webp|avif|ico|svg))$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Fonts - long term caching
      {
        source: '/:path(\\.(?:woff|woff2|ttf|otf|eot))$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS and JS - moderate caching
      {
        source: '/:path(\\.(?:css|js))$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // HTML - no caching (always check)
      {
        source: '/:path(\\.html)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ['@fortawesome/fontawesome-free'],
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

  // Optimize build
  productionBrowserSourceMaps: false,
  
  // Prevent runtime errors from crashing the server
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
