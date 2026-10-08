export const DB_NAME = "uttoron_db";

function cleanOrigin(value) {
  return String(value || "").trim().replace(/\/$/, "");
}

function withWwwPair(origin) {
  if (!origin || origin === "*") return [];
  const origins = [origin];
  try {
    const url = new URL(origin);
    const host = url.hostname;
    if (host === "localhost" || host.endsWith(".localhost")) return origins;
    url.hostname = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
    origins.push(url.origin);
  } catch {
    // Keep a non-URL value as it was written.
  }
  return origins;
}

const allowedOrigins = [
  "https://www.uttoronprepyourself.shop",
  "https://uttoronprepyourself.shop",
  "http://localhost:3000",
];

export const ALLOWED_ORIGINS = [
  ...new Set([
    ...allowedOrigins,
    ...(process.env.CORS_ORIGIN || "")
      .split(",")
      .flatMap((item) => withWwwPair(cleanOrigin(item)))
      .filter((item) => item && item !== "*"),
  ]),
];

export const CLIENT_ORIGIN = ALLOWED_ORIGINS[0] || "http://localhost:3000";
