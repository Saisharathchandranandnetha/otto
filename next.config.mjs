/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['postgres', 'twilio'],
  // Output file-tracing so standalone mode works for production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Disable Next.js telemetry
  experimental: {
    serverComponentsExternalPackages: ['postgres', 'twilio'],
  },
};

export default nextConfig;
