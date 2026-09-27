"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import StudySidebar from "@/components/study/StudySidebar";
import { sanitizeExplanationHtml } from "@/lib/explanation";

export default function StudyTopicPage({ params }) {
  const { subject, topic } = use(params);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/study/${subject}/${topic}`)
      .then(({ data: payload }) => setData(payload.data))
      .catch((err) => setError(err.message));
  }, [subject, topic]);

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
        Loading lesson...
      </div>
    );
  }

  const html = data.topic.body ? sanitizeExplanationHtml(data.topic.body) : "";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row">
      <StudySidebar subject={data.subject} tree={data.tree} activeSlug={data.topic.slug} />
      <article className="min-w-0 flex-1 overflow-hidden">
        <nav className="mb-5 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
          {data.breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.href}-${index}`} className="flex items-center gap-1.5">
              {index ? <span>/</span> : null}
              {crumb.href && index < data.breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="hover:text-forest">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-ink">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          {data.subject.name}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{data.topic.title}</h1>
        {data.topic.summary ? (
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{data.topic.summary}</p>
        ) : null}

        {html ? (
          <div
            className="explanation-html study-article mt-6 text-[1.02rem] leading-8 text-ink"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            This topic appears in the question bank. A full NTRCA lesson has not been written
            for it yet. Use the tagged questions below while the lesson is prepared.
          </p>
        )}

        {data.relatedQuestions?.length ? (
          <section className="mt-10 rounded-2xl border border-line bg-paper p-5">
            <h2 className="text-sm font-semibold text-ink">From the question bank</h2>
            <ul className="mt-3 space-y-2">
              {data.relatedQuestions.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link href={item.href} className="text-sm text-forest hover:underline">
                      {item.exam ? `${item.exam}: ` : ""}
                      {item.stem}
                    </Link>
                  ) : (
                    <span className="text-sm">{item.stem}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap justify-between gap-3 text-sm">
          {data.previous?.href ? (
            <Link href={data.previous.href} className="text-forest hover:underline">
              ← {data.previous.title}
            </Link>
          ) : (
            <span />
          )}
          {data.next?.href ? (
            <Link href={data.next.href} className="text-forest hover:underline">
              {data.next.title} →
            </Link>
          ) : null}
        </div>
      </article>
    </div>
  );
}
