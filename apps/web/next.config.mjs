/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output uses symlinks on Windows. Keep it opt-in for deploy builds.
  output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
  // Disable Next.js telemetry
  serverExternalPackages: ['postgres', 'twilio'],
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
      {
        source: '/otto-workflows/:path*',
        destination: 'http://localhost:5678/:path*',
      },
      {
        source: '/assets/:path*',
        destination: 'http://localhost:5678/assets/:path*',
      },
      {
        source: '/rest/:path*',
        destination: 'http://localhost:5678/rest/:path*',
      },
      {
        source: '/webhook/:path*',
        destination: 'http://localhost:5678/webhook/:path*',
      },
      {
        source: '/healthz',
        destination: 'http://localhost:5678/healthz',
      },
      {
        source: '/otto-ai-studio/:path*',
        destination: 'http://localhost:5001/:path*',
      },
    ];
  },
};

export default nextConfig;
