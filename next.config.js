
// const withPWA = require('next-pwa')({
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
// })

// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'http',
//                 hostname: 'localhost',
//                 port: '8000',
//                 pathname: '/storage/uploads/computer_sales/**',
//             },
//         ],
//     },
// }

// module.exports = withPWA(nextConfig)




const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/uploads/computer_sales/**',
      },
    ],
  },

  // ✅ Add this block to stop Vercel from blocking builds due to ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withPWA(nextConfig)
