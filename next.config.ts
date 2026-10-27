import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const onVercel = Boolean(process.env.VERCEL); // HTTPS-only rules apply only when deployed

// Content Security Policy: the browser may only load scripts, styles, images, fonts from our own site.
// If an attacker injects a <script src="evil.com">, the browser refuses to load it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, // inline needed for static pages (no nonces)
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

// Security headers sent with every page.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  ...(onVercel
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] // always HTTPS
    : []),
  { key: "X-Frame-Options", value: "DENY" }, // other sites can't embed us in an iframe (clickjacking)
  { key: "X-Content-Type-Options", value: "nosniff" }, // browser trusts our declared file types
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, // don't leak full URLs to other sites
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }, // we never need these
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false, // don't advertise what we run on
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
