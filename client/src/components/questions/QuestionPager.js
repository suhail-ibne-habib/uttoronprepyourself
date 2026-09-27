"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

export default function QuestionPager({
  currentNumber,
  total,
  onPrev,
  onNext,
}) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentNumber <= 1}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-forest/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeftIcon className="size-4" />
        Previous
      </button>
      <p className="text-sm text-muted-foreground">
        {currentNumber} / {total}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={currentNumber >= total}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-forest/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ArrowRightIcon className="size-4" />
      </button>
    </div>
  );
}
