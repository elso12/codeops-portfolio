/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.mesobhouse.et",
      },
      {
        protocol: "https",
        hostname: "cdn.addiseats.et",
      },
    ],
  },
};

export default nextConfig;

