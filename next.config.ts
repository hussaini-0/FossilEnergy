import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
  devIndicators: false,
  experimental: { cpus: 1 },
};
export default config;
