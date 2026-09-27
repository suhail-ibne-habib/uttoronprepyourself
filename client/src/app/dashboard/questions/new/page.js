"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuestionForm from "@/components/dashboard/QuestionForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewQuestionPage() {
  const [exams, setExams] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/admin/exams"), api.get("/admin/subjects")])
      .then(([examRes, subjectRes]) => {
        setExams(examRes.data.data || []);
        setSubjects(subjectRes.data.data || []);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  return (
    <>
      <DashboardHeader title="New question" />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background p-5">
          {exams ? (
            <QuestionForm exams={exams} subjects={subjects} />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </div>
      </div>
    </>
  );
}
