"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { studyTopicSchema } from "@/validations/studyTopic.schema";
import { Field } from "@/components/forms/Field";
import ExplanationEditor from "@/components/dashboard/ExplanationEditor";
import { isEmptyHtml } from "@/lib/explanation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudyTopicForm({ topic, subjects, topics }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studyTopicSchema),
    defaultValues: {
      subjectId: String(topic?.subjectId?._id || topic?.subjectId || ""),
      parentId: String(topic?.parentId?._id || topic?.parentId || ""),
      title: topic?.title || "",
      slug: topic?.slug || "",
      aliases: topic?.aliases?.join(", ") || "",
      summary: topic?.summary || "",
      body: topic?.body || "",
      order: topic?.order ?? 0,
      status: topic?.status || "published",
    },
  });

  const subjectId = watch("subjectId");
  const parents = (topics || []).filter((row) => {
    if (topic?._id && String(row._id) === String(topic._id)) return false;
    return String(row.subjectId?._id || row.subjectId) === String(subjectId);
  });

  async function onSubmit(values) {
    const payload = {
      ...values,
      parentId: values.parentId || null,
      aliases: values.aliases
        ? values.aliases
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      body: isEmptyHtml(values.body) ? "" : values.body,
    };

    try {
      if (topic?._id) {
        await api.patch(`/admin/study-topics/${topic._id}`, payload);
        toast.success("Lesson updated");
      } else {
        await api.post("/admin/study-topics", payload);
        toast.success("Lesson created");
      }
      router.push("/dashboard/study");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid max-w-3xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Subject" error={errors.subjectId?.message}>
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Parent lesson" error={errors.parentId?.message}>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Top level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Top level</SelectItem>
                  {parents.map((row) => (
                    <SelectItem key={row._id} value={row._id}>
                      {row.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Title" htmlFor="title" error={errors.title?.message}>
          <Input id="title" {...register("title")} />
        </Field>
        <Field label="Order" htmlFor="order" error={errors.order?.message}>
          <Input id="order" type="number" {...register("order")} />
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
                  <SelectItem value="published">published</SelectItem>
                  <SelectItem value="draft">draft</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
      <Field label="Aliases (comma separated)" htmlFor="aliases" error={errors.aliases?.message}>
        <Input id="aliases" placeholder="common nouns, the" {...register("aliases")} />
      </Field>
      <Field label="Summary" htmlFor="summary" error={errors.summary?.message}>
        <Textarea id="summary" rows={2} {...register("summary")} />
      </Field>
      <Field label="Lesson" error={errors.body?.message}>
        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <ExplanationEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : topic?._id ? "Save lesson" : "Create lesson"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/study">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
