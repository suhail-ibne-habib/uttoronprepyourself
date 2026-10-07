"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, FileQuestion, Library } from "lucide-react";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const actions = [
  {
    href: "/dashboard/exams/new",
    title: "Create exam",
    description: "Add a paper by exam name, year and level.",
  },
  {
    href: "/dashboard/subjects/new",
    title: "Add subject",
    description: "English, Bangla, GK and other subject records.",
  },
  {
    href: "/dashboard/questions/new",
    title: "Add question",
    description: "MCQ stem, options, answer key and explanation.",
  },
  {
    href: "/dashboard/digitize",
    title: "Digitize a photo",
    description: "Review a scanned question before it is saved.",
  },
];

export default function DashboardPage() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/admin/exams"),
      api.get("/admin/subjects"),
      api.get("/admin/questions"),
    ])
      .then(([examRes, subjectRes, questionRes]) => {
        setExams(examRes.data.data || []);
        setSubjects(subjectRes.data.data || []);
        setQuestions(questionRes.data.data || []);
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Exams", value: exams.length, href: "/dashboard/exams", icon: BookOpen },
    { label: "Subjects", value: subjects.length, href: "/dashboard/subjects", icon: Library },
    {
      label: "Questions",
      value: questions.length,
      href: "/dashboard/questions",
      icon: FileQuestion,
    },
  ];

  return (
    <>
      <DashboardHeader title="Overview" />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{stat.value}</p>
              </Link>
            ))}
          </div>

          <section className="overflow-hidden rounded-xl border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-medium">Get started</h2>
              <p className="text-xs text-muted-foreground">
                Create the paper first, then map subjects and add questions.
              </p>
            </div>
            <div className="grid sm:grid-cols-2">
              {actions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-muted/50 ${
                    index % 2 === 0 ? "sm:border-r sm:border-border" : ""
                  } ${index < actions.length - 1 ? "border-b border-border sm:border-b-0" : ""} ${
                    index < actions.length - (actions.length % 2 === 0 ? 2 : 1)
                      ? "sm:border-b sm:border-border"
                      : ""
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium">{action.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-medium">Recent exams</h2>
                <p className="text-xs text-muted-foreground">Latest papers in the archive</p>
              </div>
              <Link
                href="/dashboard/exams"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.slice(0, 6).map((exam) => (
                  <TableRow key={exam._id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{exam.year}</TableCell>
                    <TableCell className="uppercase">{exam.examType}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{exam.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {!exams.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No exams yet. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </section>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-72">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Workflow
            </p>
            <ol className="mt-3 space-y-3 text-sm">
              <li className="rounded-lg border border-border px-3 py-2">1. Create an exam</li>
              <li className="rounded-lg border border-border px-3 py-2">2. Add subjects and map them to exams</li>
              <li className="rounded-lg border border-border px-3 py-2">3. Add questions</li>
            </ol>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium">Public site</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Published papers appear on the exam pages. Drafts stay in the dashboard.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
            >
              Open exams
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
