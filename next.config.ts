/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Point to backend on port 3000
      },
    ];
  },
  // Enable styled-components
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
