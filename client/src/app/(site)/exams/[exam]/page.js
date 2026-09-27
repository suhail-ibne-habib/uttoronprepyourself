import Link from "next/link";
import { notFound } from "next/navigation";
import {
  generateExamParams,
  getExam,
  listYearsForExam,
  paperHref,
} from "@/lib/papers";

export function generateStaticParams() {
  return generateExamParams();
}

export async function generateMetadata({ params }) {
  const { exam: examSlug } = await params;
  const exam = getExam(examSlug);
  if (!exam) return { title: "Exam not found" };
  return { title: exam.name };
}

export default async function ExamPage({ params }) {
  const { exam: examSlug } = await params;
  const exam = getExam(examSlug);
  if (!exam) notFound();

  const years = listYearsForExam(exam.slug);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-forest">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{exam.name}</span>
      </nav>

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        {exam.board}
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">{exam.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{exam.description}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {years.map((year) => (
          <li key={year}>
            <Link
              href={paperHref(exam.slug, year)}
              className="flex items-center justify-between rounded-2xl border border-line bg-paper px-5 py-4 transition hover:border-forest"
            >
              <span>
                <span className="block font-serif text-2xl text-ink">{year}</span>
                <span className="text-sm text-muted-foreground">Open questions</span>
              </span>
              <span className="text-forest">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
