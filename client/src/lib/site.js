import { headers } from "next/headers";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.uttoronprepyourself.shop"
).replace(/\/$/, "");

/** Host that actually served this request, so sitemap URLs match the sitemap location. */
export async function requestSiteUrl() {
  try {
    const headerList = await headers();
    const rawHost = headerList.get("x-forwarded-host") || headerList.get("host");
    const host = rawHost?.split(",")[0].trim();
    if (!host) return siteUrl;
    const forwardedProto = headerList.get("x-forwarded-proto")?.split(",")[0].trim();
    const proto =
      forwardedProto ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`;
  } catch {
    return siteUrl;
  }
}

export const siteName = "Uttoron";

export const siteTitle = "Uttoron — NTRC, BCS and bank job prep";

export const siteDescription =
  "Practise past papers for NTRC, BCS, bank and other Bangladesh job exams. One hour on the clock, +1 for a correct answer, −0.25 for a mistake, then read the explanation for every question you missed.";

export const siteKeywords = [
  "NTRC",
  "NTRCA",
  "BCS",
  "bank job",
  "Bangladesh job preparation",
  "question bank",
  "past papers",
  "Uttoron",
];

function apiOrigin() {
  const raw = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080")
    .trim()
    .replace(/\/$/, "");
  if (/^http:\/\/[^/]+\.vercel\.app$/i.test(raw)) {
    return `https://${raw.slice("http://".length)}`;
  }
  return raw;
}

export async function fetchPublic(path) {
  try {
    const response = await fetch(`${apiOrigin()}/api${path}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const body = await response.json();
    return body.data ?? null;
  } catch {
    return null;
  }
}
