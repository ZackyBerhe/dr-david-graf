import type { NextConfig } from "next";

// For Deployment
const nextConfig: NextConfig = {
  output: 'export', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
