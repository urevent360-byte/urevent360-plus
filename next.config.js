/** @type {import('next').NextConfig} */
const nextConfig = {
  // 💡 Ignorar errores de ESLint en los builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 💡 Ignorar errores de TypeScript en los builds
  typescript: {
    ignoreBuildErrors: true,
  },

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

  // Aliases para evitar que Next intente bundlear librerías pesadas/no usadas en el cliente
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

// 👇 ***IMPORTANTE***: usar CommonJS, NO "export default"
module.exports = nextConfig;
