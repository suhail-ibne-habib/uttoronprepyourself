import Link from "next/link";

function paperHref(exam, mode) {
  const base = mode === "test" ? "/test" : "/question-bank";
  return `${base}/${exam.slug}/${exam.year}`;
}

function groupsFor(exams) {
  const groups = [];
  for (const exam of exams || []) {
    const type = exam.examType || "Exam";
    const current = groups.find((group) => group.type === type);
    if (current) current.exams.push(exam);
    else groups.push({ type, exams: [exam] });
  }
  return groups;
}

export default function ExamCapsules({ exams, mode }) {
  const groups = groupsFor(exams);

  if (!groups.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No published papers yet. Publish an exam and its questions from the dashboard.
      </p>
    );
  }

  return (
    <div className="grid gap-8">
      {groups.map((group) => (
        <section key={group.type}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c47a28]">
            {String(group.type).toUpperCase()}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {group.exams.map((exam) => (
              <li key={`${exam.slug}-${exam.year}`}>
                <Link
                  href={paperHref(exam, mode)}
                  className="flex min-w-[17rem] items-center justify-between gap-4 rounded-full bg-white py-2.5 pl-5 pr-2.5 ring-1 ring-ink/10 transition hover:ring-forest"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink">{exam.name}</span>
                    {exam.totalQuestions ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {exam.totalQuestions} questions
                      </span>
                    ) : null}
                  </span>
                  <span className="flex h-12 min-w-16 shrink-0 items-center justify-center rounded-full bg-sage px-3 font-serif text-lg text-forest">
                    {exam.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
