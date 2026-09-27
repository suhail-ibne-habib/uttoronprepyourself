"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { examSchema } from "@/validations/exam.schema";
import { examSlug } from "@/lib/exam-slug";
import { compactPayload } from "@/components/forms/Field";
import { Field } from "@/components/forms/Field";
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

const examTypes = ["ntrca", "bpsc", "primary", "bank", "other"];
const levels = ["school", "school-2", "college", "primary", "other"];
const statuses = ["draft", "published", "archived"];

export default function ExamForm({ exam, onSuccess }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: exam?.name || "",
      examType: exam?.examType || "ntrca",
      examNumber: exam?.examNumber ?? "",
      year: exam?.year || new Date().getFullYear(),
      level: exam?.level || "school",
      description: exam?.description || "",
      duration: exam?.duration ?? "",
      negativeMarking: exam?.negativeMarking ?? 0,
      status: exam?.status || "draft",
    },
  });

  const examType = watch("examType");
  const examNumber = watch("examNumber");
  const level = watch("level");
  const year = watch("year");
  const generatedSlug = examSlug({ examType, examNumber, level });

  async function onSubmit(values) {
    const payload = compactPayload({
      ...values,
      examNumber: values.examNumber === "" ? undefined : Number(values.examNumber),
      duration: values.duration === "" ? undefined : Number(values.duration),
      negativeMarking:
        values.negativeMarking === "" ? undefined : Number(values.negativeMarking),
    });

    try {
      if (exam?._id) {
        await api.patch(`/admin/exams/${exam._id}`, payload);
        toast.success("Exam updated");
      } else {
        await api.post("/admin/exams", payload);
        toast.success("Exam created");
      }
      if (onSuccess) onSuccess();
      else router.push("/dashboard/exams");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" placeholder="NTRCA School Level" {...register("name")} />
        </Field>
        <Field label="Exam type" error={errors.examType?.message}>
          <Controller
            name="examType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field
          label="Exam number"
          htmlFor="examNumber"
          error={errors.examNumber?.message}
        >
          <Input
            id="examNumber"
            type="number"
            placeholder="8"
            {...register("examNumber")}
          />
          <p className="text-xs text-muted-foreground">8 becomes 8th in the slug.</p>
        </Field>
        <Field label="Level" error={errors.level?.message}>
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Year" htmlFor="year" error={errors.year?.message}>
          <Input id="year" type="number" {...register("year")} />
        </Field>
        <Field label="Duration (minutes)" htmlFor="duration" error={errors.duration?.message}>
          <Input id="duration" type="number" {...register("duration")} />
        </Field>
        <Field
          label="Minus marking"
          htmlFor="negativeMarking"
          error={errors.negativeMarking?.message}
        >
          <Input id="negativeMarking" type="number" step="0.25" {...register("negativeMarking")} />
          <p className="text-xs text-muted-foreground">
            Deducted per wrong answer.
          </p>
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
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 sm:col-span-2">
          <p className="text-xs text-muted-foreground">Slug is generated automatically</p>
          <p className="mt-1 font-mono text-sm">
            {generatedSlug || "ntrca-8th-school"}
            {year ? ` / ${year}` : ""}
          </p>
        </div>
      </div>
      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" rows={4} {...register("description")} />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : exam?._id ? "Save changes" : "Create exam"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/exams">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
