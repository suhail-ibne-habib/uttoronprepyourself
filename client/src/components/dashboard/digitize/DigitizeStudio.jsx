"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import QueueSheet from "@/components/dashboard/digitize/QueueSheet";
import ReviewForm from "@/components/dashboard/digitize/ReviewForm";
import SourcePanel from "@/components/dashboard/digitize/SourcePanel";
import { downloadJson, toQuestionPayload } from "@/components/dashboard/digitize/payload";
import { SAMPLE_PRESETS, emptyDraft } from "@/components/dashboard/digitize/presets";

export default function DigitizeStudio({ exams, subjects }) {
  const [draft, setDraft] = useState(() => structuredClone(SAMPLE_PRESETS.math));
  const [queue, setQueue] = useState([]);
  const [queueOpen, setQueueOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [zoom, setZoom] = useState(1);

  const adjustZoom = useCallback((delta, reset) => {
    if (reset) {
      setZoom(1);
      return;
    }
    setZoom((current) => Math.min(2.5, Math.max(0.5, Math.round((current + delta) * 100) / 100)));
  }, []);

  function loadPreset(key) {
    const preset = SAMPLE_PRESETS[key];
    if (!preset) return;
    setScanning(true);
    window.setTimeout(() => {
      setDraft((current) => ({
        ...structuredClone(preset),
        examId: current.examId,
        subjectId: current.subjectId,
      }));
      setZoom(1);
      setScanning(false);
    }, 700);
  }

  function handleUpload(file) {
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({
        ...emptyDraft(),
        examId: current.examId,
        subjectId: current.subjectId,
        imageSrc: String(reader.result || ""),
        imageTitle: file.name,
        sourceName: file.name,
        questionNo: current.questionNo,
      }));
      setZoom(1);
      toast.message("Photo loaded", {
        description: "The local model is not connected yet. Fill the question from the photo, then add it to the queue.",
      });
    };
    reader.readAsDataURL(file);
  }

  function queueCurrent() {
    try {
      const question = toQuestionPayload(draft);
      const item = {
        id: `q-${Date.now()}`,
        savedAt: new Date().toISOString(),
        imageTitle: draft.imageTitle || "",
        boxes: draft.boxes,
        question,
      };
      setQueue((current) => [item, ...current]);
      toast.success(`Question ${question.questionNo} added to the queue`);
      setQueueOpen(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function exportCurrent() {
    try {
      const question = toQuestionPayload(draft);
      downloadJson(
        { question, source: { imageTitle: draft.imageTitle || null, boxes: draft.boxes } },
        `question-${question.questionNo}.json`,
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Upload a paper photo, check the fields, and keep a session queue in the same shape as a saved question. Scanning with the local model comes next.
        </p>
        <Button type="button" variant="outline" onClick={() => setQueueOpen(true)}>
          <Database />
          Queue ({queue.length})
        </Button>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:h-[calc(100svh-10.5rem)]">
        <SourcePanel
          draft={draft}
          scanning={scanning}
          showBoxes={showBoxes}
          onShowBoxes={setShowBoxes}
          zoom={zoom}
          onZoom={adjustZoom}
          onPreset={loadPreset}
          onUpload={handleUpload}
        />
        <ReviewForm
          draft={draft}
          exams={exams}
          subjects={subjects}
          onChange={setDraft}
          onQueue={queueCurrent}
          onExport={exportCurrent}
        />
      </div>

      <QueueSheet
        open={queueOpen}
        onOpenChange={setQueueOpen}
        items={queue}
        exams={exams}
        subjects={subjects}
        onRemove={(id) => setQueue((current) => current.filter((item) => item.id !== id))}
        onExportOne={(item) =>
          downloadJson(
            { question: item.question, source: { imageTitle: item.imageTitle, boxes: item.boxes } },
            `question-${item.question.questionNo}.json`,
          )
        }
        onExportAll={() => downloadJson(queue.map((item) => item.question), "question-queue.json")}
      />
    </div>
  );
}
