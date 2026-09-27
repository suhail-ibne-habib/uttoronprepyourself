import { z } from "zod";

const optionSchema = z.object({
  key: z.enum(["a", "b", "c", "d", "e"]),
  text: z.string().trim().min(1, "Option text is required"),
});

const emptyToUndef = (value) => (value === "" || value == null ? undefined : value);

export const questionSchema = z
  .object({
    examId: z.string().min(1, "Select an exam"),
    subjectId: z.string().min(1, "Select a subject"),
    questionNo: z.coerce.number().int().min(1, "Question number is required"),
    question: z.string().trim().min(3, "Question text is required"),
    options: z.array(optionSchema).min(2).max(5),
    answerKey: z.enum(["a", "b", "c", "d", "e"]),
    mark: z.coerce.number().min(0),
    difficulty: z.enum(["easy", "medium", "hard"]),
    primaryTopics: z.array(z.string()).optional(),
    secondaryTopics: z.array(z.string()).optional(),
    tertiaryTopics: z.array(z.string()).optional(),
    explanation: z.string().optional(),
    questionType: z.enum([
      "mcq",
      "true_false",
      "written",
      "fill_blank",
      "matching",
      "comprehension",
    ]),
    language: z.enum(["en", "bn"]),
    passage: z.string().optional(),
    sourceName: z.string().optional(),
    sourcePage: z.preprocess(emptyToUndef, z.coerce.number().int().min(1).optional()),
    sourceQuestionNo: z.preprocess(
      emptyToUndef,
      z.coerce.number().int().min(1).optional(),
    ),
    imageUrl: z.string().optional(),
    verified: z.boolean().optional(),
    reviewStatus: z.enum(["pending", "reviewed", "approved", "rejected"]),
    status: z.enum(["draft", "published", "archived"]),
  })
  .refine(
    (data) => data.options.some((option) => option.key === data.answerKey),
    {
      path: ["answerKey"],
      message: "Answer key must match one of the options",
    },
  );
