// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "www.pinterest.com",
      },
      {
        protocol: "https",
        hostname: "dakesh-backend.onrender.com",
      },
      {
        protocol: "https",
        hostname: "ujrfdfzipgxnivlyjjso.supabase.co",
      },
      {
        protocol: "https",
        hostname: "hxrhbfrjlhgpimrngalp.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
