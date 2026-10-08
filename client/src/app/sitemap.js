import { fetchPublic, siteUrl } from "@/lib/site";

export const revalidate = 3600;

function entry(path, changeFrequency, priority) {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap() {
  const routes = [
    entry("/", "weekly", 1),
    entry("/question-bank", "daily", 0.9),
  ];

  const bank = await fetchPublic("/question-bank");
  for (const exam of bank?.exams || []) {
    if (!exam.slug || !exam.year) continue;
    routes.push(entry(`/question-bank/${exam.slug}/${exam.year}`, "weekly", 0.8));
  }

  return routes;
}
