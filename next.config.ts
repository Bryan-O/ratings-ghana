import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Version-skew protection: lets Next.js detect when a browser tab was loaded from an
  // older deployment and reload it, instead of calling Server Actions that no longer exist.
  // Vercel sets VERCEL_DEPLOYMENT_ID on every deployment; undefined locally.
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
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
