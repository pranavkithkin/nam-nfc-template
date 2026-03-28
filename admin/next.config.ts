import type { NextConfig } from "next";

// Build: 2026-03-28
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "botkzlznzftdluyhroot.supabase.co" },
    ],
  },
  // Allow server actions and API routes to call Prisma without bundling issues
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
