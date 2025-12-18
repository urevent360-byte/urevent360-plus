/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dominios desde donde puedo cargar imágenes remotas
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignore warnings from genkit dependencies which are not critical for the build
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
      /require\.extensions is not supported by webpack/,
    ];
    return config;
  },
};

// 👇 ***IMPORTANTE***: usar CommonJS, NO "export default"
module.exports = nextConfig;
