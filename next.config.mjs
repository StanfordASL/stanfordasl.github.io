/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Old lab site (and Google's index) use trailing-slash URLs, e.g.
  // /people/prof-marco-pavone/ — export dir/index.html so those resolve.
  trailingSlash: true,
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
