"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function QuestionBankPicker({ inline = false }) {
  const router = useRouter();
  const [bank, setBank] = useState({ examTypes: [], levels: [], years: [], exams: [] });
  const [examType, setExamType] = useState("");
  const [level, setLevel] = useState("");
  const [year, setYear] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/question-bank")
      .then(({ data }) => setBank(data.data || { examTypes: [], levels: [], years: [], exams: [] }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const exams = useMemo(() => {
    return (bank.exams || []).filter((exam) => {
      if (examType && exam.examType !== examType) return false;
      if (level && exam.level !== level) return false;
      if (year && String(exam.year) !== String(year)) return false;
      return true;
    });
  }, [bank.exams, examType, level, year]);

  const years = useMemo(() => {
    return [...new Set(exams.map((exam) => exam.year))].sort((a, b) => b - a);
  }, [exams]);

  const levels = useMemo(() => {
    return [...new Set((bank.exams || [])
      .filter((exam) => !examType || exam.examType === examType)
      .map((exam) => exam.level))];
  }, [bank.exams, examType]);

  function selectedPaper() {
    const selected = exams.find((exam) => exam.slug === slug && String(exam.year) === String(year));
    return selected || (exams.length === 1 ? exams[0] : null);
  }

  function openPaper(mode) {
    const paper = selectedPaper();
    if (!paper) {
      setError("Select an exam from the list.");
      return;
    }
    const path = mode === "test"
      ? `/test/${paper.slug}/${paper.year}`
      : `/question-bank/${paper.slug}/${paper.year}`;
    router.push(path);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading question bank...</p>;
  }

  const fieldClass = inline
    ? "grid min-w-[8.5rem] flex-1 gap-2"
    : "grid gap-1.5 text-sm";
  const controlClass = inline
    ? "h-11 w-full border-0 border-b border-ink/20 bg-transparent px-0 text-base text-ink outline-none focus:border-forest"
    : "h-10 rounded-lg border border-line bg-paper px-3";
  const labelClass = inline
    ? "text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
    : undefined;

  return (
    <form
      id="start"
      onSubmit={(event) => {
        event.preventDefault();
        openPaper("study");
      }}
      className={inline ? "" : "grid max-w-xl gap-4"}
    >
      {error ? <p className="text-sm text-wrong">{error}</p> : null}
      {!bank.exams.length ? (
        <p className="text-sm text-muted-foreground">
          No published papers yet. Publish an exam and its questions from the dashboard.
        </p>
      ) : null}

      <div className={inline ? "flex flex-wrap items-end gap-x-8 gap-y-6" : "grid gap-4"}>
      <label className={fieldClass}>
        <span className={labelClass}>Exam type</span>
        <select
          className={controlClass}
          value={examType}
          onChange={(event) => {
            setExamType(event.target.value);
            setLevel("");
            setYear("");
            setSlug("");
          }}
        >
          <option value="">All</option>
          {bank.examTypes.map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <label className={fieldClass}>
        <span className={labelClass}>Level</span>
        <select
          className={controlClass}
          value={level}
          onChange={(event) => {
            setLevel(event.target.value);
            setYear("");
            setSlug("");
          }}
        >
          <option value="">All</option>
          {levels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className={fieldClass}>
        <span className={labelClass}>Year</span>
        <select
          className={controlClass}
          value={year}
          onChange={(event) => {
            setYear(event.target.value);
            setSlug("");
          }}
        >
          <option value="">All</option>
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className={inline ? "grid min-w-[16rem] flex-[1.6] gap-2" : fieldClass}>
        <span className={labelClass}>Exam</span>
        <select
          className={controlClass}
          value={slug && year ? `${slug}:${year}` : ""}
          onChange={(event) => {
            const [nextSlug, nextYear] = event.target.value.split(":");
            setSlug(nextSlug || "");
            setYear(nextYear || "");
          }}
        >
          <option value="">Select exam</option>
          {exams.map((exam) => (
            <option key={`${exam.slug}-${exam.year}`} value={`${exam.slug}:${exam.year}`}>
              {exam.name} {exam.year}
              {exam.examNumber ? ` · ${exam.examNumber}th` : ""}
            </option>
          ))}
        </select>
      </label>

        {inline ? (
          <div className="flex items-center gap-5 pb-2">
            <button
              type="button"
              disabled={!exams.length}
              onClick={() => openPaper("test")}
              className="h-11 rounded-full bg-gold px-6 text-sm font-medium text-white disabled:opacity-50"
            >
              Take test
            </button>
            <button
              type="submit"
              disabled={!exams.length}
              className="text-sm font-medium text-forest underline-offset-4 hover:underline disabled:opacity-50"
            >
              Study this paper
            </button>
          </div>
        ) : null}
      </div>

      {inline ? null : (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!exams.length}
            onClick={() => openPaper("test")}
            className="h-11 rounded-full bg-gold px-6 text-sm font-medium text-white disabled:opacity-50"
          >
            Take test
          </button>
          <button
            type="submit"
            disabled={!exams.length}
            className="h-11 rounded-full border border-ink/15 px-6 text-sm font-medium text-ink disabled:opacity-50"
          >
            Study this paper
          </button>
        </div>
      )}
    </form>
  );
}
