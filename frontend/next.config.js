/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'chiliz.com',
      'testnet.chiliscan.com',
      'chiliscan.com',
      'via.placeholder.com',
    ],
  },
  env: {
    NEXT_PUBLIC_CHILIZ_TESTNET_RPC: process.env.NEXT_PUBLIC_CHILIZ_TESTNET_RPC,
    NEXT_PUBLIC_CHILIZ_MAINNET_RPC: process.env.NEXT_PUBLIC_CHILIZ_MAINNET_RPC,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig; 