import { exams, papers } from "@/data/papers";

export function getExam(slug) {
  return exams.find((exam) => exam.slug === slug) ?? null;
}

export function getPaper(examSlug, year) {
  return papers[`${examSlug}:${Number(year)}`] ?? null;
}

export function listYearsForExam(examSlug) {
  return getExam(examSlug)?.years ?? [];
}

export function paperHref(examSlug, year) {
  return `/exams/${examSlug}/${year}`;
}

export function generatePaperParams() {
  return exams.flatMap((exam) =>
    exam.years.map((year) => ({
      exam: exam.slug,
      year: String(year),
    })),
  );
}

export function generateExamParams() {
  return exams.map((exam) => ({ exam: exam.slug }));
}
