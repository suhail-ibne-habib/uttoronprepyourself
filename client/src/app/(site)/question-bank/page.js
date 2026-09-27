import QuestionBankPicker from "@/components/questions/QuestionBankPicker";

export const metadata = {
  title: "Question bank",
};

export default function QuestionBankPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Study
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Question bank</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Choose exam type, level and year. Then open the paper to study the questions,
        correct answers and explanations.
      </p>
      <div className="mt-8">
        <QuestionBankPicker />
      </div>
    </div>
  );
}
