/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },

  experimental: {
    // Required to ignore the 'workspace' directory which causes build slowdowns.
    exclude: ['**/workspace/**'],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['genkit'] = false;
      config.resolve.alias['@genkit-ai/core'] = false;
      config.resolve.alias['dotprompt'] = false;
      config.resolve.alias['handlebars'] = false;
    }
    return config;
  },
};

module.exports = nextConfig;
