"use client";

import { useEffect, useRef } from "react";
import { Eye, Minus, Plus, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PRESET_BUTTONS } from "@/components/dashboard/digitize/presets";

const TONE = {
  stem: "border-sky-600 bg-sky-500/15",
  option: "border-emerald-600 bg-emerald-500/15",
  missing: "border-amber-500 bg-amber-400/20",
};

export default function SourcePanel({
  draft,
  scanning,
  showBoxes,
  onShowBoxes,
  zoom,
  onZoom,
  onPreset,
  onUpload,
}) {
  const fileRef = useRef(null);
  const viewportRef = useRef(null);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;
    function onWheel(event) {
      if (!event.ctrlKey) return;
      event.preventDefault();
      onZoom(event.deltaY < 0 ? 0.1 : -0.1);
    }
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [onZoom]);

  return (
    <section className="flex min-h-[32rem] flex-col gap-4 lg:min-h-0">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Sample layouts
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_BUTTONS.map((preset) => (
              <Button
                key={preset.key}
                type="button"
                size="sm"
                variant={draft.sampleKey === preset.key ? "default" : "outline"}
                onClick={() => onPreset(preset.key)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) onUpload(file);
            }}
          />
          <Button type="button" onClick={() => fileRef.current?.click()}>
            <Upload />
            Upload photo
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <p className="truncate text-sm font-medium">
            {draft.imageTitle || "No image yet"}
          </p>
          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
              <Checkbox checked={showBoxes} onCheckedChange={(value) => onShowBoxes(value === true)} />
              <Eye className="size-3.5" />
              Boxes
            </Label>
            <div className="flex items-center rounded-lg border border-border">
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => onZoom(-0.15)} aria-label="Zoom out">
                <Minus />
              </Button>
              <span className="w-12 text-center font-mono text-xs">{Math.round(zoom * 100)}%</span>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => onZoom(0.15)} aria-label="Zoom in">
                <Plus />
              </Button>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => onZoom(0, true)} aria-label="Reset zoom">
                <RotateCcw />
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="relative flex min-h-[22rem] flex-1 items-center justify-center overflow-auto bg-muted/40 p-4"
        >
          {draft.imageSrc ? (
            <div
              className="relative inline-block origin-center transition-transform duration-100"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.imageSrc}
                alt={draft.imageTitle || "Question source"}
                className="block max-w-full rounded-lg border border-border shadow-sm"
              />
              {showBoxes
                ? draft.boxes.map((box) => (
                    <div
                      key={`${box.label}-${box.top}-${box.left}`}
                      className={`absolute rounded-md border-2 ${TONE[box.tone] || TONE.stem}`}
                      style={{
                        top: box.top,
                        left: box.left,
                        width: box.width,
                        height: box.height,
                      }}
                    >
                      <span className="absolute top-1 right-1 rounded bg-foreground/85 px-1 text-[10px] font-medium text-background">
                        {box.label}
                      </span>
                    </div>
                  ))
                : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex max-w-sm flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-background px-6 py-10 text-center"
            >
              <Upload className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium">Upload a question photo</span>
              <span className="text-xs text-muted-foreground">
                The local model is not connected yet. You can still review a sample layout or type the question by hand.
              </span>
            </button>
          )}

          {scanning ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
              <div className="size-10 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
              <p className="text-sm font-medium">Reading the sample layout</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm border border-sky-600 bg-sky-500/40" />
            Stem
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm border border-emerald-600 bg-emerald-500/40" />
            Options
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm border border-amber-500 bg-amber-400/50" />
            Missing
          </span>
          <span className="ml-auto">Ctrl + scroll to zoom</span>
        </div>
      </div>
    </section>
  );
}
