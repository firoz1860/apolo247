/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  images: {
    domains: ['images.pexels.com','randomuser.me','dr-sana.png','dr-rahul.png'], 
  },
};

module.exports = nextConfig;
