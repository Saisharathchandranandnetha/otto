/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output uses symlinks on Windows. Keep it opt-in for deploy builds.
  output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
  // Disable Next.js telemetry
  experimental: {
    serverComponentsExternalPackages: ['postgres', 'twilio'],
  },
  async rewrites() {
    return [
      {
        source: '/api/workflows/:path*',
        destination: 'http://localhost:5678/api/v1/:path*',
      },
      {
        source: '/api/ai/:path*',
        destination: 'http://localhost:5001/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
