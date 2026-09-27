"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchSelect({
  items = [],
  value,
  onChange,
  multiple = false,
  disabled = false,
  placeholder = "Search...",
  getKey = (item) => String(item._id),
  getLabel = (item) => item.name,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedKeys = multiple
    ? (Array.isArray(value) ? value.map(String) : [])
    : value
      ? [String(value)]
      : [];

  const selectedItems = items.filter((item) => selectedKeys.includes(getKey(item)));

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const key = getKey(item);
      if (multiple && selectedKeys.includes(key)) return false;
      if (!needle) return true;
      return getLabel(item).toLowerCase().includes(needle);
    });
  }, [items, query, selectedKeys, multiple, getKey, getLabel]);

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function select(item) {
    const key = getKey(item);
    if (multiple) {
      onChange([...selectedKeys, key]);
      setQuery("");
      return;
    }
    onChange(key);
    setQuery("");
    setOpen(false);
  }

  function remove(key) {
    if (multiple) onChange(selectedKeys.filter((item) => item !== key));
    else onChange("");
  }

  const singleLabel = !multiple && selectedItems[0] ? getLabel(selectedItems[0]) : "";

  return (
    <div ref={rootRef} className="relative">
      {multiple && selectedItems.length ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <button
              key={getKey(item)}
              type="button"
              disabled={disabled}
              onClick={() => remove(getKey(item))}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs"
            >
              {getLabel(item)}
              <X className="size-3" />
            </button>
          ))}
        </div>
      ) : null}
      <Input
        disabled={disabled}
        value={open || multiple || !singleLabel ? query : singleLabel}
        placeholder={placeholder}
        onFocus={() => {
          if (!disabled) {
            setOpen(true);
            if (!multiple) setQuery("");
          }
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          if (!multiple && value) onChange("");
        }}
        autoComplete="off"
      />
      {open && !disabled ? (
        <ul className="relative z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border bg-background p-1 shadow-md">
          {filtered.length ? (
            filtered.map((item) => (
              <li key={getKey(item)}>
                <button
                  type="button"
                  className="flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(item)}
                >
                  {getLabel(item)}
                </button>
              </li>
            ))
          ) : (
            <li className="px-2 py-1.5 text-sm text-muted-foreground">No matches</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}

export function examOptionLabel(exam) {
  return [exam.name, exam.year, exam.slug ? `(${exam.slug})` : ""]
    .filter(Boolean)
    .join(" ");
}
