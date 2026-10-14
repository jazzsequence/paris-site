import { createRequire } from "node:module";

import type { NextConfig } from "next";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // Required for Pantheon deployment

  // Only on Pantheon in production: locally there is no bucket to talk to.
  ...(process.env.NODE_ENV === "production" &&
    process.env.PANTHEON_ENVIRONMENT && {
      cacheHandler: "./cacheHandler.mjs",
      cacheMaxMemorySize: 0, // Let the handler own caching
    }),

  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  transpilePackages: [
    "@pantheon-systems/css-client",
    "@pantheon-systems/puck-css",
    "@pantheon-systems/p1-next-sdk",
  ],
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Single yjs instance — duplicate copies break the P1 editor
      yjs: require.resolve("yjs"),
    };
    return config;
  },
};

export default nextConfig;
