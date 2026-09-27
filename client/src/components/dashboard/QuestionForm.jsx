"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { questionSchema } from "@/validations/question.schema";
import { Field } from "@/components/forms/Field";
import ExplanationEditor from "@/components/dashboard/ExplanationEditor";
import TopicSuggestField from "@/components/dashboard/TopicSuggestField";
import { explanationToHtml, isEmptyHtml } from "@/lib/explanation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const keys = ["a", "b", "c", "d"];

function paperExamId(question) {
  return String(question?.examId?._id || question?.examId || "");
}

function paperSubjectId(question) {
  return String(question?.subjectId?._id || question?.subjectId || "");
}

function subjectOnExam(subject, examId) {
  const ids = [
    ...(subject.examIds || []).map((id) => String(id._id || id)),
    ...(subject.exams || []).map((exam) => String(exam._id || exam)),
  ];
  return ids.includes(String(examId));
}

export default function QuestionForm({ question, exams, subjects = [] }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      examId: paperExamId(question),
      subjectId: paperSubjectId(question),
      questionNo: question?.questionNo || 1,
      question: question?.question || "",
      options: question?.options?.length
        ? question.options
        : keys.map((key) => ({ key, text: "" })),
      answerKey: question?.answerKey || "a",
      mark: question?.mark ?? 1,
      difficulty: question?.difficulty || "medium",
      primaryTopics: question?.primaryTopics || [],
      secondaryTopics: question?.secondaryTopics || [],
      tertiaryTopics: question?.tertiaryTopics || [],
      explanation: explanationToHtml(question?.explanation),
      questionType: question?.questionType || "mcq",
      language: question?.language || "en",
      passage: question?.passage || "",
      sourceName: question?.source?.name || "",
      sourcePage: question?.source?.page || "",
      sourceQuestionNo: question?.source?.questionNo || "",
      imageUrl: question?.image?.url || "",
      verified: question?.verified || false,
      reviewStatus: question?.reviewStatus || "pending",
      status: question?.status || "draft",
    },
  });

  const { fields } = useFieldArray({ control, name: "options" });
  const examId = watch("examId");
  const subjectId = watch("subjectId");
  const [topicOptions, setTopicOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/admin/topic-suggest", {
        params: subjectId ? { subjectId } : {},
      })
      .then(({ data }) => {
        if (!cancelled) setTopicOptions(Array.isArray(data?.data) ? data.data : []);
      })
      .catch(() => {
        if (!cancelled) setTopicOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  const subjectsForExam = useMemo(
    () => subjects.filter((subject) => subjectOnExam(subject, examId)),
    [subjects, examId],
  );

  async function onSubmit(values) {
    const payload = {
      examId: values.examId,
      subjectId: values.subjectId,
      questionNo: values.questionNo,
      question: values.question,
      options: values.options,
      answerKey: values.answerKey,
      mark: values.mark,
      difficulty: values.difficulty,
      questionType: values.questionType,
      language: values.language,
      passage: values.passage || null,
      explanation: isEmptyHtml(values.explanation) ? null : values.explanation,
      verified: values.verified,
      reviewStatus: values.reviewStatus,
      status: values.status,
      primaryTopics: values.primaryTopics || [],
      secondaryTopics: values.secondaryTopics || [],
      tertiaryTopics: values.tertiaryTopics || [],
      source: {
        name: values.sourceName || null,
        page: values.sourcePage || null,
        questionNo: values.sourceQuestionNo || null,
      },
      image: {
        url: values.imageUrl || null,
      },
    };

    try {
      if (question?._id) {
        await api.patch(`/admin/questions/${question._id}`, payload);
        toast.success("Question updated");
      } else {
        await api.post("/admin/questions", payload);
        toast.success("Question created");
      }
      router.push("/dashboard/questions");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid max-w-3xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Exam" error={errors.examId?.message}>
          <Controller
            name="examId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue("subjectId", "");
                }}
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
            )}
          />
        </Field>
        <Field label="Subject" error={errors.subjectId?.message}>
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={!examId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Attach a subject first" />
                </SelectTrigger>
                <SelectContent>
                  {subjectsForExam.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <div className="grid gap-4 rounded-xl border border-border p-4">
        <p className="text-sm font-medium">Topics</p>
        <p className="text-xs text-muted-foreground">
          Type to search covered lessons. Pick a match, or keep a new name and a study page will be created when you save.
        </p>
        <Field label="Primary topics" error={errors.primaryTopics?.message}>
          <Controller
            name="primaryTopics"
            control={control}
            render={({ field }) => (
              <TopicSuggestField
                value={field.value}
                onChange={field.onChange}
                subjectId={subjectId}
                options={topicOptions}
                placeholder="Type Noun, Idioms…"
              />
            )}
          />
        </Field>
        <Field label="Secondary topics" error={errors.secondaryTopics?.message}>
          <Controller
            name="secondaryTopics"
            control={control}
            render={({ field }) => (
              <TopicSuggestField
                value={field.value}
                onChange={field.onChange}
                subjectId={subjectId}
                options={topicOptions}
                placeholder="Type a more specific topic"
              />
            )}
          />
        </Field>
        <Field label="Tertiary topics" error={errors.tertiaryTopics?.message}>
          <Controller
            name="tertiaryTopics"
            control={control}
            render={({ field }) => (
              <TopicSuggestField
                value={field.value}
                onChange={field.onChange}
                subjectId={subjectId}
                options={topicOptions}
                placeholder="Optional finer topic"
              />
            )}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Question no." htmlFor="questionNo" error={errors.questionNo?.message}>
          <Input id="questionNo" type="number" {...register("questionNo")} />
        </Field>
        <Field label="Marks" htmlFor="mark" error={errors.mark?.message}>
          <Input id="mark" type="number" step="0.25" {...register("mark")} />
        </Field>
        <Field label="Difficulty" error={errors.difficulty?.message}>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">easy</SelectItem>
                  <SelectItem value="medium">medium</SelectItem>
                  <SelectItem value="hard">hard</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Type" error={errors.questionType?.message}>
          <Controller
            name="questionType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">mcq</SelectItem>
                  <SelectItem value="true_false">true_false</SelectItem>
                  <SelectItem value="written">written</SelectItem>
                  <SelectItem value="fill_blank">fill_blank</SelectItem>
                  <SelectItem value="matching">matching</SelectItem>
                  <SelectItem value="comprehension">comprehension</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Language" error={errors.language?.message}>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bangla</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Review" error={errors.reviewStatus?.message}>
          <Controller
            name="reviewStatus"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="reviewed">reviewed</SelectItem>
                  <SelectItem value="approved">approved</SelectItem>
                  <SelectItem value="rejected">rejected</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">draft</SelectItem>
                  <SelectItem value="published">published</SelectItem>
                  <SelectItem value="archived">archived</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field label="Passage (optional)" htmlFor="passage" error={errors.passage?.message}>
        <Textarea id="passage" rows={3} {...register("passage")} />
      </Field>

      <Field label="Question" htmlFor="question" error={errors.question?.message}>
        <Textarea id="question" rows={3} {...register("question")} />
      </Field>

      <div className="rounded-xl border border-border p-4">
        <p className="mb-3 text-sm font-medium">Options</p>
        <div className="grid gap-3">
          {fields.map((field, index) => (
            <Field
              key={field.id}
              label={`${field.key.toUpperCase()}`}
              error={errors.options?.[index]?.text?.message}
            >
              <Input {...register(`options.${index}.text`)} />
              <input type="hidden" {...register(`options.${index}.key`)} />
            </Field>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Correct answer" error={errors.answerKey?.message}>
            <Controller
              name="answerKey"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {keys.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      </div>

      <Field label="Explanation" error={errors.explanation?.message}>
        <Controller
          name="explanation"
          control={control}
          render={({ field }) => (
            <ExplanationEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <Field label="Image URL" htmlFor="imageUrl" error={errors.imageUrl?.message}>
        <Input id="imageUrl" placeholder="https://" {...register("imageUrl")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Source" htmlFor="sourceName" error={errors.sourceName?.message}>
          <Input id="sourceName" {...register("sourceName")} />
        </Field>
        <Field label="Source page" htmlFor="sourcePage" error={errors.sourcePage?.message}>
          <Input id="sourcePage" type="number" {...register("sourcePage")} />
        </Field>
        <Field
          label="Source question no."
          htmlFor="sourceQuestionNo"
          error={errors.sourceQuestionNo?.message}
        >
          <Input id="sourceQuestionNo" type="number" {...register("sourceQuestionNo")} />
        </Field>
      </div>
      <Controller
        name="verified"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            Verified
          </label>
        )}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : question?._id ? "Save changes" : "Create question"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/questions">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
