import QuestionBankPicker from "@/components/questions/QuestionBankPicker";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          Bangladesh govt job prep
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.15] text-ink sm:text-5xl">
          Study past questions with the correct answer and explanation.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Filter the question bank from the papers published in the database.
        </p>
      </section>
      <section className="mt-10">
        <QuestionBankPicker />
      </section>
    </div>
  );
}
