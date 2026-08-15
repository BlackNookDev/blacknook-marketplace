/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker/self-host için standalone; Vercel kendi runtime'ını kullanır
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  images: {
    // Base64 görüntüler için harici domain gerekmez
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Spline için büyük paket boyutu uyarısını bastır
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline'],
    instrumentationHook: true,
    serverComponentsExternalPackages: ['pg', 'pg-connection-string', 'pgpass', 'bcryptjs'],
  },
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        pg: false,
        'pg-native': false,
        'pg-connection-string': false,
        pgpass: false,
      };
    }
    return config;
  },
};

export default nextConfig;
