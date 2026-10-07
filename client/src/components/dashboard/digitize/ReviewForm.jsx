"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import TopicSuggestField from "@/components/dashboard/TopicSuggestField";
import { Field } from "@/components/forms/Field";
import { OPTION_KEYS } from "@/components/dashboard/digitize/presets";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function subjectOnExam(subject, examId) {
  const ids = [
    ...(subject.examIds || []).map((id) => String(id._id || id)),
    ...(subject.exams || []).map((exam) => String(exam._id || exam)),
  ];
  return ids.includes(String(examId));
}

export default function ReviewForm({ draft, exams, subjects, onChange, onQueue, onExport }) {
  const [topicOptions, setTopicOptions] = useState([]);
  const subjectsForExam = useMemo(
    () => subjects.filter((subject) => subjectOnExam(subject, draft.examId)),
    [subjects, draft.examId],
  );

  useEffect(() => {
    let cancelled = false;
    api
      .get("/admin/topic-suggest", { params: draft.subjectId ? { subjectId: draft.subjectId } : {} })
      .then(({ data }) => {
        if (!cancelled) setTopicOptions(Array.isArray(data?.data) ? data.data : []);
      })
      .catch(() => {
        if (!cancelled) setTopicOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [draft.subjectId]);

  function patch(partial) {
    onChange({ ...draft, ...partial });
  }

  function updateOption(index, text) {
    const options = draft.options.map((option, optionIndex) =>
      optionIndex === index ? { ...option, text } : option,
    );
    patch({ options });
  }

  function addOption() {
    if (draft.options.length >= 5) return;
    const key = OPTION_KEYS[draft.options.length];
    patch({
      options: [...draft.options, { key, text: "" }],
      missingDetected: false,
    });
  }

  function removeOption(index) {
    if (draft.options.length <= 2) return;
    const options = draft.options
      .filter((_, optionIndex) => optionIndex !== index)
      .map((option, optionIndex) => ({ ...option, key: OPTION_KEYS[optionIndex] }));
    const answerKey = options.some((option) => option.key === draft.answerKey)
      ? draft.answerKey
      : options[0].key;
    patch({ options, answerKey });
  }

  const waitingForModel = Boolean(draft.imageSrc) && !draft.sampleKey && !draft.question.trim();

  return (
    <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-xl border border-border bg-background lg:min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-medium">Review</h2>
          <p className="text-xs text-muted-foreground">Fields match the question record.</p>
        </div>
        <Badge variant={waitingForModel || draft.missingDetected ? "outline" : "secondary"}>
          {waitingForModel ? "Waiting for local model" : "Check before queueing"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Exam">
            <Select
              value={draft.examId || undefined}
              onValueChange={(examId) => patch({ examId, subjectId: "" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam._id} value={exam._id}>
                    {exam.name} {exam.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Subject">
            <Select
              value={draft.subjectId || undefined}
              onValueChange={(subjectId) => patch({ subjectId })}
              disabled={!draft.examId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={draft.examId ? "Select subject" : "Select an exam first"} />
              </SelectTrigger>
              <SelectContent>
                {subjectsForExam.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Question no.">
            <Input
              type="number"
              min={1}
              value={draft.questionNo}
              onChange={(event) => patch({ questionNo: event.target.value })}
            />
          </Field>
          <Field label="Type">
            <Select value={draft.questionType} onValueChange={(questionType) => patch({ questionType })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["mcq", "true_false", "written", "fill_blank", "matching", "comprehension"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Language">
            <Select value={draft.language} onValueChange={(language) => patch({ language })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">Bangla</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Question">
          <Textarea
            rows={4}
            value={draft.question}
            onChange={(event) => patch({ question: event.target.value })}
            placeholder="Question stem"
          />
        </Field>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label>
              Options <span className="text-muted-foreground">({draft.options.length})</span>
            </Label>
            <Button type="button" size="sm" variant="outline" onClick={addOption} disabled={draft.options.length >= 5}>
              <Plus />
              Add option
            </Button>
          </div>
          {draft.missingDetected ? (
            <Alert>
              <AlertTitle>A choice looks missing</AlertTitle>
              <AlertDescription>
                This sample only has {draft.options.length} options. Add the cropped choice before you queue it.
              </AlertDescription>
            </Alert>
          ) : null}
          <div className="grid gap-2">
            {draft.options.map((option, index) => (
              <div key={option.key} className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-xs font-medium uppercase">
                  {option.key}
                </span>
                <Input
                  value={option.text}
                  onChange={(event) => updateOption(index, event.target.value)}
                  placeholder={`Option ${option.key}`}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  disabled={draft.options.length <= 2}
                  aria-label={`Remove option ${option.key}`}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Answer">
            <Select value={draft.answerKey} onValueChange={(answerKey) => patch({ answerKey })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {draft.options.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.key.toUpperCase()}
                    {option.text ? ` — ${option.text.slice(0, 28)}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Mark">
            <Input
              type="number"
              min={0}
              step="0.5"
              value={draft.mark}
              onChange={(event) => patch({ mark: event.target.value })}
            />
          </Field>
          <Field label="Difficulty">
            <Select value={draft.difficulty} onValueChange={(difficulty) => patch({ difficulty })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-4">
          <Field label="Primary topics">
            <TopicSuggestField
              value={draft.primaryTopics}
              onChange={(primaryTopics) => patch({ primaryTopics })}
              subjectId={draft.subjectId}
              options={topicOptions}
              placeholder="Primary topic"
            />
          </Field>
          <Field label="Secondary topics">
            <TopicSuggestField
              value={draft.secondaryTopics}
              onChange={(secondaryTopics) => patch({ secondaryTopics })}
              subjectId={draft.subjectId}
              options={topicOptions}
              placeholder="Secondary topic"
            />
          </Field>
          <Field label="Tertiary topics">
            <TopicSuggestField
              value={draft.tertiaryTopics}
              onChange={(tertiaryTopics) => patch({ tertiaryTopics })}
              subjectId={draft.subjectId}
              options={topicOptions}
              placeholder="Tertiary topic"
            />
          </Field>
        </div>

        <Field label="Explanation">
          <Textarea
            rows={3}
            value={draft.explanation}
            onChange={(event) => patch({ explanation: event.target.value })}
            placeholder="Why this answer is correct"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Source name">
            <Input
              value={draft.sourceName}
              onChange={(event) => patch({ sourceName: event.target.value })}
              placeholder="Paper or file name"
            />
          </Field>
          <Field label="Source page">
            <Input
              type="number"
              min={1}
              value={draft.sourcePage}
              onChange={(event) => patch({ sourcePage: event.target.value })}
            />
          </Field>
          <Field label="Source question no.">
            <Input
              type="number"
              min={1}
              value={draft.sourceQuestionNo}
              onChange={(event) => patch({ sourceQuestionNo: event.target.value })}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Review">
            <Select value={draft.reviewStatus} onValueChange={(reviewStatus) => patch({ reviewStatus })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["pending", "reviewed", "approved", "rejected"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={draft.status} onValueChange={(status) => patch({ status })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Label className="flex items-center gap-2 text-sm font-normal">
          <Checkbox
            checked={draft.verified}
            onCheckedChange={(value) => patch({ verified: value === true })}
          />
          Mark verified
        </Label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/30 px-4 py-3">
        <Button type="button" variant="outline" onClick={onExport}>
          Export JSON
        </Button>
        <Button type="button" onClick={onQueue}>
          Add to queue
        </Button>
      </div>
    </section>
  );
}
