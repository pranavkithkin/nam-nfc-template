import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // Allow server actions and API routes to call Prisma without bundling issues
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
