/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains deprecated hai, isliye ise remove kar diya
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Saari images allow karne ke liye
      },
    ],
  },
  // experimental.serverActions: true ab Next.js 14+ mein default hai
  // Isliye ise delete kar diya taaki validation warning khatam ho jaye
}

module.exports = nextConfig