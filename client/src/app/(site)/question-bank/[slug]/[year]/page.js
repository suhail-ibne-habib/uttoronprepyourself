"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import QuestionCard from "@/components/questions/QuestionCard";

export default function QuestionBankPaperPage({ params }) {
  const { slug, year } = use(params);
  const [paper, setPaper] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/exams/${slug}/${year}`)
      .then(({ data }) => setPaper(data.data))
      .catch((err) => setError(err.message));
  }, [slug, year]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-sm text-wrong">{error}</p>
        <Link href="/question-bank" className="mt-4 inline-block text-sm text-forest underline">
          Back to question bank
        </Link>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-sm text-muted-foreground">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/question-bank" className="text-sm text-muted-foreground hover:text-forest">
        ← Question bank
      </Link>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Study
      </p>
      <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">
        {paper.exam} {paper.year}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {paper.examType?.toUpperCase()} · {paper.level} · {paper.questions.length} questions
      </p>

      <div className="mt-8 space-y-5">
        {paper.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            selectedKey={null}
            flagged={false}
            explanationOpen={false}
            mode="study"
            onSelect={() => {}}
            onToggleFlag={() => {}}
            onToggleExplanation={() => {}}
          />
        ))}
        {!paper.questions.length ? (
          <p className="text-sm text-muted-foreground">No published questions for this paper yet.</p>
        ) : null}
      </div>
    </div>
  );
}
