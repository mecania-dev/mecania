/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fixfrinthdubutdbfjbm.supabase.co'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
}

export default nextConfig
