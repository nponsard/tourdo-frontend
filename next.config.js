/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    if (process.env.NODE_ENV === 'production')
      return [
        {
          source: '/api/:path*',
          destination: 'https://backend.juno.nponsard.net/api/path*'
        }
      ];
    else
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*'
        }
      ];
  }

};
