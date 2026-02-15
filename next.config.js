/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed output: 'export' to enable API routes for AI advisor
  // For static-only deploy, add back: output: 'export'
  // For Cloudflare Pages: use @cloudflare/next-on-pages
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
