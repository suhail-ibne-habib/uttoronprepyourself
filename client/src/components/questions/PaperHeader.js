import Link from "next/link";
import { paperHref } from "@/lib/papers";

export default function PaperHeader({ paper, years }) {
  return (
    <header className="mb-8">
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-forest">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/exams/${paper.examSlug}`} className="hover:text-forest">
          {paper.exam}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{paper.year}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Official past paper
          </p>
          <h1 className="mt-1 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            {paper.exam}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {paper.subject} · {paper.questions.length} questions · {paper.totalMarks} marks
          </p>
        </div>

        {years.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {years.map((year) => {
              const active = year === paper.year;
              return (
                <Link
                  key={year}
                  href={paperHref(paper.examSlug, year)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "border-forest bg-forest text-white"
                      : "border-line bg-paper text-ink hover:border-forest/40"
                  }`}
                >
                  {year}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </header>
  );
}
