import { notFound } from "next/navigation";
import QuestionPaper from "@/components/questions/QuestionPaper";
import {
  generatePaperParams,
  getPaper,
  listYearsForExam,
} from "@/lib/papers";

export function generateStaticParams() {
  return generatePaperParams();
}

export async function generateMetadata({ params }) {
  const { exam, year } = await params;
  const paper = getPaper(exam, year);
  if (!paper) return { title: "Paper not found" };
  return {
    title: `${paper.exam} ${paper.year}`,
    description: `Practice ${paper.questions.length} ${paper.subject} questions from ${paper.exam} ${paper.year}, with selectable options and toggleable explanations.`,
  };
}

export default async function ExamYearPage({ params }) {
  const { exam, year } = await params;
  const paper = getPaper(exam, year);
  if (!paper) notFound();

  return <QuestionPaper paper={paper} years={listYearsForExam(exam)} />;
}
