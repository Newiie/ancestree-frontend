/* @type {import('next').NextConfig} */
const nextConfig = {
  // Add rewrites for proxying API requests
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  images: {
    domains: ['ancestree-images.s3.ap-southeast-2.amazonaws.com'],
  },
};

export default nextConfig;