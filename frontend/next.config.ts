import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enabled in Docker container for minimal production deployment
  ...(process.env.STANDALONE === "true" ? { output: "standalone" } : {}),
  reactStrictMode: true,
};

export default nextConfig;
