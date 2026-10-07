const apiOrigin = (process.env.API_URL || "http://localhost:8080").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: apiOrigin,
  },
};

export default nextConfig;
