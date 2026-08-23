import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 支持 Vercel 静态部署
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
