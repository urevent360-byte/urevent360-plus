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
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignorar Handlebars (usado por Genkit) del bundle del cliente
    if (!isServer) {
      config.externals.push({
        handlebars: 'handlebars',
      });
    }

    // Silenciar warnings de require.extensions
    config.ignoreWarnings = [
      { message: /require\.extensions is not supported by webpack/ },
    ];

    return config;
  },
};

export default nextConfig;
