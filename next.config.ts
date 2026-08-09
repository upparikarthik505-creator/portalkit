import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow both localhost and 127.0.0.1 in dev — otherwise Turbopack
  // 403s JS chunks and GSAP/client motion never hydrates.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
