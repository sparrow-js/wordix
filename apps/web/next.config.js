const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/docTest',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/event-stream;charset=utf-8',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          // {
          //   key: 'X-Accel-Buffering',
          //   value: 'no',
          // },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-transform',
          },
        ],
      },
    ]
  },
  reactStrictMode: false,
  experimental: {
    // 优化 Server Components 的构建和运行，避免不必要的客户端打包。
    serverComponentsExternalPackages: ['mongoose', 'pg', '@node-rs/jieba', 'duck-duck-scrape', 'isolated-vm'],
    // outputFileTracingRoot: path.join(__dirname, '../../')
  },
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/sparrow-js/wordix",
        permanent: true,
      },
      {
        source: "/feedback",
        destination: "https://github.com/sparrow-js/wordix/issues",
        permanent: true,
      }
    ];
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
