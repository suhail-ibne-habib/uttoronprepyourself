import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  code: z.string().trim().optional(),
  description: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
  examIds: z.array(z.string()).min(1, "Select at least one exam"),
});
