import { requestSiteUrl } from "@/lib/site";

export default async function robots() {
  const origin = await requestSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/register", "/profile", "/test/", "/study"],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
