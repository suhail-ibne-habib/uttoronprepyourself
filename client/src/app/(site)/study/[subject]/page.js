"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import StudySidebar from "@/components/study/StudySidebar";

export default function StudySubjectPage({ params }) {
  const { subject } = use(params);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/study/${subject}`)
      .then(({ data }) => setData(data.data))
      .catch((err) => setError(err.message));
  }, [subject]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-wrong">{error}</p>
        <Link href="/study" className="mt-4 inline-block text-sm text-forest underline">
          Back to study
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-sm text-muted-foreground">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row">
      <StudySidebar subject={data.subject} tree={data.tree} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          Study
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{data.subject.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          {data.subject.description ||
            "Choose a topic from the list. Start with noun and article if you are preparing NTRCA English."}
        </p>
        <ol className="mt-8 grid gap-2">
          {(data.lessons || []).map((lesson, index) => (
            <li key={lesson.id || lesson.slug}>
              <Link
                href={lesson.href}
                className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 hover:border-forest"
              >
                <span>
                  <span className="mr-3 text-xs text-muted-foreground">{index + 1}.</span>
                  {lesson.title}
                </span>
                <span className="text-forest">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
