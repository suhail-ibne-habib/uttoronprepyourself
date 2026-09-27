import { z } from "zod";

export const studyTopicSchema = z.object({
  subjectId: z.string().min(1, "Select a subject"),
  parentId: z.string().optional(),
  title: z.string().trim().min(2, "Title is required"),
  slug: z.string().optional(),
  aliases: z.string().optional(),
  summary: z.string().optional(),
  body: z.string().optional(),
  order: z.coerce.number().int().min(0),
  status: z.enum(["draft", "published"]),
});
