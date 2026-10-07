import { questionSchema } from "@/validations/question.schema";
import { isEmptyHtml } from "@/lib/explanation";

export function toQuestionPayload(draft) {
  const imageUrl = String(draft.imageSrc || "").startsWith("http") ? draft.imageSrc : "";
  const parsed = questionSchema.safeParse({
    examId: draft.examId,
    subjectId: draft.subjectId,
    questionNo: draft.questionNo,
    question: draft.question,
    options: draft.options,
    answerKey: draft.answerKey,
    mark: draft.mark,
    difficulty: draft.difficulty,
    primaryTopics: draft.primaryTopics,
    secondaryTopics: draft.secondaryTopics,
    tertiaryTopics: draft.tertiaryTopics,
    explanation: draft.explanation,
    questionType: draft.questionType,
    language: draft.language,
    passage: draft.passage,
    sourceName: draft.sourceName,
    sourcePage: draft.sourcePage,
    sourceQuestionNo: draft.sourceQuestionNo,
    imageUrl,
    verified: draft.verified,
    reviewStatus: draft.reviewStatus,
    status: draft.status,
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path?.join(".") || "form";
    throw new Error(issue?.message ? `${path}: ${issue.message}` : "Check the question fields");
  }

  const values = parsed.data;
  return {
    examId: values.examId,
    subjectId: values.subjectId,
    questionNo: values.questionNo,
    question: values.question,
    options: values.options,
    answerKey: values.answerKey,
    mark: values.mark,
    difficulty: values.difficulty,
    questionType: values.questionType,
    language: values.language,
    passage: values.passage || null,
    explanation: isEmptyHtml(values.explanation) ? null : values.explanation,
    verified: Boolean(values.verified),
    reviewStatus: values.reviewStatus,
    status: values.status,
    primaryTopics: values.primaryTopics || [],
    secondaryTopics: values.secondaryTopics || [],
    tertiaryTopics: values.tertiaryTopics || [],
    source: {
      name: values.sourceName || null,
      page: values.sourcePage || null,
      questionNo: values.sourceQuestionNo || null,
    },
    image: {
      url: values.imageUrl || null,
    },
  };
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
