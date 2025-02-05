const path = require('path');
const fs = require('fs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["app.localhost:3000"],
    },
    serverComponentsExternalPackages: ['mongoose', 'pg', '@node-rs/jieba', 'duck-duck-scrape', 'isolated-vm'],
    outputFileTracingRoot: path.join(__dirname, '../../'),
    instrumentationHook: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.wordix.so',
        port: '',
        pathname: '/**',
      },
    ],
  },
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
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/sparrow-js/wordix",
        permanent: true,
      },
      {
        source: "/feedback",
        destination: "https://github.com/sparrow-js/wordix-discuss/issues",
        permanent: true,
      }
    ];
  },
  productionBrowserSourceMaps: true,
  output: 'standalone',
  webpack(config, { isServer, nextRuntime }) {
    config.module = {
      ...config.module,
      rules: config.module.rules.concat([
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack']
        },
        {
          test: /\.node$/,
          use: [{ loader: 'nextjs-node-loader' }]
        }
      ]),
      exprContextCritical: false,
      unknownContextCritical: false
    };

    if (!config.externals) {
      config.externals = [];
    }

    if (isServer) {
      if (nextRuntime === 'nodejs') {
        const oldEntry = config.entry;
        config = {
          ...config,
          async entry(...args) {
            const entries = await oldEntry(...args);
            return {
              ...entries,
              ...getWorkerConfig(),
            };
          }
        };
      }
    } else {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false
        }
      };
    }

    config.experiments = {
      asyncWebAssembly: true,
      layers: true
    };

    return config;
  }
};

module.exports = nextConfig;


function getWorkerConfig() {
  const result = fs.readdirSync(path.resolve(__dirname, './worker'));

  // 获取所有的目录名
  const folderList = result.filter((item) => {
    return fs
      .statSync(path.resolve(__dirname, './worker', item))
      .isDirectory();
  });

  /* 
    {
      'worker/htmlStr2Md': path.resolve(
                process.cwd(),
                '../../packages/service/worker/htmlStr2Md/index.ts'
              ),
              'worker/countGptMessagesTokens': path.resolve(
                process.cwd(),
                '../../packages/service/worker/countGptMessagesTokens/index.ts'
              ),
              'worker/readFile': path.resolve(
                process.cwd(),
                '../../packages/service/worker/readFile/index.ts'
              )
    }
  */
  const workerConfig = folderList.reduce((acc, item) => {
    acc[`worker/${item}`] = path.resolve(
      process.cwd(),
      `./worker/${item}/index.ts`
    );
    return acc;
  }, {});
  return workerConfig;
}

