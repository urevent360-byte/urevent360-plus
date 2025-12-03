/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desactiva ESLint en los builds de producción
    ignoreDuringBuilds: true,
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

export default nextConfig;
