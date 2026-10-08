import Link from "next/link";
import QuestionPaperList from "@/components/questions/QuestionPaperList";
import { fetchPublic } from "@/lib/site";

export default async function QuestionBankPaperPage({ params }) {
  const { slug, year } = await params;
  const paper = await fetchPublic(`/exams/${slug}/${year}`);

  if (!paper) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-sm text-muted-foreground">This paper is not available yet.</p>
        <Link href="/question-bank" className="mt-4 inline-block text-sm text-forest underline">
          Back to question bank
        </Link>
      </div>
    );
  }

  const heading = `${paper.exam} ${paper.year} questions`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/question-bank" className="text-sm text-muted-foreground hover:text-forest">
        ← Question bank
      </Link>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Question paper
      </p>
      <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">{heading}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {paper.exam} {paper.year}
        {paper.examType ? ` · ${String(paper.examType).toUpperCase()}` : ""}
        {paper.level ? ` · ${paper.level}` : ""} · {paper.questions.length} questions, with
        answers and explanations.
      </p>

      <QuestionPaperList questions={paper.questions} />
    </div>
  );
}
