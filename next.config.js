/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn-icons-png.flaticon.com',
      "utfs.io",
      'www.pulsecarshalton.co.uk'
    ],
    // UploadThing v7 serves files from <appId>.ufs.sh
    remotePatterns: [
      { protocol: 'https', hostname: '*.ufs.sh' },
    ],
  }
}

module.exports = nextConfig
