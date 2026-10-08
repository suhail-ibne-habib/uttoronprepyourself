"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import QuestionCard from "@/components/questions/QuestionCard";

const TEST_SECONDS = 60 * 60;

function formatClock(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatMark(value) {
  const rounded = Math.round(Number(value) * 100) / 100;
  return String(rounded);
}

export default function TestSession({ slug, year }) {
  const [paper, setPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [openExplanation, setOpenExplanation] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(TEST_SECONDS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  useEffect(() => {
    api
      .get(`/exams/${slug}/${year}`, { params: { for: "test" } })
      .then(({ data }) => setPaper(data.data))
      .catch((err) => setError(err.message));
  }, [slug, year]);

  useEffect(() => {
    if (!paper || result) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paper, result]);

  async function submit() {
    if (!paper || result || submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/exams/${slug}/${year}/submit`, { answers });
      setResult(data.data);
    } catch (err) {
      submitLock.current = false;
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (paper && !result && secondsLeft === 0) submit();
  }, [secondsLeft, paper, result]);

  useEffect(() => {
    if (!result) return;
    window.scrollTo(0, 0);
  }, [result]);

  if (error && !paper) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-sm text-wrong">{error}</p>
        <Link href="/#start" className="mt-4 inline-block text-sm text-forest underline">
          Back to papers
        </Link>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-sm text-muted-foreground">
        Loading the paper...
      </div>
    );
  }

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const lowTime = !result && secondsLeft <= 5 * 60;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/#start" className="text-sm text-muted-foreground hover:text-forest">
        ← Choose another paper
      </Link>
      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          {result ? "Result" : "Timed test"}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">
          {paper.exam} {paper.year}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {paper.questions.length} questions · +1 correct · −0.25 each mistake
        </p>
      </div>

      <div className="sticky top-16 z-10 -mx-4 mt-6 flex items-end justify-between gap-6 bg-sage/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Time</p>
          <p className={`font-serif text-5xl leading-none ${lowTime ? "text-wrong" : "text-forest"}`}>
            {formatClock(secondsLeft)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Mark</p>
          <p className="font-serif text-5xl leading-none text-ink">
            {result ? formatMark(result.scored) : "0"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {result ? `out of ${result.maxMarks}` : "−0.25 each mistake"}
          </p>
        </div>
      </div>

      {result ? (
        <section className="mt-6">
          <p className="text-sm text-muted-foreground">
            {result.correct} correct · {result.wrong} wrong · {result.skipped} skipped
          </p>
          <h2 className="mt-8 font-serif text-2xl text-ink">Questions to review</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These are the ones you missed or left blank. Open an explanation to see why the keyed answer is correct.
          </p>
          <div className="mt-5 space-y-5">
            {result.missed.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selectedKey={question.selectedKey}
                flagged={false}
                explanationOpen={Boolean(openExplanation[question.id])}
                mode="review"
                onSelect={() => {}}
                onToggleFlag={() => {}}
                onToggleExplanation={() =>
                  setOpenExplanation((current) => ({
                    ...current,
                    [question.id]: !current[question.id],
                  }))
                }
              />
            ))}
            {!result.missed.length ? (
              <p className="rounded-2xl border border-line bg-correct-bg px-4 py-3 text-sm text-correct">
                Every question was correct.
              </p>
            ) : null}
          </div>
        </section>
      ) : (
        <>
          {error ? <p className="mt-4 text-sm text-wrong">{error}</p> : null}
          <div className="mt-5 space-y-5">
            {paper.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selectedKey={answers[question.id] || null}
                flagged={Boolean(flagged[question.id])}
                explanationOpen={false}
                mode="exam"
                onSelect={(key) =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: current[question.id] === key ? null : key,
                  }))
                }
                onToggleFlag={() =>
                  setFlagged((current) => ({
                    ...current,
                    [question.id]: !current[question.id],
                  }))
                }
                onToggleExplanation={() => {}}
              />
            ))}
            {!paper.questions.length ? (
              <p className="text-sm text-muted-foreground">This paper has no published questions yet.</p>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Answered {answeredCount} of {paper.questions.length}
            </p>
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !paper.questions.length}
              className="h-11 rounded-full bg-forest px-6 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit paper"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

