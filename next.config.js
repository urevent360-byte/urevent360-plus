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
};

// 👇 ***IMPORTANTE***: usar CommonJS, NO "export default"
module.exports = nextConfig;
