import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Only use standalone in production builds
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),
  transpilePackages: ['motion'],
  // Turbopack configuration (replaces webpack config for dev)
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      // Tree-shake Three.js to only bundle used modules
      'three': 'three/src/Three.js',
    },
  },
  // Webpack config only used for production builds
  webpack: (config, {dev, isServer}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': 'three/src/Three.js',
      };
    }

    return config;
  },
};

export default nextConfig;
