const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
        source: "/",
        destination: "/transaction",
        permanent: true,
      },
      {
        source: "/app/:path*",
        destination: "/transaction",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["cryptoicons.org"],
  },
};

module.exports = nextConfig;
