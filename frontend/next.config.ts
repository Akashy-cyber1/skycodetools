import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable trailing slash redirects for API routes
  // This prevents 308 redirects that break POST requests with FormData
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
