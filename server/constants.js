export const DB_NAME = "uttoron_db";

export const CLIENT_ORIGIN =
  process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== "*"
    ? process.env.CORS_ORIGIN
    : "http://localhost:3000";
