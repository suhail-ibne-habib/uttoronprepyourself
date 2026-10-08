import { fetchPublic } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { subject } = await params;
  const data = await fetchPublic(`/study/${subject}`);
  const title = data?.subject?.name ? `${data.subject.name} lessons` : "Study subject";
  const description =
    data?.subject?.description || `Lessons for ${data?.subject?.name || "this subject"}.`;

  return {
    title,
    description,
    alternates: { canonical: `/study/${subject}` },
  };
}

export default function StudySubjectLayout({ children }) {
  return children;
}
