import { fetchPublic } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { slug, year } = await params;
  const paper = await fetchPublic(`/exams/${slug}/${year}`);
  const title = paper ? `${paper.exam} ${paper.year} question paper` : "Question paper";
  const description = paper
    ? `${paper.exam} ${paper.year}: ${paper.totalQuestions || "past"} questions with answers and explanations.`
    : "Past paper for an NTRC, BCS, bank or other job exam, with answers and explanations.";

  return {
    title,
    description,
    alternates: { canonical: `/question-bank/${slug}/${year}` },
    openGraph: { title, description, url: `/question-bank/${slug}/${year}` },
  };
}

export default function QuestionPaperLayout({ children }) {
  return children;
}
