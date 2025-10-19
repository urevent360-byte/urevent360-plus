/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  env: {
    NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG: process.env.FIREBASE_WEBAPP_CONFIG,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https://picsum.photos', port: '', pathname: '/**' },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Allow clipboard read/write for same-origin
          { key: 'Permissions-Policy', value: 'clipboard-read=(self), clipboard-write=(self)' },
        ],
      },
    ];
  },
};

export default nextConfig;
