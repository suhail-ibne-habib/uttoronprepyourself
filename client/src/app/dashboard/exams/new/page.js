import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExamForm from "@/components/dashboard/ExamForm";

export default function NewExamPage() {
  return (
    <>
      <DashboardHeader title="New exam" />
      <div className="p-4 md:p-6">
        <div className="max-w-3xl rounded-xl border border-border bg-background p-5">
          <ExamForm />
        </div>
      </div>
    </>
  );
}
