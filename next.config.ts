import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@vercel/blob'],
  },
  api: {
    bodyParser: {
      sizeLimit: '200mb',
    },
    responseLimit: false,
  },
  // Increase the maximum payload size for API routes
  serverRuntimeConfig: {
    maxFileSize: 200 * 1024 * 1024, // 200MB
  },
  // Configure headers for better video handling
  async headers() {
    return [
      {
        source: '/api/upload-video',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
