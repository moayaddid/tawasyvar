/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");  
  const nextConfig = {
  // useFileSystemPublicRoutes: false,
  // output : 'export',
  reactStrictMode: true,
  // unoptimized : true ,
  images: {
    formats: ['image/webp', 'image/avif' ],
    unoptimized : true ,
    dangerouslyAllowSVG: true,  
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // placeholder: "blur",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'absi.tawasyme.com',
        port: '',
        // pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'absi.damaszone.com',
        port: '',
        // pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.201',
        port: '8000',
        // pathname: '/storage/**',
      },
    ],
    
  },
  i18n ,
};

const removeImports = require("next-remove-imports")({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: "\\.(less|css|scss|sass|styl)$",
});

module.exports = nextConfig;
