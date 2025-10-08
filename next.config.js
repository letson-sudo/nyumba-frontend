// module.exports = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '8000',
//         pathname: '/storage/uploads/computer_sales/**',
//       },
//     ],
//   },
// };

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
})

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
}

module.exports = withPWA(nextConfig)

