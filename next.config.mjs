/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.mypinata.cloud",
        port: "",
        pathname: "/ipfs/**",
        // search: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "x-gateway-key",
            value:
              "M2zXtLB4jfRXJHk8uSpN5AIIk72gxoXd3GVxDu90glkdE0ALlF-oox9udl2IJ4s6",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
