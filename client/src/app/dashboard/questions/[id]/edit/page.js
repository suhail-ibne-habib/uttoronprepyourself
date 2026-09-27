"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuestionForm from "@/components/dashboard/QuestionForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditQuestionPage({ params }) {
  const { id } = use(params);
  const [question, setQuestion] = useState(null);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get(`/admin/questions/${id}`),
      api.get("/admin/exams"),
      api.get("/admin/subjects"),
    ])
      .then(([questionRes, examRes, subjectRes]) => {
        setQuestion(questionRes.data.data);
        setExams(examRes.data.data || []);
        setSubjects(subjectRes.data.data || []);
      })
      .catch((error) => toast.error(error.message));
  }, [id]);

  return (
    <>
      <DashboardHeader title="Edit question" />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background p-5">
          {question ? (
            <QuestionForm question={question} exams={exams} subjects={subjects} />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </div>
      </div>
    </>
  );
}
