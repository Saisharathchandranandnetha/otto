/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output uses symlinks on Windows. Keep it opt-in for deploy builds.
  output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
  // Disable Next.js telemetry
  experimental: {
    serverComponentsExternalPackages: ['postgres', 'twilio'],
  },
};

export default nextConfig;
