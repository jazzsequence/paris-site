import { createRequire } from "node:module";

import type { NextConfig } from "next";

const require = createRequire(import.meta.url);

const origin = (url: string | undefined, fallback: string) => {
  try {
    return new URL(url || fallback).origin;
  } catch {
    return fallback;
  }
};

/**
 * Security headers (https://specification.website security checklist).
 *
 * Everything except /p1 gets the strict set. The P1 editor is deliberately excluded: it embeds a
 * same-origin canvas, talks to P1 services and loads user media, and a policy written for the public
 * pages would break it. `'unsafe-inline'` for scripts is required by Next's inline bootstrap; moving to
 * nonces means threading a nonce through the P1 middleware, which is not worth it for a site with no
 * user-supplied content or accounts. The CSP is production-only because the dev server needs eval.
 */
const audioOrigin = origin(process.env.NEXT_PUBLIC_AUDIO_BASE_URL, "https://music.paris.jazzsequence.com");
const p1Origin = origin(process.env.NEXT_PUBLIC_CSS_BASE_URL, "https://ccr.p1.pantheon.io");

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  `media-src 'self' ${audioOrigin} blob:`,
  `connect-src 'self' ${p1Origin}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const baseHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
];

const publicHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // legacy fallback for frame-ancestors
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A new value for every build; design-system/asset.ts appends it to local image URLs.
  env: { NEXT_PUBLIC_ASSET_VERSION: process.env.NEXT_PUBLIC_ASSET_VERSION ?? Date.now().toString(36) },
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
  async headers() {
    return [
      { source: "/:path*", headers: baseHeaders },
      { source: "/((?!p1(?:/|$)).*)", headers: publicHeaders },
    ];
  },
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
