/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Base64 görüntüler için harici domain gerekmez
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Spline için büyük paket boyutu uyarısını bastır
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline'],
  },
};

export default nextConfig;
