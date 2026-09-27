"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function StudyHomePage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/study")
      .then(({ data }) => setSubjects(data.data || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Study
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Read by subject</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        Open a subject, then a topic. Lessons follow NTRCA English patterns: article use,
        noun types, tense and the traps that appear in past papers.
      </p>
      {error ? <p className="mt-6 text-sm text-wrong">{error}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={subject.href}
            className="rounded-2xl border border-line bg-paper p-5 transition hover:border-forest"
          >
            <h2 className="font-serif text-2xl text-ink">{subject.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {subject.description || "Lessons and question-bank topics."}
            </p>
            <p className="mt-4 text-xs text-forest">{subject.lessonCount} lessons</p>
          </Link>
        ))}
        {!subjects.length && !error ? (
          <p className="text-sm text-muted-foreground">No subjects yet.</p>
        ) : null}
      </div>
    </div>
  );
}
