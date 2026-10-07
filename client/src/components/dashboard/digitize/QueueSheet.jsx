"use client";

import { Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function QueueSheet({
  open,
  onOpenChange,
  items,
  exams,
  subjects,
  onRemove,
  onExportOne,
  onExportAll,
}) {
  function nameFor(list, id) {
    const match = list.find((item) => item._id === id);
    if (!match) return "—";
    return match.year ? `${match.name} ${match.year}` : match.name;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] gap-0 p-0 sm:max-w-none">
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>Session queue</SheetTitle>
          <SheetDescription>
            {items.length} question{items.length === 1 ? "" : "s"} ready as question records. This stays in the browser until the scanner can save them.
          </SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-end gap-2 border-b border-border px-4 py-2">
          <Button type="button" size="sm" variant="outline" onClick={onExportAll} disabled={!items.length}>
            <Download />
            Export all
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.question.questionNo}</TableCell>
                  <TableCell>{nameFor(exams, item.question.examId)}</TableCell>
                  <TableCell>{nameFor(subjects, item.question.subjectId)}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.question.question}</TableCell>
                  <TableCell className="uppercase">{item.question.answerKey}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.question.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => onExportOne(item)} aria-label="Export JSON">
                      <Download />
                    </Button>
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => onRemove(item.id)} aria-label="Remove from queue">
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!items.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    Nothing queued yet. Review a question, then add it here.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
