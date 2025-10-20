import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Optimize server bundle size for Vercel
    outputFileTracingExcludes: {
      '*': [
        // Exclude SWC/esbuild binaries for other platforms
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@swc/core-darwin-x64',
        'node_modules/@swc/core-darwin-arm64',
        'node_modules/@esbuild/**',
        'node_modules/@next/swc-*/**',
        // Exclude testing libraries
        'node_modules/@testing-library/**',
        'node_modules/vitest/**',
        'node_modules/@vitejs/**',
        'node_modules/jsdom/**',
        // Exclude build-time only dependencies
        'node_modules/prettier/**',
        'node_modules/eslint/**',
        'node_modules/typescript/**',
        'node_modules/autoprefixer/**',
        'node_modules/tailwindcss/**',
        'node_modules/postcss/**',
      ],
    },
  },
}

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig) 