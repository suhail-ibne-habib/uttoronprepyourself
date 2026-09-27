"use client";

import { CheckIcon, XIcon } from "@/components/icons";

function optionState({ optionKey, selectedKey, correctKey, reveal }) {
  const isSelected = selectedKey === optionKey;
  const isCorrect = optionKey === correctKey;

  if (!reveal) {
    if (isSelected) return "picked";
    return "idle";
  }

  if (!selectedKey) return "idle";
  if (isCorrect) return "correct";
  if (isSelected) return "wrong";
  return "muted";
}

const styles = {
  idle: "border-line bg-paper hover:border-forest/40 hover:bg-forest-soft/60",
  picked: "border-forest bg-forest-soft",
  correct: "border-correct bg-correct-bg",
  wrong: "border-wrong bg-wrong-bg",
  muted: "border-line/70 bg-paper text-muted-foreground",
};

const keyStyles = {
  idle: "border-line text-muted-foreground",
  picked: "border-forest bg-forest text-white",
  correct: "border-correct bg-correct text-white",
  wrong: "border-wrong bg-wrong text-white",
  muted: "border-line text-muted-foreground",
};

export default function OptionList({
  options,
  selectedKey,
  correctKey,
  onSelect,
  locked = false,
  reveal = true,
}) {
  return (
    <ul className="mt-5 space-y-2.5">
      {(options || []).map((option) => {
        const state = optionState({
          optionKey: option.key,
          selectedKey,
          correctKey,
          reveal,
        });

        return (
          <li key={option.key}>
            <button
              type="button"
              disabled={locked}
              onClick={() => onSelect(option.key)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition disabled:cursor-default ${styles[state]}`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold uppercase ${keyStyles[state]}`}
              >
                {option.key}
              </span>
              <span className="flex-1 text-[0.95rem] text-ink">{option.text}</span>
              {state === "correct" ? <CheckIcon className="size-5 text-correct" /> : null}
              {state === "wrong" ? <XIcon className="size-5 text-wrong" /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
