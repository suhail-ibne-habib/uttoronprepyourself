"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StudyTopicForm from "@/components/dashboard/StudyTopicForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditStudyTopicPage({ params }) {
  const { id } = use(params);
  const [topic, setTopic] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get(`/admin/study-topics/${id}`),
      api.get("/admin/subjects"),
      api.get("/admin/study-topics"),
    ])
      .then(([topicRes, subjectRes, listRes]) => {
        setTopic(topicRes.data.data);
        setSubjects(subjectRes.data.data || []);
        setTopics(listRes.data.data || []);
      })
      .catch((error) => toast.error(error.message));
  }, [id]);

  return (
    <>
      <DashboardHeader title="Edit study lesson" />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background p-5">
          {topic ? (
            <StudyTopicForm topic={topic} subjects={subjects} topics={topics} />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </div>
      </div>
    </>
  );
}
