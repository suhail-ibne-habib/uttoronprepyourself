import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SubjectForm from "@/components/dashboard/SubjectForm";

export default function NewSubjectPage() {
  return (
    <>
      <DashboardHeader title="New subject" />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background p-5">
          <SubjectForm />
        </div>
      </div>
    </>
  );
}
