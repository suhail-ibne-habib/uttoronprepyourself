import { fetchPublic, requestSiteUrl } from "@/lib/site";

export const revalidate = 3600;

function entry(origin, path, changeFrequency, priority) {
  return {
    url: `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap() {
  const origin = await requestSiteUrl();
  const routes = [
    entry(origin, "/", "weekly", 1),
    entry(origin, "/question-bank", "daily", 0.9),
  ];

  const bank = await fetchPublic("/question-bank");
  for (const exam of bank?.exams || []) {
    if (!exam.slug || !exam.year) continue;
    routes.push(entry(origin, `/question-bank/${exam.slug}/${exam.year}`, "weekly", 0.8));
  }

  return routes;
}
