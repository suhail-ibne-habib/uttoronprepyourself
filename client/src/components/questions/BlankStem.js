"use client";

import { Fragment } from "react";

export default function BlankStem({ text, filled, tone = "idle" }) {
  const parts = String(text || "").split("_____");
  const isSplit = parts.length > 1;

  const blankClass = {
    idle: "border-forest/35 text-transparent",
    picked: "border-forest text-forest",
    correct: "border-correct text-correct",
    wrong: "border-wrong text-wrong",
  }[tone];

  return (
    <p className="text-[1.05rem] leading-8 text-ink sm:text-lg sm:leading-9">
      {isSplit
        ? parts.map((part, index) => (
            <Fragment key={index}>
              {part}
              {index < parts.length - 1 ? (
                <span
                  className={`mx-1 inline-block min-w-[7.5rem] border-b-2 px-1 text-center text-[0.95em] font-semibold ${blankClass}`}
                >
                  {filled || "\u00a0"}
                </span>
              ) : null}
            </Fragment>
          ))
        : text}
    </p>
  );
}
