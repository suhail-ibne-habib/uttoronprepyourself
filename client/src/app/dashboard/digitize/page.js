"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import DigitizeStudio from "@/components/dashboard/digitize/DigitizeStudio";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";

export default function DigitizePage() {
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
      <DashboardHeader title="Digitize" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        {exams ? (
          <DigitizeStudio exams={exams} subjects={subjects} />
        ) : (
          <Skeleton className="h-[32rem] w-full" />
        )}
      </div>
    </>
  );
}
