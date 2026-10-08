function resolveApiOrigin() {
  const raw = (process.env.API_URL || "http://localhost:8080").trim().replace(/\/$/, "");
  if (/^http:\/\/[^/]+\.vercel\.app$/i.test(raw)) {
    return `https://${raw.slice("http://".length)}`;
  }
  return raw;
}

const apiOrigin = resolveApiOrigin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: apiOrigin,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
