"use client";

import { ChevronIcon } from "@/components/icons";
import { sanitizeExplanationHtml } from "@/lib/explanation";

export default function Explanation({
  explanation,
  open,
  onToggle,
  panelId,
  alwaysOpen = false,
}) {
  if (!explanation) return null;
  const source = typeof explanation === "string" ? { html: explanation } : explanation;
  const rawHtml =
    source.html || (/<[a-z][\s\S]*>/i.test(source.body || "") ? source.body : null);
  const html = rawHtml ? sanitizeExplanationHtml(rawHtml) : null;
  const visible = alwaysOpen || open;
  return (
    <div className="mt-4 border-t border-line pt-3">
      {alwaysOpen ? (
        <p className="mb-2 text-sm font-medium text-forest">Explanation</p>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left text-sm font-medium text-forest hover:bg-forest-soft"
        >
          <span>{open ? "Hide explanation" : "Show explanation"}</span>
          <ChevronIcon open={open} className="size-4 text-forest" />
        </button>
      )}

      {visible ? (
        <div
          id={panelId}
          className="mt-2 rounded-xl bg-forest-soft/70 px-4 py-4 text-sm leading-6 text-ink"
        >
          {html ? (
            <div
              className="explanation-html text-ink/90"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <>
              {source.heading ? (
                <p className="mb-2 font-semibold tracking-tight text-forest">
                  {source.heading}
                </p>
              ) : null}
              {source.body ? (
                <p className="text-ink/90">{source.body}</p>
              ) : null}
              {source.points?.length ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink/85">
                  {source.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
