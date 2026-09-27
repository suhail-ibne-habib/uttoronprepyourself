"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function lessonMatches(lesson, query) {
  const q = normalize(query);
  if (!q) return true;
  if (normalize(lesson.title).includes(q)) return true;
  if (String(lesson.slug || "").includes(q.replace(/\s+/g, "-"))) return true;
  return (lesson.aliases || []).some((alias) => normalize(alias).includes(q));
}

export default function TopicSuggestField({
  value = [],
  onChange,
  subjectId,
  options = [],
  placeholder = "Type a topic",
  disabled = false,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState([]);
  const rootRef = useRef(null);
  const selected = Array.isArray(value) ? value : [];

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    const handle = setTimeout(async () => {
      try {
        const { data } = await api.get("/admin/topic-suggest", {
          params: {
            ...(subjectId ? { subjectId } : {}),
            ...(query.trim() ? { q: query.trim() } : {}),
          },
        });
        setFetched(Array.isArray(data?.data) ? data.data : []);
      } catch {
        setFetched([]);
      }
    }, query.trim() ? 180 : 0);

    return () => clearTimeout(handle);
  }, [subjectId, query]);

  const pool = options.length ? options : fetched;

  const matches = useMemo(() => {
    const picked = new Set(selected.map(normalize));
    const local = pool.filter((lesson) => !picked.has(normalize(lesson.title)));
    const filtered = local.filter((lesson) => lessonMatches(lesson, query));
    const extra = fetched.filter(
      (lesson) =>
        !picked.has(normalize(lesson.title)) &&
        !filtered.some((item) => normalize(item.title) === normalize(lesson.title)),
    );
    return [...filtered, ...extra].slice(0, 8);
  }, [pool, fetched, query, selected]);

  const typed = query.trim();
  const exactCovered =
    Boolean(typed) &&
    (matches.some((lesson) => normalize(lesson.title) === normalize(typed)) ||
      selected.some((item) => normalize(item) === normalize(typed)));

  function add(title) {
    const next = String(title || "").trim();
    if (!next) return;
    if (selected.some((item) => normalize(item) === normalize(next))) {
      setQuery("");
      return;
    }
    onChange([...selected, next]);
    setQuery("");
    setOpen(true);
  }

  function remove(title) {
    onChange(selected.filter((item) => item !== title));
  }

  return (
    <div ref={rootRef} className="relative">
      {selected.length ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((item) => (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => remove(item)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs"
            >
              {item}
              <X className="size-3" />
            </button>
          ))}
        </div>
      ) : null}
      <Input
        disabled={disabled}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => !disabled && setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (matches[0]) add(matches[0].title);
            else add(query);
          }
        }}
      />
      {open && !disabled ? (
        <ul className="relative z-50 mt-1 max-h-56 overflow-auto rounded-lg border border-border bg-background p-1 shadow-md">
          {matches.map((lesson) => (
            <li key={lesson._id || lesson.slug || lesson.title}>
              <button
                type="button"
                className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => add(lesson.title)}
              >
                <span className="text-sm">{lesson.title}</span>
                <span className="text-[11px] text-forest">
                  {lesson.fromQuestion
                    ? "Already used on a question — select this"
                    : "Already covered — select this"}
                </span>
              </button>
            </li>
          ))}
          {typed && !exactCovered ? (
            <li>
              <button
                type="button"
                className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => add(query)}
              >
                <span className="text-sm">Use “{typed}”</span>
                <span className="text-[11px] text-muted-foreground">
                  New study lesson will be created
                </span>
              </button>
            </li>
          ) : null}
          {!matches.length && !typed ? (
            <li className="px-2 py-1.5 text-sm text-muted-foreground">
              Type to search covered topics
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
