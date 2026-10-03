import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Seed photos, locally stored uploads (dev), and Vercel Blob uploads (production).
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/uploads/**", search: "" },
    ],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/businesses/**" }],
  },
  experimental: {
    // One photo per request; photos are downscaled in the browser and capped at 4 MB server-side.
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
