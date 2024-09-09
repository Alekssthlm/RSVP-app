/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rnfzhxviiuawltrvpkqv.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
