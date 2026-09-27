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

export default function ExamsPage() {
  const [exams, setExams] = useState([]);

  async function load() {
    const { data } = await api.get("/admin/exams");
    setExams(data.data || []);
  }

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  async function remove(id) {
    if (!confirm("Delete this exam and its questions?")) return;
    try {
      await api.delete(`/admin/exams/${id}`);
      toast.success("Exam deleted");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Exams"
        actions={
          <Button asChild>
            <Link href="/dashboard/exams/new">
              <Plus className="size-4" />
              New exam
            </Link>
          </Button>
        }
      />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam._id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell className="font-mono text-xs">{exam.slug}</TableCell>
                  <TableCell>{exam.year}</TableCell>
                  <TableCell className="uppercase">{exam.examType}</TableCell>
                  <TableCell>{exam.level}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{exam.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/exams/${exam._id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(exam._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!exams.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    No exams yet.
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
