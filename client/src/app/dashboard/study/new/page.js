"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StudyTopicForm from "@/components/dashboard/StudyTopicForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewStudyTopicPage() {
  const [subjects, setSubjects] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/admin/subjects"), api.get("/admin/study-topics")])
      .then(([subjectRes, topicRes]) => {
        setSubjects(subjectRes.data.data || []);
        setTopics(topicRes.data.data || []);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  return (
    <>
      <DashboardHeader title="New study lesson" />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background p-5">
          {subjects ? (
            <StudyTopicForm subjects={subjects} topics={topics} />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </div>
      </div>
    </>
  );
}
