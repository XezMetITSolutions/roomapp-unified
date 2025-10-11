const path = require('path');

module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  images: {
    unoptimized: true,
    domains: ['api.roomapp.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif']
  },
  experimental: {
    optimizeCss: false
  },
  output: 'export',
  trailingSlash: true
}
