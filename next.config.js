/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  styledComponents: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app/transaction",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["cryptoicons.org"],
  },
};

module.exports = nextConfig;
