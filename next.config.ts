import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // No need for appDir — it's enabled by default in Next.js 14+
};

export default nextConfig;
