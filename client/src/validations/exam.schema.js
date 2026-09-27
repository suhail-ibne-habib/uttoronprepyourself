import { z } from "zod";

export const examSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  examType: z.enum(["ntrca", "bpsc", "primary", "bank", "other"]),
  examNumber: z.union([z.literal(""), z.coerce.number().int().positive()]).optional(),
  year: z.coerce
    .number()
    .int()
    .min(1990, "Enter a valid year")
    .max(2100, "Enter a valid year"),
  level: z.enum(["school", "school-2", "college", "primary", "other"]),
  description: z.string().trim().optional(),
  duration: z.union([z.literal(""), z.coerce.number().int().positive()]).optional(),
  negativeMarking: z.union([z.literal(""), z.coerce.number().min(0)]).optional(),
  status: z.enum(["draft", "published", "archived"]),
});
