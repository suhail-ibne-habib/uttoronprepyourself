import { fetchPublic } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { subject, topic } = await params;
  const data = await fetchPublic(`/study/${subject}/${topic}`);
  const title = data?.topic?.title || "Study lesson";
  const description =
    data?.topic?.summary ||
    (data?.subject?.name ? `${title} in ${data.subject.name}.` : "Study lesson.");

  return {
    title,
    description,
    alternates: { canonical: `/study/${subject}/${topic}` },
    openGraph: { title, description, url: `/study/${subject}/${topic}` },
  };
}

export default function StudyTopicLayout({ children }) {
  return children;
}
