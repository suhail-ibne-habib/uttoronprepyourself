"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);

  async function load() {
    const { data } = await api.get("/admin/subjects");
    setSubjects(data.data || []);
  }

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  async function remove(id) {
    if (!confirm("Delete this subject?")) return;
    try {
      await api.delete(`/admin/subjects/${id}`);
      toast.success("Subject deleted");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Subjects"
        actions={
          <Button asChild>
            <Link href="/dashboard/subjects/new">
              <Plus className="size-4" />
              New subject
            </Link>
          </Button>
        }
      />
      <p className="px-4 text-sm text-muted-foreground md:px-6">
        Reuse one subject across exams. Open English and map it to every paper that needs it.
      </p>
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.slug}</TableCell>
                  <TableCell className="max-w-xs text-xs text-muted-foreground">
                    {subject.exams?.length
                      ? subject.exams.map((exam) => `${exam.name} ${exam.year}`).join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>{subject.code || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subject.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/subjects/${subject._id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(subject._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!subjects.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    No subjects yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
