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

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);

  async function load() {
    const { data } = await api.get("/admin/questions");
    setQuestions(data.data || []);
  }

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  async function remove(id) {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success("Question deleted");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Questions"
        actions={
          <Button asChild>
            <Link href="/dashboard/questions/new">
              <Plus className="size-4" />
              New question
            </Link>
          </Button>
        }
      />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question._id}>
                  <TableCell>{question.questionNo}</TableCell>
                  <TableCell className="max-w-md truncate">{question.question}</TableCell>
                  <TableCell>{question.subjectId?.name || "—"}</TableCell>
                  <TableCell className="uppercase">{question.answerKey}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/questions/${question._id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(question._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!questions.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    No questions yet.
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
