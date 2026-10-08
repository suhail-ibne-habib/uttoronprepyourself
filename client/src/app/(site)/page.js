import QuestionBankPicker from "@/components/questions/QuestionBankPicker";

const points = [
  {
    title: "Sit the paper",
    text: "Pick a published paper. The answers stay hidden for the full hour.",
  },
  {
    title: "See the mark",
    text: "The clock and the score stay on screen. A correct answer is +1. A mistake is −0.25.",
  },
  {
    title: "Read why",
    text: "After you submit, each miss opens the explanation and the lesson for that topic.",
  },
];

export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-paper px-6 py-10 sm:px-12 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[#c47a28]">Bangladesh govt job prep</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl">
              Practise the paper, then learn what you missed.
            </h1>
          </div>
          <div className="shrink-0">
            <div className="flex items-start gap-10 sm:gap-14">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Time</p>
                <p className="mt-2 font-serif text-5xl leading-none text-forest sm:text-6xl">60:00</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mark</p>
                <p className="mt-2 font-serif text-5xl leading-none text-ink sm:text-6xl">+1</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink/60">One hour. −0.25 for each mistake.</p>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/10 pt-8">
          <QuestionBankPicker inline />
        </div>

        <dl className="mt-16 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.title}>
              <dt className="font-serif text-2xl text-ink">{point.title}</dt>
              <dd className="mt-2 max-w-xs text-sm leading-6 text-ink/60">{point.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
