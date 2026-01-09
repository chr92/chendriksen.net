const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
module.exports = withContentlayer({
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
})
