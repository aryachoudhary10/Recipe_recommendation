import type { NextConfig } from "next";

// next.config.ts

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip blocking build on ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true,  // ✅ Skip blocking build on TS errors
  },
};

export default nextConfig;
