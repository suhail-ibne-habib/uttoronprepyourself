"use client";

export default function QuestionNavigator({
  questions,
  answers,
  flags,
  onJump,
  reveal = true,
}) {
  return (
    <aside className="rounded-2xl border border-line bg-paper p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Question map
      </p>
      <ol className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-4">
        {questions.map((question) => {
          const selected = answers[question.id];
          const flagged = flags[question.id];
          let tone = "border-line bg-background text-muted-foreground hover:border-forest/40";

          if (selected && reveal && selected === question.correctKey) {
            tone = "border-correct bg-correct-bg text-correct";
          } else if (selected && reveal) {
            tone = "border-wrong bg-wrong-bg text-wrong";
          } else if (selected) {
            tone = "border-forest bg-forest-soft text-forest";
          } else if (flagged) {
            tone = "border-gold bg-gold/10 text-gold";
          }

          return (
            <li key={question.id}>
              <button
                type="button"
                onClick={() => onJump(question.number)}
                className={`flex h-9 w-full items-center justify-center rounded-lg border text-sm font-semibold transition ${tone}`}
                aria-label={`Go to question ${question.number}`}
              >
                {question.number}
              </button>
            </li>
          );
        })}
      </ol>
      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-forest" /> Answered
        </li>
        {reveal ? (
          <>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-correct" /> Correct
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-wrong" /> Incorrect
            </li>
          </>
        ) : null}
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-gold" /> Flagged
        </li>
      </ul>
    </aside>
  );
}
