"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { subjectSchema } from "@/validations/subject.schema";
import { slugify } from "@/lib/exam-slug";
import { compactPayload, Field } from "@/components/forms/Field";
import { SearchSelect, examOptionLabel } from "@/components/dashboard/SearchSelect";
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

export default function SubjectForm({ subject }) {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: subject?.name || "",
      code: subject?.code || "",
      description: subject?.description || "",
      status: subject?.status || "active",
      examIds: subject?.examIds || subject?.exams?.map((exam) => String(exam._id)) || [],
    },
  });

  const name = watch("name");
  const generatedSlug = slugify(name);

  useEffect(() => {
    Promise.all([api.get("/admin/exams"), api.get("/admin/subjects")])
      .then(([examRes, subjectRes]) => {
        setExams(examRes.data.data || []);
        setSubjects(subjectRes.data.data || []);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  const matchingSubject = subjects.find(
    (row) =>
      slugify(row.name) === generatedSlug &&
      String(row._id) !== String(subject?._id || ""),
  );

  async function onSubmit(values) {
    try {
      const payload = compactPayload({
        ...values,
        examIds: values.examIds,
      });
      if (subject?._id) {
        await api.patch(`/admin/subjects/${subject._id}`, payload);
        toast.success("Subject updated");
      } else {
        const { data } = await api.post("/admin/subjects", payload);
        toast.success(
          data.merged
            ? "Exams added to the existing subject"
            : "Subject created",
        );
      }
      router.push("/dashboard/subjects");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-4">
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder="English" {...register("name")} />
      </Field>
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
        <p className="text-xs text-muted-foreground">Slug is generated from the name</p>
        <p className="mt-1 font-mono text-sm">{generatedSlug || "english"}</p>
      </div>
      <Field label="Map to exams" error={errors.examIds?.message}>
        <p className="mb-2 text-xs text-muted-foreground">
          One subject can belong to many exams. Add every paper that should use this subject.
        </p>
        {matchingSubject ? (
          <p className="mb-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
            {matchingSubject.name} already exists. Saving will attach these exams to that
            subject instead of creating another one.
          </p>
        ) : null}
        <Controller
          name="examIds"
          control={control}
          render={({ field }) => (
            <SearchSelect
              multiple
              items={exams}
              value={field.value}
              onChange={field.onChange}
              placeholder="Search exams by name, year or slug"
              getLabel={examOptionLabel}
            />
          )}
        />
      </Field>
      <Field label="Code" htmlFor="code" error={errors.code?.message}>
        <Input id="code" {...register("code")} />
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
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="inactive">inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" rows={4} {...register("description")} />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : subject?._id ? "Save changes" : "Create subject"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/subjects">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
