"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function QuestionBankPicker() {
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

  function openQuestions(event) {
    event.preventDefault();
    const selected = exams.find((exam) => exam.slug === slug && String(exam.year) === String(year));
    const paper = selected || exams[0];
    if (!paper) {
      setError("Select an exam from the list.");
      return;
    }
    router.push(`/question-bank/${paper.slug}/${paper.year}`);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading question bank...</p>;
  }

  return (
    <form onSubmit={openQuestions} className="grid max-w-xl gap-4">
      {error ? <p className="text-sm text-wrong">{error}</p> : null}
      {!bank.exams.length ? (
        <p className="text-sm text-muted-foreground">
          No published papers yet. Publish an exam and its questions from the dashboard.
        </p>
      ) : null}

      <label className="grid gap-1.5 text-sm">
        <span>Exam type</span>
        <select
          className="h-10 rounded-lg border border-line bg-paper px-3"
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

      <label className="grid gap-1.5 text-sm">
        <span>Level</span>
        <select
          className="h-10 rounded-lg border border-line bg-paper px-3"
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

      <label className="grid gap-1.5 text-sm">
        <span>Year</span>
        <select
          className="h-10 rounded-lg border border-line bg-paper px-3"
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

      <label className="grid gap-1.5 text-sm">
        <span>Exam</span>
        <select
          className="h-10 rounded-lg border border-line bg-paper px-3"
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

      <button
        type="submit"
        disabled={!exams.length}
        className="h-10 rounded-full bg-forest px-5 text-sm font-medium text-white disabled:opacity-50"
      >
        Open questions
      </button>
    </form>
  );
}
