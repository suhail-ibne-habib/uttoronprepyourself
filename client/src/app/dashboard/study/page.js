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

export default function StudyTopicsPage() {
  const [topics, setTopics] = useState([]);

  async function load() {
    const { data } = await api.get("/admin/study-topics");
    setTopics(data.data || []);
  }

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  async function remove(id) {
    if (!confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/admin/study-topics/${id}`);
      toast.success("Lesson deleted");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Study lessons"
        actions={
          <Button asChild>
            <Link href="/dashboard/study/new">
              <Plus className="size-4" />
              New lesson
            </Link>
          </Button>
        }
      />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic._id}>
                  <TableCell className="font-medium">{topic.title}</TableCell>
                  <TableCell>{topic.subjectId?.name || "—"}</TableCell>
                  <TableCell>{topic.parentId?.title || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{topic.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/study/${topic._id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(topic._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!topics.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No lessons yet.
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
