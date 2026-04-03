/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'www.unizoy.com', pathname: '/**' }],
  },
};

export default nextConfig;
