"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SubjectForm from "@/components/dashboard/SubjectForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditSubjectPage({ params }) {
  const { id } = use(params);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    api
      .get(`/admin/subjects/${id}`)
      .then(({ data }) => setSubject(data.data))
      .catch((error) => toast.error(error.message));
  }, [id]);

  return (
    <>
      <DashboardHeader title="Edit subject" />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background p-5">
          {subject ? <SubjectForm subject={subject} /> : <Skeleton className="h-64 w-full" />}
        </div>
      </div>
    </>
  );
}
