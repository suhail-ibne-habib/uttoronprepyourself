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

function lessonPaths(lessons) {
  return (lessons || [])
    .map((lesson) => lesson.href)
    .filter((href) => typeof href === "string" && href.startsWith("/study/"));
}

export default async function sitemap() {
  const routes = [
    entry("/", "weekly", 1),
    entry("/question-bank", "daily", 0.9),
    entry("/study", "weekly", 0.7),
  ];

  const bank = await fetchPublic("/question-bank");
  for (const exam of bank?.exams || []) {
    if (!exam.slug || !exam.year) continue;
    routes.push(entry(`/question-bank/${exam.slug}/${exam.year}`, "weekly", 0.8));
  }

  const subjects = await fetchPublic("/study");
  for (const subject of subjects || []) {
    if (!subject.slug) continue;
    routes.push(entry(`/study/${subject.slug}`, "weekly", 0.6));
    const detail = await fetchPublic(`/study/${subject.slug}`);
    for (const href of lessonPaths(detail?.lessons)) {
      routes.push(entry(href, "monthly", 0.5));
    }
  }

  return routes;
}
