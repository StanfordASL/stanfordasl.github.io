/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/aa174a/:path*',
        destination: 'https://stanfordasl.github.io/PoRA-I/aa174a_aut2324/',
        permanent: false,
      },
      {
        source: '/aa274a/:path*',
        destination: 'https://stanfordasl.github.io/PoRA-I/aa274a_aut2526/',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
