import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // static HTML/CSS/JS — no Node server needed
  images: {
    unoptimized: true, // next/image optimization requires a server; disable for static export
  },
};

export default nextConfig;
