import ExamCapsules from "@/components/questions/ExamCapsules";
import { fetchPublic } from "@/lib/site";

export const metadata = {
  title: "Question bank",
  description:
    "Read the questions from a past paper. Open NTRC, BCS, bank or another exam and year to study that paper with answers and explanations.",
  alternates: { canonical: "/question-bank" },
};

export default async function QuestionBankPage() {
  const bank = await fetchPublic("/question-bank");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Question bank
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Study one exam</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Pick a paper, such as NTRC 2019. That page shows the questions from that exam,
        with the correct answers and explanations.
      </p>
      <div className="mt-8">
        <ExamCapsules exams={bank?.exams} mode="study" />
      </div>
    </div>
  );
}
