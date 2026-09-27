"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExamForm from "@/components/dashboard/ExamForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditExamPage({ params }) {
  const { id } = use(params);
  const [exam, setExam] = useState(null);

  useEffect(() => {
    api
      .get(`/admin/exams/${id}`)
      .then(({ data }) => setExam(data.data))
      .catch((error) => toast.error(error.message));
  }, [id]);

  return (
    <>
      <DashboardHeader title="Edit exam" />
      <div className="p-4 md:p-6">
        <div className="max-w-3xl rounded-xl border border-border bg-background p-5">
          {exam ? <ExamForm exam={exam} /> : <Skeleton className="h-64 w-full" />}
        </div>
      </div>
    </>
  );
}
