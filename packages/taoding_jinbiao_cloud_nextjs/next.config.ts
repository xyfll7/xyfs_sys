import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mastergo.com",
      },
      {
        protocol: "https",
        hostname: "ai-public.mastergo.com",
      }
    ],
    // localPatterns: [
    //   {
    //     pathname: '',
    //     search: '',
    //   },
    // ],
  },
};

export default nextConfig;
