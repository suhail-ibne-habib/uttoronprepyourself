"use client";

import { useState } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, FlagIcon, XIcon } from "@/components/icons";
import BlankStem from "@/components/questions/BlankStem";
import Explanation from "@/components/questions/Explanation";
import OptionList from "@/components/questions/OptionList";

function resultBadge(selectedKey, correctKey) {
  if (!selectedKey) return null;
  const correct = selectedKey === correctKey;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        correct ? "bg-correct-bg text-correct" : "bg-wrong-bg text-wrong"
      }`}
    >
      {correct ? <CheckIcon className="size-3.5" /> : <XIcon className="size-3.5" />}
      {correct ? "Correct" : "Incorrect"}
    </span>
  );
}

function blankTone(selectedKey, correctKey) {
  if (!selectedKey) return "idle";
  return selectedKey === correctKey ? "correct" : "wrong";
}

export default function QuestionCard({
  question,
  selectedKey,
  flagged,
  explanationOpen,
  onSelect,
  onToggleFlag,
  onToggleExplanation,
  mode = "practice",
}) {
  const isStudy = mode === "study";
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);
  const visibleKey = isStudy ? (showAnswer ? question.correctKey : null) : selectedKey;
  const selectedOption = (question.options || []).find((option) => option.key === visibleKey);
  const correctOption = (question.options || []).find(
    (option) => option.key === question.correctKey,
  );
  const reveal = mode !== "exam";
  const answered = Boolean(visibleKey);
  const isCorrect = visibleKey === question.correctKey;
  const optionLocked = isStudy || mode === "review" || (mode === "practice" && Boolean(selectedKey));
  const optionsReveal = isStudy
    ? showAnswer
    : reveal && (mode === "review" || Boolean(selectedKey));
  const explanationIsOpen = isStudy ? studyOpen : explanationOpen;

  return (
    <article
      id={`question-${question.number}`}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-paper p-5 shadow-[0_1px_0_rgba(28,25,23,0.04)] sm:p-6"
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-ink">
            Question {question.number}
          </h2>
          {reveal && !isStudy ? resultBadge(selectedKey, question.correctKey) : null}
          <span className="text-xs text-muted-foreground">Marks {question.marks} out of {question.marks}</span>
        </div>
        {isStudy ? (
          <button
            type="button"
            onClick={() => setShowAnswer((value) => !value)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              showAnswer
                ? "border-forest bg-forest-soft text-forest"
                : "border-line text-muted-foreground hover:border-forest/40 hover:text-forest"
            }`}
            aria-pressed={showAnswer}
          >
            {showAnswer ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
            {showAnswer ? "Hide answer" : "Show answer"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleFlag}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              flagged
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-muted-foreground hover:border-forest/40 hover:text-forest"
            }`}
          >
            <FlagIcon className="size-3.5" solid={flagged} />
            {flagged ? "Flagged" : "Flag"}
          </button>
        )}
      </header>

      {question.passage ? (
        <div className="mb-4 rounded-xl border border-line bg-muted/40 p-4 text-sm leading-7 text-ink">
          {question.passage}
        </div>
      ) : null}

      {question.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.image}
          alt=""
          className="mb-4 max-h-64 w-full rounded-xl border border-line object-contain"
        />
      ) : null}

      <BlankStem
        text={question.stem}
        filled={selectedOption?.text}
        tone={
          !answered
            ? "idle"
            : !reveal
              ? "picked"
              : blankTone(visibleKey, question.correctKey)
        }
      />

      <OptionList
        options={question.options}
        selectedKey={visibleKey}
        correctKey={question.correctKey}
        onSelect={onSelect}
        locked={optionLocked}
        reveal={optionsReveal}
      />

      {reveal && answered && !isStudy ? (
        <p
          className={`mt-4 text-sm font-medium ${
            isCorrect ? "text-correct" : "text-wrong"
          }`}
        >
          {isCorrect
            ? `Your answer is correct: ${correctOption?.key}. ${correctOption?.text}`
            : `Your answer is incorrect. The correct answer is ${correctOption?.key}. ${correctOption?.text}`}
        </p>
      ) : null}

      {mode !== "exam" ? (
        <Explanation
          explanation={question.explanation}
          open={explanationIsOpen}
          onToggle={isStudy ? () => setStudyOpen((value) => !value) : onToggleExplanation}
          panelId={`explanation-${question.id}`}
        />
      ) : null}

      {question.source?.name ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Source: {question.source.name}
          {question.source.page ? ` · p. ${question.source.page}` : ""}
          {question.source.questionNo ? ` · Q${question.source.questionNo}` : ""}
        </p>
      ) : null}
    </article>
  );
}
