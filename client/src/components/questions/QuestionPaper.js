"use client";

import { useMemo, useState } from "react";
import PaperHeader from "@/components/questions/PaperHeader";
import QuestionCard from "@/components/questions/QuestionCard";
import QuestionNavigator from "@/components/questions/QuestionNavigator";
import QuestionPager from "@/components/questions/QuestionPager";

function toggleKey(map, id) {
  return { ...map, [id]: !map[id] };
}

export default function QuestionPaper({ paper, years }) {
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [openExplanations, setOpenExplanations] = useState({});
  const [focusNumber, setFocusNumber] = useState(paper.questions[0]?.number ?? 1);

  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;

    for (const question of paper.questions) {
      const selected = answers[question.id];
      if (!selected) continue;
      if (selected === question.correctKey) correct += 1;
      else wrong += 1;
    }

    return {
      correct,
      wrong,
      answered: correct + wrong,
      total: paper.questions.length,
    };
  }, [answers, paper.questions]);

  function jumpTo(number) {
    setFocusNumber(number);
    document.getElementById(`question-${number}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function selectOption(questionId, key) {
    setAnswers((current) => {
      if (current[questionId]) return current;
      return { ...current, [questionId]: key };
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PaperHeader paper={paper} years={years} />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm">
        <p className="font-medium text-ink">
          {stats.answered} of {stats.total} answered
        </p>
        <span className="hidden h-4 w-px bg-line sm:block" />
        <p className="text-correct">{stats.correct} correct</p>
        <p className="text-wrong">{stats.wrong} incorrect</p>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() =>
              setOpenExplanations(
                Object.fromEntries(paper.questions.map((q) => [q.id, true])),
              )
            }
            className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-forest/40"
          >
            Open all explanations
          </button>
          <button
            type="button"
            onClick={() => setOpenExplanations({})}
            className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-forest/40"
          >
            Hide all
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16.5rem]">
        <div className="space-y-5">
          {paper.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedKey={answers[question.id]}
              flagged={Boolean(flags[question.id])}
              explanationOpen={Boolean(openExplanations[question.id])}
              onSelect={(key) => selectOption(question.id, key)}
              onToggleFlag={() => setFlags((current) => toggleKey(current, question.id))}
              onToggleExplanation={() =>
                setOpenExplanations((current) => toggleKey(current, question.id))
              }
            />
          ))}

          <QuestionPager
            currentNumber={focusNumber}
            total={paper.questions.length}
            onPrev={() => jumpTo(Math.max(1, focusNumber - 1))}
            onNext={() => jumpTo(Math.min(paper.questions.length, focusNumber + 1))}
          />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <QuestionNavigator
            questions={paper.questions}
            answers={answers}
            flags={flags}
            onJump={jumpTo}
          />
        </div>
      </div>
    </div>
  );
}
