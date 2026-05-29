import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // prevents double-rendering every component in dev
  experimental: {
    // only import the icons/components actually used — biggest speed win
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-slot",
      "react-icons",
    ],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "www.pinterest.com" },
      { protocol: "https", hostname: "dakesh-backend.onrender.com" },
      { protocol: "https", hostname: "ujrfdfzipgxnivlyjjso.supabase.co" },
      { protocol: "https", hostname: "hxrhbfrjlhgpimrngalp.supabase.co" },
      { protocol: "http", hostname: "localhost", port: "5001", pathname: "/uploads/**" },
      { protocol: "http", hostname: "10.*" },
      { protocol: "http", hostname: "192.168.*" },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // skip full source maps in dev — much faster rebuilds
      config.devtool = "eval-cheap-source-map";
    }
    return config;
  },
};

export default nextConfig;
